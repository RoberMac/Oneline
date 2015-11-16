"use strict";
const extend  = require('extend');
const Twit    = require('twit');
const Ig      = require('instagram-node').instagram();
const Weibo   = require('./weibo');
const timelineFilter = require('./filter/timeline');
const actionsFilter = require('./filter/actions');


let Actions = {
    twitter: {
        user: {
            _get: (opts) => {
                let user = isNaN(opts.id) ? { screen_name: opts.id } : { user_id: opts.id };

                return {
                    triggerActionType: 'combination',
                    endpoint: 'users/show',
                    endpoint2: 'statuses/user_timeline',
                    tOpts: extend(user, { include_entities: false }),
                    tOpts2: extend(user, {
                        count: 7,
                        trim_user: false,
                        exclude_replies: false,
                        contributor_details: false,
                        include_rts: true
                    }),
                    handleActionFunc: (data1, data2) => {
                        let data;
                        data = actionsFilter.twitter.user(data1[0]);
                        extend(data, { timeline: timelineFilter.twitter(data2[0]).data })
                        return { data: data }
                    }
                }
            }
        },
        direct: {
            _get: (opts) => {
                return {
                    triggerActionType: 'combination',
                    endpoint: 'direct_messages',
                    endpoint2: 'direct_messages/sent',
                    tOpts: {
                        count: 200,
                        since_id: opts.query && opts.query.min_id,
                        include_entities: true
                    },
                    tOpts2: {
                        count: 200,
                        since_id: opts.query && opts.query.min_id,
                        include_entities: true
                    },
                    handleActionFunc: (data1, data2) => {
                        let data;

                        data1 = actionsFilter.twitter.direct(data1[0])
                        data2 = actionsFilter.twitter.direct(data2[0])

                        data = {
                            data    : data1.data.concat(data2.data),
                            min_id  : (data1.min_date < data2.min_date
                                            ? data1.min_id
                                        : data2.min_id) || data1.min_id || data2.min_id,
                            min_date: Math.min(data1.min_date, data2.min_date) || undefined,
                            max_id  : (data1.max_date > data2.max_date 
                                            ? data1.max_id
                                        : data2.max_id) || data1.max_id || data2.max_id,
                            max_date: Math.max(data1.max_date, data2.max_date) || undefined
                        }

                        return { data: data }
                    }
                }
            },
            _post: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'direct_messages/new',
                    tOpts: {
                        screen_name: opts.id,
                        text: opts.params.text
                    },
                    handleActionFunc: (data) => (actionsFilter.twitter.direct([data[0]]))
                }
            }
        },
        like: {
            _put: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'favorites/create',
                    tOpts: { id: opts.id, include_entities: false },
                    handleActionFunc: () => ({ msg: 'ok' })
                }
            },
            _delete: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'favorites/destroy',
                    tOpts: { id: opts.id, include_entities: false },
                    handleActionFunc: () => ({ msg: 'ok' })
                }
            }
        },
        retweet: {
            _get: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'statuses/retweets',
                    tOpts: { id: opts.id, count: 50, trim_user: false },
                    handleActionFunc: (data) => ({ data: actionsFilter.twitter['retweet'](data[0])})
                }
            },
            _post: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'statuses/retweet',
                    tOpts: { id: opts.id, trim_user: true },
                    handleActionFunc: (data) => ({ id_str: data[0].id_str })
                }
            },
            _delete: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'statuses/destroy',
                    tOpts: { id: opts.id, trim_user: true },
                    handleActionFunc: () => ({ msg: 'ok' })
                }
            },
        },
        reply: newStatuses('reply'),
        quote: newStatuses('quote'),
        tweet: newStatuses('tweet'),
        follow: {
            _get: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'friends/list',
                    tOpts: {
                        user_id: opts.id,
                        count: 200,
                        skip_status: true,
                        include_user_entities: false
                    },
                    handleActionFunc: (data) => ({ data: actionsFilter.twitter['follow'](data.users)})
                }
            },
            _put: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'friendships/create',
                    tOpts: { id: opts.id },
                    handleActionFunc: () => ({ msg: 'ok' })
                }
            },
            _delete: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'friendships/destroy',
                    tOpts: { id: opts.id },
                    handleActionFunc: () => ({ msg: 'ok' })
                }
            },
        },
        mentions: {
            _get: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'statuses/mentions_timeline',
                    tOpts: extend({}, {
                        count: 200,
                        since_id: opts.query.min_id,
                        include_entities: false,
                        contributor_details: false
                    }),
                    handleActionFunc: (data) => ({ data: timelineFilter.twitter(data[0]) })
                }
            }
        },
        user_timeline: {
            _get: (opts) => {
                let user = isNaN(opts.id) ? { screen_name: opts.id } : { user_id: opts.id };

                return {
                    triggerActionType: 'basic',
                    endpoint: 'statuses/user_timeline',
                    tOpts: extend(user, {
                        max_id: opts.query && opts.query.max_id,
                        count: 20,
                        trim_user: false,
                        exclude_replies: false,
                        contributor_details: false,
                        include_rts: true
                    }),
                    handleActionFunc: (data) => {
                        data[0].splice(0, 1)
                        return { data: timelineFilter.twitter(data[0]).data }
                    }
                }
            }
        },
        search: {
            _get: (opts) => {
                let tOpts = {
                    access_token: opts.token,
                    q: opts.id,
                    count: 20,
                    include_entities: false
                };

                if (opts.query.max_id){
                    extend(tOpts, { max_id: opts.query.max_id })
                }

                return {
                    triggerActionType: 'basic',
                    endpoint: 'search/tweets',
                    tOpts: tOpts,
                    handleActionFunc: (data) => {
                        if (opts.query.max_id){
                            data[0].statuses.splice(0, 1)
                        }

                        return { data: timelineFilter.twitter(data[0].statuses).data }
                    }
                }
            } 
        }
    },
    instagram: {
        user: {
            _get: (opts) => {
                let actionObj = {
                    triggerActionType: 'combination',
                    endpoint: 'user',
                    endpoint2: 'user_media_recent',
                    iOpts2: { count: 7 },
                    handleActionFunc: (userData, timelineData) => {
                        let data = actionsFilter.instagram.user(userData[0]);

                        extend(data, { timeline: timelineFilter.instagram(timelineData[0]).data })

                        return { data: data }
                    }
                };

                if (isNaN(opts.id)){
                    return {
                        triggerActionType: 'queue',
                        endpoint: 'user_search',
                        iOpts: { count: 1 },
                        handleActionFunc: (data) => ({ uid: data[0][0].id }),
                        actionObj: actionObj
                    }
                } else {
                    return actionObj;
                }
            }
        },
        like: {
            _get: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'likes',
                    handleActionFunc: (data) => {
                        return { data: actionsFilter.instagram['like'](data[0].slice(0, 100)) }
                    }
                }
            }
        },
        reply: {
            _get: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'comments',
                    handleActionFunc: (data) => {
                        return { data: actionsFilter.instagram['reply'](data[0].slice(0, 100)) }
                    }
                }
            }
        },
        user_timeline: {
            _get: (opts) => {
                let actionObj = {
                    triggerActionType: 'basic',
                    endpoint: 'user_media_recent',
                    iOpts: { max_id: opts.query.max_id },
                    handleActionFunc: (data) => ({ data: timelineFilter.instagram(data[0]).data })
                }

                if (isNaN(opts.id)){
                    return {
                        triggerActionType: 'queue',
                        endpoint: 'user_search',
                        iOpts: { count: 1 },
                        handleActionFunc: (data) => ({ uid: data[0][0].id }),
                        actionObj: actionObj
                    }
                } else {
                    return actionObj;
                }
            }
        },
        location: {
            _get: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'location_media_recent',
                    iOpts: { max_id: opts.query.max_id },
                    handleActionFunc: (data) => ({ data: timelineFilter.instagram(data[0]).data })
                }
            }
        },
        tags: {
            _get: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'tag_media_recent',
                    iOpts: { max_tag_id: opts.query.max_id && opts.query.max_id.split('_')[0] },
                    handleActionFunc: (data) => {
                        if (opts.query.max_id){
                            data[0].splice(0, 1)
                        }

                        return { data: timelineFilter.instagram(data[0]).data }
                    }
                }
            }
        }
    },
    weibo: {
        user: {
            _get: (opts) => {
                return {
                    triggerActionType: 'combination',
                    endpoint: 'users/show',
                    endpoint2: 'statuses/user_timeline',
                    wOpts: { access_token: opts.token, uid: opts.id },
                    wOpts2: {
                        access_token: opts.token,
                        uid: opts.id,
                        count: 7
                    },
                    handleActionFunc: (data1, data2) => {
                        let data;
                        data = actionsFilter.weibo.user(data1);
                        extend(data, { timeline: timelineFilter.weibo(data2.statuses).data })
                        return { data: data }
                    }
                }
            }
        },
        star: {
            _put: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'favorites/create',
                    wOpts: { access_token: opts.token, id: opts.id },
                    handleActionFunc: (data) => ({ id_str: data.idstr })
                }
            },
            _delete: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'favorites/destroy',
                    wOpts: { access_token: opts.token, id: opts.id },
                    handleActionFunc: (data) => ({ id_str: data.idstr })
                }
            }
        },
        quote: {
            _post: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'statuses/repost',
                    wOpts: { access_token: opts.token, id: opts.id, status: opts.params.status },
                    handleActionFunc: (data) => ({ id_str: data.idstr })
                }
            }
        },
        retweet: {
            _post: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'statuses/repost',
                    wOpts: { access_token: opts.token, id: opts.id, status: opts.params.status },
                    handleActionFunc: (data) => ({ id_str: data.idstr })
                }
            },
            _delete: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'statuses/destroy',
                    wOpts: { access_token: opts.token, id: opts.id },
                    handleActionFunc: (data) => ({ id_str: data.idstr })
                }
            }
        },
        reply: {
            _get: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'comments/show',
                    wOpts: { access_token: opts.token, id: opts.id },
                    handleActionFunc: (data) => ({ data: actionsFilter.weibo.reply(data.comments) })
                }
            },
            _post: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'comments/create',
                    wOpts: { access_token: opts.token, id: opts.id, comment: opts.params.status },
                    handleActionFunc: (data) => ({ id_str: data.idstr })
                }
            }
        },
        tweet: {
            _post: (opts) => {
                let wOpts = { access_token: opts.token, id: opts.id, status: opts.params.status };

                extend(wOpts, {
                    access_token: opts.token,
                    id: opts.id,
                    status: opts.params.status,
                    lat: opts.params.geo && opts.params.geo.lat,
                    long: opts.params.geo && opts.params.geo.long
                })

                return {
                    triggerActionType: 'basic',
                    endpoint: 'statuses/update',
                    wOpts: wOpts,
                    handleActionFunc: () => ({ msg: 'ok' })
                }
            }
        },
        user_timeline: {
            _get: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'statuses/user_timeline',
                    wOpts: {
                        access_token: opts.token,
                        uid: opts.id,
                        count: 20,
                        max_id: opts.query && opts.query.max_id
                    },
                    handleActionFunc: (data) => {
                        data.statuses.splice(0, 1)

                        return { data: timelineFilter.weibo(data.statuses).data }
                    }
                }
            }   
        },
        user_in_tweet: {
            _get: (opts) => {
                return {
                    triggerActionType: 'basic',
                    endpoint: 'place/statuses/show', // 😂
                    wOpts: {
                        access_token: opts.token,
                        id: opts.id
                    },
                    handleActionFunc: (_data) => {
                        let data = actionsFilter.weibo.user(_data.user);

                        extend(data, { timeline: timelineFilter.weibo([_data]).data })

                        return { data: data }
                    }
                }
            }  
        },
        location: {
            _get: (opts) => {
                let wOpts = {
                    access_token: opts.token,
                    count: 20,
                    lat: opts.id.split('_')[0],
                    long: opts.id.split('_')[1]
                }

                if (opts.query.max_id){
                    extend(wOpts, { endtime: opts.query.max_id.slice(0, -3) })
                }

                return {
                    triggerActionType: 'basic',
                    endpoint: 'place/nearby_timeline',
                    wOpts: wOpts,
                    handleActionFunc: (data) => {
                        if (opts.query.max_id){
                            data.statuses.splice(0, 1)
                        }

                        return { data: timelineFilter.weibo(data.statuses).data }
                    }
                }
            } 
        }
    }
}

function newStatuses (action){
    return {
        _post: (opts) => {
            let tOpts = {};
            extend(tOpts, {
                status: opts.params.status,
                media_ids: opts.params.media_ids,
                trim_user: true,
                possibly_sensitive: opts.params.sensitive,
                lat: opts.params.geo && opts.params.geo.lat,
                long: opts.params.geo && opts.params.geo.long
            })
            if (action === 'reply' && opts.id){
                extend(tOpts, {
                    in_reply_to_status_id: opts.id
                })
            }

            let handleActionFunc;
            if (action === 'quote'){
                handleActionFunc = (data) => ({ id_str: data[0].id_str })
            } else {
                handleActionFunc = () => ({ msg: 'ok' })
            }

            return {
                triggerActionType: 'basic',
                endpoint: 'statuses/update',
                tOpts: tOpts,
                handleActionFunc: handleActionFunc
            }
        }
    }
}



module.exports = {
    twitter: (action, opts) => {
        let T = new Twit({
            consumer_key       : process.env.TWITTER_KEY,
            consumer_secret    : process.env.TWITTER_SECRET,
            access_token       : opts.token,
            access_token_secret: opts.tokenSecret
        });

        // Init
        let _method = '_' + opts.method;
        let q_twit  = Q.nbind(T[_method === '_get' ? 'get' : 'post'], T);

        let triggerAction = {
            basic: (t) => q_twit(t.endpoint, t.tOpts).then(t.handleActionFunc),
            combination: (t) => {
                return Q.all([
                    q_twit(t.endpoint, t.tOpts),
                    q_twit(t.endpoint2, t.tOpts2)
                ]).spread(t.handleActionFunc);
            }
        };

        // Fire
        try {
            let t = Actions.twitter[action][_method](opts);

            return triggerAction[t.triggerActionType](t)
        } catch (e){
            console.log(e)
            throw { statusCode: 405 }
        }
    },
    instagram: (action, opts) => {
        Ig.use({ access_token : opts.token })

        // Init
        let _method = '_' + opts.method;

        let triggerAction = {
            basic: (i) => {
                return (i.iOpts
                            ? Q.nbind(Ig[i.endpoint], Ig)(opts.id, i.iOpts)
                        : Q.nbind(Ig[i.endpoint], Ig)(opts.id)
                        )
                .then(i.handleActionFunc)
                .catch((err) => {
                    if (err.error_type){
                        throw { statusCode: 400, msg: 'you cannot view this resource' }
                    } else {
                        throw err
                    }
                });
            },
            combination: (i) => {
                return Q.all([
                    i.iOpts 
                        ? Q.nbind(Ig[i.endpoint], Ig)(opts.id, i.iOpts)
                    : Q.nbind(Ig[i.endpoint], Ig)(opts.id),
                    i.iOpts2
                        ? Q.nbind(Ig[i.endpoint2], Ig)(opts.id, i.iOpts2)
                    : Q.nbind(Ig[i.endpoint2], Ig)(opts.id)
                ])
                .spread(i.handleActionFunc)
                .catch((err) => {
                    if (err.error_type){
                        throw { statusCode: 400, msg: 'you cannot view this resource' }
                    } else {
                        throw err
                    }
                })
            },
            queue: (i) => {
                return triggerAction.basic(i)
                .then((data) => {
                    opts.id = data.uid
                    i = i.actionObj
                    return triggerAction[i.triggerActionType](i);
                })
            }
        };

        // Fire
        try {
            let i = Actions.instagram[action][_method](opts);
            return triggerAction[i.triggerActionType](i)
        } catch (e){
            console.log(e)
            throw { statusCode: 405 }
        }
    },
    weibo: (action, opts) => {
        // Init
        let _method = '_' + opts.method;
        let __method = opts.method === 'get' ? 'get' : 'post';

        let triggerAction = {
            basic: (w) => {
                return Weibo({
                    method: __method,
                    endpoint: w.endpoint,
                    opts: w.wOpts
                })
                .then(w.handleActionFunc)
            },
            combination: (w) => {
                return Q.all([
                    Weibo({
                        method: __method,
                        endpoint: w.endpoint,
                        opts: w.wOpts
                    }),
                    Weibo({
                        method: __method,
                        endpoint: w.endpoint2,
                        opts: w.wOpts2
                    })
                ]).spread(w.handleActionFunc);
            }
        };

        // Fire
        try {
            let w = Actions.weibo[action][_method](opts);

            return triggerAction[w.triggerActionType](w)
        } catch (e){
            console.log(e)
            throw { statusCode: 405 }
        }
    }
}

