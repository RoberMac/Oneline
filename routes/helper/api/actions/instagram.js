/* eslint no-else-return: 0 */

const Ig = require('instagram-node').instagram();
const timelineFilter = require(`${__base}/routes/helper/filter/timeline`);
const actionsFilter = require(`${__base}/routes/helper/filter/actions`);

const _buildAction = {
    user: {
        _get({ id, query }) {
            let actionObj;
            if (query && query.maxId) {
                actionObj = {
                    triggerActionType: 'basic',
                    action           : {
                        endpoint: 'user_media_recent',
                        opts    : { max_id: query.maxId },
                    },
                    handleActionFunc: data => ({ data: timelineFilter.instagram(data[0]).data }),
                };
            } else {
                actionObj = {
                    triggerActionType: 'combination',
                    actions          : [
                        { endpoint: 'user' },
                        { endpoint: 'user_media_recent', opts: { count: 7 } },
                    ],
                    handleActionFunc: (userData, timelineData) => {
                        const user = actionsFilter.instagram.user(userData[0]);
                        const data = timelineFilter.instagram(timelineData[0]).data;
                        return { user, data };
                    },
                };
            }

            if (isNaN(id)) {
                return {
                    triggerActionType: 'queue',
                    action           : { endpoint: 'user_search' },
                    handleActionFunc : data => ({
                        uid: data[0].find(item => item.username === id).id,
                    }),
                    actionObj,
                };
            } else {
                return actionObj;
            }
        },
    },
    locations: {
        _get({ query }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    endpoint: 'location_media_recent',
                    opts    : { max_id: query.maxId },
                },
                handleActionFunc: data => ({ data: timelineFilter.instagram(data[0]).data }),
            };
        },
    },
    tags: {
        _get({ query }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    endpoint: 'tag_media_recent',
                    opts    : { max_tag_id: query.maxId && query.maxId.split('_')[0] },
                },
                handleActionFunc: data => {
                    if (query.maxId) {
                        data[0].splice(0, 1);
                    }

                    return { data: timelineFilter.instagram(data[0]).data };
                },
            };
        },
    },
    detail: {
        _get(opts) {
            return {
                triggerActionType: 'combination',
                actions          : [
                    { endpoint: 'media' },
                    { endpoint: 'likes' },
                    { endpoint: 'comments' },
                ],
                handleActionFunc: (postData, likeData, replyData) => {
                    const post = timelineFilter.instagram([postData[0]]).data[0];
                    const like = actionsFilter.instagram.like(likeData[0].slice(0, 100));
                    const reply = actionsFilter.instagram.reply(replyData[0].slice(0, 100));
                    return { post, like, reply };
                },
            };
        },
    },
    pediction_tags: {
        _get(opts) {
            return {
                triggerActionType: 'basic',
                action           : { endpoint: 'tag_search' },
                handleActionFunc : data => {
                    return {
                        data: actionsFilter.instagram.pediction_tags(data[0].slice(0, 100)),
                    };
                },
            };
        },
    },
    pediction_users: {
        _get(opts) {
            return {
                triggerActionType: 'basic',
                action           : { endpoint: 'user_search' },
                handleActionFunc : data => {
                    return {
                        data: actionsFilter.instagram.pediction_users(data[0].slice(0, 100)),
                    };
                },
            };
        },
    },
};


module.exports = (action, opts) => {
    Ig.use({ access_token: opts.token });

    const triggerAction = {
        basic: i => {
            const { endpoint, opts: iOpts } = i.action;

            return (iOpts
                    ? Q.nbind(Ig[endpoint], Ig)(opts.id, iOpts)
                : Q.nbind(Ig[endpoint], Ig)(opts.id)
            )
            .then(i.handleActionFunc)
            .catch((err) => {
                if (err.error_type) {
                    throw { statusCode: 400, msg: 'you cannot view this resource' };
                } else {
                    throw err;
                }
            });
        },
        combination: i => {
            const promiseAll = [];
            i.actions.forEach(actionItem => {
                const { endpoint, opts: iOpts } = actionItem;

                promiseAll.push(iOpts
                        ? Q.nbind(Ig[endpoint], Ig)(opts.id, iOpts)
                    : Q.nbind(Ig[endpoint], Ig)(opts.id)
                );
            });

            return Q.all(promiseAll)
            .spread(i.handleActionFunc)
            .catch((err) => {
                if (err.error_type) {
                    throw { statusCode: 400, msg: 'you cannot view this resource' };
                } else {
                    throw err;
                }
            });
        },
        queue: i => {
            return triggerAction.basic(i)
            .then(data => {
                opts.id = data.uid;
                i = i.actionObj;
                return triggerAction[i.triggerActionType](i);
            });
        },
    };


    try {
        const i = _buildAction[action][`_${opts.method}`](opts);
        return triggerAction[i.triggerActionType](i);
    } catch (e) {
        console.log(e);
        throw { statusCode: 405 };
    }
};
