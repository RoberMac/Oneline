"use strict";
const Unsplash   = require(`${__base}/utils/wrapper/Unsplash`);
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
    };

    return categoryID;
};
const _buildAction = {
    user: {
        _get(opts) {
            const username = opts.id;
            const token = opts.token;

            return {
                triggerActionType: 'combination',
                actions: [
                    {
                        method: 'get',
                        endpoint: `/users/${username}`,
                    },
                    {
                        method: 'get',
                        endpoint: `/users/${username}/photos`,
                    }
                ],
                handleActionFunc: (data1, data2) => {
                    const user = actionsFilter.unsplash.user(data1);
                    const data = timelineFilter.unsplash(data2).data;
                    return { user, data };
                }
            };
        }
    },
    like: {
        _put(opts) {
            return {
                triggerActionType: 'basic',
                action: {
                    method: 'post',
                    endpoint: `/photos/${opts.id}/like`,
                },
                handleActionFunc: data => ({ msg: 'ok' })
            };
        },
        _delete(opts) {
            return {
                triggerActionType: 'basic',
                action: {
                    method: 'delete',
                    endpoint: `/photos/${opts.id}/like`,
                },
                handleActionFunc: data => ({ msg: 'ok' })
            };
        }
    },
    tags: { // tags for category
        _get(opts) {
            const categoryID = selectCategoryID(opts.id);

            return {
                triggerActionType: 'basic',
                action: {
                    method: 'get',
                    endpoint: `/categories/${categoryID}/photos`,
                    opts: {
                        per_page: 20,
                        page: opts.query.maxId || 1
                    }
                },
                handleActionFunc: data => ({
                    data: timelineFilter.unsplash(data).data
                })
            };
        }
    },
    search: {
        _get(opts) {
            return {
                triggerActionType: 'basic',
                action: {
                    method: 'get',
                    endpoint: '/photos/search',
                    opts: {
                        query: opts.id,
                        per_page: 20,
                        page: opts.query.maxId || 1
                    }
                },
                handleActionFunc: data => ({
                    data: timelineFilter.unsplash(data).data
                })
            };
        }
    }
};


module.exports = (action, opts) => {
    const triggerAction = {
        basic: u => {
            return Unsplash({
                method: u.action.method,
                endpoint: u.action.endpoint,
                access_token: opts.token,
                opts: u.action.opts
            })
            .then(u.handleActionFunc);
        },
        combination: u => {
            let promiseAll = [];
            u.actions.forEach(action => {
                promiseAll.push(Unsplash({
                    method: action.method,
                    endpoint: action.endpoint,
                    access_token: opts.token,
                    opts: action.opts
                }))
            });

            return Q.all(promiseAll).spread(u.handleActionFunc);
        }
    };

    try {
        const u = _buildAction[action][`_${opts.method}`](opts);
        return triggerAction[u.triggerActionType](u);
    } catch (e){
        console.log(e)
        throw { statusCode: 405 };
    }
};