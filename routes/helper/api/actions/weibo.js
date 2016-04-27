/* eslint no-else-return: 0 */

const Weibo   = require(`${__base}/utils/wrapper/weibo`);
const timelineFilter = require(`${__base}/routes/helper/filter/timeline`);
const actionsFilter = require(`${__base}/routes/helper/filter/actions`);


const _buildAction = {
    user: {
        _get({ id, query, token }) {
            if (query && query.maxId) {
                return {
                    triggerActionType: 'basic',
                    action           : {
                        method  : 'get',
                        endpoint: 'statuses/user_timeline',
                        opts    : {
                            access_token: token,
                            uid         : id,
                            count       : 20,
                            maxId       : query && query.maxId,
                        },
                    },
                    handleActionFunc: data => {
                        data.statuses.splice(0, 1);
                        return { data: timelineFilter.weibo(data.statuses).data };
                    },
                };
            } else {
                return {
                    triggerActionType: 'combination',
                    actions          : [
                        {
                            method  : 'get',
                            endpoint: 'users/show',
                            opts    : {
                                access_token: token,
                                uid         : id,
                            },
                        },
                        {
                            method  : 'get',
                            endpoint: 'statuses/user_timeline',
                            opts    : {
                                access_token: token,
                                uid         : id,
                                count       : 7,
                            },
                        },
                    ],
                    handleActionFunc: (data1, data2) => {
                        return {
                            user: actionsFilter.weibo.user(data1),
                            data: timelineFilter.weibo(data2.statuses).data,
                        };
                    },
                };
            }
        },
    },
    star: {
        _put({ id, token }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    method  : 'post',
                    endpoint: 'favorites/create',
                    opts    : { id, access_token: token },
                },
                handleActionFunc: data => ({ id_str: data.idstr }),
            };
        },
        _delete({ id, token }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    method  : 'post',
                    endpoint: 'favorites/destroy',
                    opts    : { id, access_token: token },
                },
                handleActionFunc: data => ({ id_str: data.idstr }),
            };
        },
    },
    quote: {
        _post({ id, params, token }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    method  : 'post',
                    endpoint: 'statuses/repost',
                    opts    : { id, access_token: token, status: params.status },
                },
                handleActionFunc: data => ({ id_str: data.idstr }),
            };
        },
    },
    retweet: {
        _post({ id, params, token }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    method  : 'post',
                    endpoint: 'statuses/repost',
                    opts    : { id, access_token: token, status: params.status },
                },
                handleActionFunc: data => ({ id_str: data.idstr }),
            };
        },
    },
    reply: {
        _post({ id, params, token }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    method  : 'post',
                    endpoint: 'comments/create',
                    opts    : {
                        id,
                        access_token: token,
                        comment     : params.status,
                    },
                },
                handleActionFunc: data => ({ id_str: data.idstr }),
            };
        },
    },
    tweet: {
        _post({ id, params, token }) {
            const { status, geo } = params;
            const wOpts = { id, status, access_token: token };

            Object.assign(wOpts, {
                lat : geo && geo.lat,
                long: geo && geo.long,
            });

            return {
                triggerActionType: 'basic',
                action           : { method: 'post', endpoint: 'statuses/update', opts: wOpts },
                handleActionFunc : () => ({ msg: 'ok' }),
            };
        },
        _delete({ id, token }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    method  : 'post',
                    endpoint: 'statuses/destroy',
                    opts    : { id, access_token: token },
                },
                handleActionFunc: data => ({ id_str: data.idstr }),
            };
        },
    },
    user_in_tweet: {
        _get({ id, token }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    method  : 'get',
                    endpoint: 'place/statuses/show', // 😂
                    opts    : {
                        id,
                        access_token: token,
                    },
                },
                handleActionFunc: _data => {
                    const data = actionsFilter.weibo.user(_data.user);

                    Object.assign(data, { timeline: timelineFilter.weibo([_data]).data });

                    return { data };
                },
            };
        },
    },
    locations: {
        _get({ id, query, token }) {
            const wOpts = {
                access_token: token,
                count       : 20,
                lat         : id.split('_')[0],
                long        : id.split('_')[1],
            };

            if (query.maxId) {
                Object.assign(wOpts, { endtime: query.maxId.slice(0, -3) });
            }

            return {
                triggerActionType: 'basic',
                action           : {
                    method  : 'get',
                    endpoint: 'place/nearby_timeline',
                    opts    : wOpts,
                },
                handleActionFunc: data => {
                    if (query.maxId) {
                        data.statuses.splice(0, 1);
                    }

                    return { data: timelineFilter.weibo(data.statuses).data };
                },
            };
        },
    },
    detail: {
        _get({ id, token }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    method  : 'get',
                    endpoint: 'comments/show',
                    opts    : { id, access_token: token },
                },
                handleActionFunc: data => ({ reply: actionsFilter.weibo.reply(data.comments) }),
            };
        },
    },
};


module.exports = (action, opts) => {
    const triggerAction = {
        basic: w => {
            const { method, endpoint, opts: reqOpts } = w.action;

            return Weibo({ method, endpoint, opts: reqOpts }).then(w.handleActionFunc);
        },
        combination: w => {
            const promiseAll = w.actions.map(actionItem => {
                const { method, endpoint, opts: reqOpts } = actionItem;

                return Weibo({ method, endpoint, opts: reqOpts });
            });

            return Q.all(promiseAll).spread(w.handleActionFunc);
        },
    };

    try {
        const w = _buildAction[action][`_${opts.method}`](opts);
        return triggerAction[w.triggerActionType](w);
    } catch (e) {
        console.log(e);
        throw { statusCode: 405 };
    }
};
