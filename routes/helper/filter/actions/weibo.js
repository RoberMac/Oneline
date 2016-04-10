'use strict';
const filterUtils = require('../utils');


module.exports = {
    user(data) {
        const userObj = {
            bio     : data.description || '',
            location: data.location,
            website : data.url || '',
            counts  : {
                follows    : data.friends_count,
                followed_by: data.followers_count,
                statuses   : data.statuses_count,
            },
            following: data.following,
        };

        Object.assign(userObj, filterUtils.weibo.user(data));

        return userObj;
    },
    reply(data) {
        const cache = [];

        for (const item of data) {
            cache.push({
                name       : item.user.name,
                avatar     : item.user.profile_image_url,
                screen_name: item.user.screen_name,
                id         : item.user.idstr,
                text       : item.text,
                created_at : Date.parse(item.created_at),
            });
        }

        return cache;
    },
};
