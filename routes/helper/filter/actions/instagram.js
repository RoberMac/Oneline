const uniqBy =  require('lodash.uniqby');
const filterUtils = require('../utils');

module.exports = {
    like(data) {
        const cache = [];

        for (const item of data) {
            cache.push({
                name       : item.full_name,
                avatar     : item.profile_picture,
                screen_name: item.username,
                uid        : item.id,
            });
        }

        return cache;
    },
    reply(data) {
        const cache = [];

        for (const item of data) {
            cache.push({
                name       : item.from.full_name,
                avatar     : item.from.profile_picture,
                screen_name: item.from.username,
                uid        : item.from.id,
                text       : item.text,
                created_at : item.created_time * 1000,
            });
        }

        return cache;
    },
    user(data) {
        const userObj = {
            bio    : data.bio || '',
            website: data.website || '',
            counts : {
                follows    : data.counts.follows,
                followed_by: data.counts.followed_by,
                statuses   : data.counts.media,
            },
        };

        Object.assign(userObj, filterUtils.instagram.user(data));

        return userObj;
    },
    pediction_tags(data) {
        const dataLength = data.length;
        const cache = [];

        data.forEach((item, index) => {
            cache.push({
                name  : item.name,
                volume: item.media_count || dataLength - index,
            });
        });

        return uniqBy(cache, 'name');
    },
    pediction_users(data) {
        const dataLength = data.length;
        const cache = [];

        data.forEach((item, index) => {
            cache.push({
                name  : item.username,
                volume: dataLength - index,
            });
        });

        return cache;
    },
};
