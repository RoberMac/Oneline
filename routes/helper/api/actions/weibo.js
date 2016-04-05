"use strict";
const Weibo   = require(`${__base}/utils/wrapper/weibo`);
const timelineFilter = require(`${__base}/routes/helper/filter/timeline`);
const actionsFilter = require(`${__base}/routes/helper/filter/actions`);


const _buildAction = {
    user: {
        _get(opts) {
            if (opts.query && opts.query.maxId){
                return {
                    triggerActionType: 'basic',
                    action: {
                        method: 'get',
                        endpoint: 'statuses/user_timeline',
                        opts: {
                            access_token: opts.token,
                            uid: opts.id,
                            count: 20,
                            maxId: opts.query && opts.query.maxId
                        }
                    },
                    handleActionFunc: data => {
                        data.statuses.splice(0, 1)
                        return { data: timelineFilter.weibo(data.statuses).data };
                    }
                };
            } else {
                return {
                    triggerActionType: 'combination',
                    actions: [
                        {
                            method: 'get',
                            endpoint: 'users/show',
                            opts: {
                                access_token: opts.token,
                                uid: opts.id
                            }
                        },
                        {
                            method: 'get',
                            endpoint: 'statuses/user_timeline',
                            opts: {
                                access_token: opts.token,
                                uid: opts.id,
                                count: 7
                            }
                        }
                    ],
                    handleActionFunc: (data1, data2) => {
                        const user = actionsFilter.weibo.user(data1);
                        const data = timelineFilter.weibo(data2.statuses).data;
                        return { user, data };
                    }
                };
            }
        }
    },
    star: {
        _put(opts) {
            return {
                triggerActionType: 'basic',
                action: {
                    method: 'post',
                    endpoint: 'favorites/create',
                    opts: { access_token: opts.token, id: opts.id }
                },
                handleActionFunc: data => ({ id_str: data.idstr })
            }
        },
        _delete(opts) {
            return {
                triggerActionType: 'basic',
                action: {
                    method: 'post',
                    endpoint: 'favorites/destroy',
                    opts: { access_token: opts.token, id: opts.id }
                },
                handleActionFunc: data => ({ id_str: data.idstr })
            }
        }
    },
    quote: {
        _post(opts) {
            return {
                triggerActionType: 'basic',
                action: {
                    method: 'post',
                    endpoint: 'statuses/repost',
                    opts: { access_token: opts.token, id: opts.id, status: opts.params.status }
                },
                handleActionFunc: data => ({ id_str: data.idstr })
            }
        }
    },
    retweet: {
        _post(opts) {
            return {
                triggerActionType: 'basic',
                action: {
                    method: 'post',
                    endpoint: 'statuses/repost',
                    opts: { access_token: opts.token, id: opts.id, status: opts.params.status }
                },
                handleActionFunc: data => ({ id_str: data.idstr })
            }
        }
    },
    reply: {
        _post(opts) {
            return {
                triggerActionType: 'basic',
                action: {
                    method: 'post',
                    endpoint: 'comments/create',
                    opts: { access_token: opts.token, id: opts.id, comment: opts.params.status }
                },
                handleActionFunc: data => ({ id_str: data.idstr })
            }
        }
    },
    tweet: {
        _post(opts) {
            let wOpts = { access_token: opts.token, id: opts.id, status: opts.params.status };

            Object.assign(opts, {
                access_token: opts.token,
                id: opts.id,
                status: opts.params.status,
                lat: opts.params.geo && opts.params.geo.lat,
                long: opts.params.geo && opts.params.geo.long
            });

            return {
                triggerActionType: 'basic',
                action: { method: 'post', endpoint: 'statuses/update', opts: wOpts },
                handleActionFunc: () => ({ msg: 'ok' })
            };
        },
        _delete(opts) {
            return {
                triggerActionType: 'basic',
                action: {
                    method: 'post',
                    endpoint: 'statuses/destroy',
                    opts: { access_token: opts.token, id: opts.id }
                },
                handleActionFunc: data => ({ id_str: data.idstr })
            }
        }
    },
    user_in_tweet: {
        _get(opts) {
            return {
                triggerActionType: 'basic',
                action: {
                    method: 'get',
                    endpoint: 'place/statuses/show', // 😂
                    opts: {
                        access_token: opts.token,
                        id: opts.id
                    }
                },
                handleActionFunc: _data => {
                    let data = actionsFilter.weibo.user(_data.user);

                    Object.assign(data, { timeline: timelineFilter.weibo([_data]).data })

                    return { data };
                }
            }
        }  
    },
    locations: {
        _get(opts) {
            let wOpts = {
                access_token: opts.token,
                count: 20,
                lat: opts.id.split('_')[0],
                long: opts.id.split('_')[1]
            };

            if (opts.query.maxId){
                Object.assign(opts, { endtime: opts.query.maxId.slice(0, -3) })
            }

            return {
                triggerActionType: 'basic',
                action: { method: 'get', endpoint: 'place/nearby_timeline', opts: wOpts },
                handleActionFunc: data => {
                    if (opts.query.maxId){
                        data.statuses.splice(0, 1)
                    }

                    return { data: timelineFilter.weibo(data.statuses).data };
                }
            }
        } 
    },
    detail: {
        _get(opts) {
            return {
                triggerActionType: 'basic',
                action: {
                    method: 'get',
                    endpoint: 'comments/show',
                    opts: { access_token: opts.token, id: opts.id }
                },
                handleActionFunc: data => ({ reply: actionsFilter.weibo.reply(data.comments) })
            }
        }
    }
};


module.exports = (action, opts) => {
    const triggerAction = {
        basic: w => {
            return Weibo({
                method: w.action.method,
                endpoint: w.action.endpoint,
                opts: w.action.opts
            })
            .then(w.handleActionFunc);
        },
        combination: w => {
            let promiseAll = [];
            w.actions.forEach(action => {
                promiseAll.push(Weibo({
                    method: action.method,
                    endpoint: action.endpoint,
                    opts: action.opts
                }))
            });

            return Q.all(promiseAll).spread(w.handleActionFunc);
        }
    };

    try {
        const w = _buildAction[action][`_${opts.method}`](opts);
        return triggerAction[w.triggerActionType](w);
    } catch (e){
        console.log(e)
        throw { statusCode: 405 };
    }
};