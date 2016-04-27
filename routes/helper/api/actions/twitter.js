/* eslint no-else-return: 0 */

const Twit    = require('twit');
const timelineFilter = require(`${__base}/routes/helper/filter/timeline`);
const actionsFilter = require(`${__base}/routes/helper/filter/actions`);

const _commonSearch = {
    _get({ id, token, query }) {
        const tOpts = {
            access_token    : token,
            q               : id,
            count           : 20,
            include_entities: false,
        };

        if (query.maxId) {
            Object.assign(tOpts, { max_id: query.maxId });
        }

        return {
            triggerActionType: 'basic',
            action           : { endpoint: 'search/tweets', tOpts },
            handleActionFunc : data => {
                if (query.maxId) {
                    data[0].statuses.splice(0, 1);
                }

                return { data: timelineFilter.twitter(data[0].statuses).data };
            },
        };
    },
};
const _buildAction = {
    user: {
        _get({ id, query }) {
            const user = isNaN(id) ? { screen_name: id } : { user_id: id };
            const commonOpts = {
                trim_user          : false,
                exclude_replies    : false,
                contributor_details: false,
                include_rts        : true,
            };
            if (query && query.maxId) {
                return {
                    triggerActionType: 'basic',
                    action           : {
                        endpoint: 'statuses/user_timeline',
                        tOpts   : Object.assign(
                            user, { max_id: query.maxId, count: 20 },
                            commonOpts
                        ),
                    },
                    handleActionFunc: data => {
                        data[0].splice(0, 1);
                        return { data: timelineFilter.twitter(data[0]).data };
                    },
                };
            } else {
                return {
                    triggerActionType: 'combination',
                    actions          : [
                        {
                            endpoint: 'users/show',
                            tOpts   : Object.assign(user, { include_entities: false }),
                        },
                        {
                            endpoint: 'statuses/user_timeline',
                            tOpts   : Object.assign(user, { count: 7 }, commonOpts),
                        },
                    ],
                    handleActionFunc: (data1, data2) => {
                        return {
                            user: actionsFilter.twitter.user(data1[0]),
                            data: timelineFilter.twitter(data2[0]).data,
                        };
                    },
                };
            }
        },
    },
    direct: {
        _get({ query }) {
            return {
                triggerActionType: 'combination',
                actions          : [
                    {
                        endpoint: 'direct_messages',
                        tOpts   : {
                            count           : 200,
                            since_id        : query && query.minId,
                            include_entities: true,
                        },
                    },
                    {
                        endpoint: 'direct_messages/sent',
                        tOpts   : {
                            count           : 200,
                            since_id        : query && query.minId,
                            include_entities: true,
                        },
                    },
                ],
                handleActionFunc: (data1, data2) => {
                    data1 = actionsFilter.twitter.direct(data1[0]);
                    data2 = actionsFilter.twitter.direct(data2[0]);

                    const data = {
                        data : data1.data.concat(data2.data),
                        minId: (data1.minDate < data2.minDate ? data1.minId : data2.minId
                        ) || data1.minId || data2.minId,
                        minDate: Math.min(data1.minDate, data2.minDate) || undefined,
                        maxId  : (
                            data1.maxDate > data2.maxDate ? data1.maxId : data2.maxId
                        ) || data1.maxId || data2.maxId,
                        maxDate: Math.max(data1.maxDate, data2.maxDate) || undefined,
                    };

                    return { data };
                },
            };
        },
        _post({ id, params }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    endpoint: 'direct_messages/new',
                    tOpts   : {
                        screen_name: id,
                        text       : params.text,
                    },
                },
                handleActionFunc: data => (actionsFilter.twitter.direct([data[0]])),
            };
        },
    },
    like: {
        _put({ id }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    endpoint: 'favorites/create',
                    tOpts   : { id, include_entities: false },
                },
                handleActionFunc: () => ({ msg: 'ok' }),
            };
        },
        _delete({ id }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    endpoint: 'favorites/destroy',
                    tOpts   : { id, include_entities: false },
                },
                handleActionFunc: () => ({ msg: 'ok' }),
            };
        },
    },
    retweet: {
        _post({ id }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    endpoint: 'statuses/retweet',
                    tOpts   : { id, trim_user: true },
                },
                handleActionFunc: data => ({ id_str: data[0].id_str }),
            };
        },
    },
    reply: {
        _post({ id, params }) {
            const { status, media_ids, sensitive, geo } = params;
            const tOpts = {
                status,
                media_ids,
                trim_user            : true,
                possibly_sensitive   : sensitive,
                in_reply_to_status_id: id,
                lat                  : geo && geo.lat,
                long                 : geo && geo.long,
            };

            return {
                triggerActionType: 'basic',
                action           : { endpoint: 'statuses/update', tOpts },
                handleActionFunc : () => ({ msg: 'ok' }),
            };
        },
    },
    quote: {
        _post({ params }) {
            const { status, media_ids, sensitive, geo } = params;
            const tOpts = {
                status,
                media_ids,
                trim_user         : true,
                possibly_sensitive: sensitive,
                lat               : geo && geo.lat,
                long              : geo && geo.long,
            };

            return {
                triggerActionType: 'basic',
                action           : { endpoint: 'statuses/update', tOpts },
                handleActionFunc : data => ({ id_str: data[0].id_str }),
            };
        },
    },
    tweet: {
        _post({ params }) {
            const { status, media_ids, sensitive, geo } = params;
            const tOpts = {
                status,
                media_ids,
                trim_user         : true,
                possibly_sensitive: sensitive,
                lat               : geo && geo.lat,
                long              : geo && geo.long,
            };

            return {
                triggerActionType: 'basic',
                action           : { endpoint: 'statuses/update', tOpts },
                handleActionFunc : () => ({ msg: 'ok' }),
            };
        },
        _delete({ id }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    endpoint: 'statuses/destroy',
                    tOpts   : { id, trim_user: true },
                },
                handleActionFunc: () => ({ msg: 'ok' }),
            };
        },
    },
    follow: {
        _get({ id }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    endpoint: 'friends/list',
                    tOpts   : {
                        user_id              : id,
                        count                : 200,
                        skip_status          : true,
                        include_user_entities: false,
                    },
                },
                handleActionFunc: data => ({ data: actionsFilter.twitter.follow(data.users) }),
            };
        },
        _put({ id }) {
            return {
                triggerActionType: 'basic',
                action           : { endpoint: 'friendships/create', tOpts: { id } },
                handleActionFunc : () => ({ msg: 'ok' }),
            };
        },
        _delete({ id }) {
            return {
                triggerActionType: 'basic',
                action           : { endpoint: 'friendships/destroy', tOpts: { id } },
                handleActionFunc : () => ({ msg: 'ok' }),
            };
        },
    },
    mentions: {
        _get({ query }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    endpoint: 'statuses/mentions_timeline',
                    tOpts   : Object.assign({}, {
                        count              : 200,
                        since_id           : query.minId,
                        include_entities   : false,
                        contributor_details: false,
                    }),
                },
                handleActionFunc: data => ({ data: timelineFilter.twitter(data[0]) }),
            };
        },
    },
    locations: _commonSearch,
    tags     : _commonSearch,
    search   : _commonSearch,
    detail   : {
        _get({ id }) {
            return {
                triggerActionType: 'combination',
                actions          : [
                    {
                        endpoint: 'statuses/show',
                        tOpts   : { id, trim_user: false, include_entities: false },
                    },
                    {
                        endpoint: 'statuses/retweets',
                        tOpts   : { id, count: 50, trim_user: false },
                    },
                ],
                handleActionFunc: (postData, retweetedData) => {
                    const post = timelineFilter.twitter([postData[0]]).data[0];
                    const retweet = actionsFilter.twitter.retweet(retweetedData[0]);
                    return { post, retweet };
                },
            };
        },
    },
    trends: {
        _get({ id }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    endpoint: 'trends/place',
                    tOpts   : { id },
                },
                handleActionFunc: data => {
                    return {
                        data      : actionsFilter.twitter.trends(data[0][0].trends),
                        created_at: Date.parse(data[0][0].created_at),
                    };
                },
            };
        },
    },
};


module.exports = (action, opts) => {
    const T = new Twit({
        consumer_key       : process.env.TWITTER_KEY,
        consumer_secret    : process.env.TWITTER_SECRET,
        access_token       : opts.token,
        access_token_secret: opts.tokenSecret,
    });
    const _method = `_${opts.method}`;
    const promiseTwit  = Q.nbind(T[_method === '_get' ? 'get' : 'post'], T);
    const triggerAction = {
        basic      : t => promiseTwit(t.action.endpoint, t.action.tOpts).then(t.handleActionFunc),
        combination: t => {
            const promiseAll = [];
            t.actions.forEach(actionItem => {
                promiseAll.push(promiseTwit(actionItem.endpoint, actionItem.tOpts));
            });

            return Q.all(promiseAll).spread(t.handleActionFunc);
        },
    };

    try {
        const t = _buildAction[action][_method](opts);
        return triggerAction[t.triggerActionType](t);
    } catch (e) {
        console.log(e);
        throw { statusCode: 405 };
    }
};
