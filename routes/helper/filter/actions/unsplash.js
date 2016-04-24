'use strict';

const filterUtils = require('../utils');


module.exports = {
    user(data) {
        const userObj = {
            website: data.portfolio_url || '',
            counts : {
                downloads: data.downloads || 0,
            },
        };

        Object.assign(userObj, filterUtils.unsplash.user(data));

        return userObj;
    },
};
