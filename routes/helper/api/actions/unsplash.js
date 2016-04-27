const Unsplash   = require(`${__base}/utils/wrapper/unsplash`);
const timelineFilter = require(`${__base}/routes/helper/filter/timeline`);
const actionsFilter = require(`${__base}/routes/helper/filter/actions`);


// Helpers
const selectCategoryID = name => {
    let categoryID;
    switch (name.toLowerCase()) {
        case 'buildings':
            categoryID = 2;
            break;
        case 'food':
            categoryID = 3;
            break;
        case 'nature':
            categoryID = 4;
            break;
        case 'objects':
            categoryID = 8;
            break;
        case 'people':
            categoryID = 6;
            break;
        case 'technology':
            categoryID = 7;
            break;
        default:
            categoryID = 2;
    }

    return categoryID;
};
const _buildAction = {
    user: {
        _get({ id }) {
            const username = id;

            return {
                triggerActionType: 'combination',
                actions          : [
                    {
                        method  : 'get',
                        endpoint: `/users/${username}`,
                    },
                    {
                        method  : 'get',
                        endpoint: `/users/${username}/photos`,
                    },
                ],
                handleActionFunc: (data1, data2) => {
                    const user = actionsFilter.unsplash.user(data1);
                    const data = timelineFilter.unsplash(data2).data;
                    return { user, data };
                },
            };
        },
    },
    like: {
        _put({ id }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    method  : 'post',
                    endpoint: `/photos/${id}/like`,
                },
                handleActionFunc: () => ({ msg: 'ok' }),
            };
        },
        _delete({ id }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    method  : 'delete',
                    endpoint: `/photos/${id}/like`,
                },
                handleActionFunc: () => ({ msg: 'ok' }),
            };
        },
    },
    tags: { // tags for category
        _get({ id, query }) {
            const categoryID = selectCategoryID(id);

            return {
                triggerActionType: 'basic',
                action           : {
                    method  : 'get',
                    endpoint: `/categories/${categoryID}/photos`,
                    opts    : {
                        per_page: 20,
                        page    : query.maxId || 1,
                    },
                },
                handleActionFunc: data => ({
                    data: timelineFilter.unsplash(data).data,
                }),
            };
        },
    },
    search: {
        _get({ id, query }) {
            return {
                triggerActionType: 'basic',
                action           : {
                    method  : 'get',
                    endpoint: '/photos/search',
                    opts    : {
                        query   : id,
                        per_page: 20,
                        page    : query.maxId || 1,
                    },
                },
                handleActionFunc: data => ({
                    data: timelineFilter.unsplash(data).data,
                }),
            };
        },
    },
};


module.exports = (action, opts) => {
    const triggerAction = {
        basic: u => {
            const { method, endpoint, opts: reqOpts } = u.action;
            return Unsplash({
                method,
                endpoint,
                opts        : reqOpts,
                access_token: opts.token,
            })
            .then(u.handleActionFunc);
        },
        combination: u => {
            const promiseAll = [];

            u.actions.forEach(actionItem => {
                const { method, endpoint, opts: reqOpts } = actionItem;
                promiseAll.push(Unsplash({
                    method,
                    endpoint,
                    opts        : reqOpts,
                    access_token: opts.token,
                }));
            });

            return Q.all(promiseAll).spread(u.handleActionFunc);
        },
    };

    try {
        const u = _buildAction[action][`_${opts.method}`](opts);
        return triggerAction[u.triggerActionType](u);
    } catch (e) {
        console.log(e);
        throw { statusCode: 405 };
    }
};
