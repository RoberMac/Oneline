const uniqBy =  require('lodash.uniqby');
const filterUtils = require('../utils');

module.exports = {
    like(data) {
        return data.map(i => ({
            name       : i.full_name,
            avatar     : i.profile_picture,
            screen_name: i.username,
            uid        : i.id,
        }));
    },
    reply(data) {
        return data.map(i => ({
            name       : i.from.full_name,
            avatar     : i.from.profile_picture,
            screen_name: i.from.username,
            uid        : i.from.id,
            text       : i.text,
            created_at : i.created_time * 1000,
        }));
    },
    user(data) {
        const { bio, website, counts: { follows, followed_by, media } } = data;
        const userObj = {
            bio    : bio || '',
            website: website || '',
            counts : {
                follows,
                followed_by,
                statuses: media,
            },
        };

        Object.assign(userObj, filterUtils.instagram.user(data));

        return userObj;
    },
    pediction_tags(data) {
        const dataLength = data.length;
        const cache = data.map((item, index) => {
            return {
                name  : item.name,
                volume: item.media_count || dataLength - index,
            };
        });

        return uniqBy(cache, 'name');
    },
    pediction_users(data) {
        const dataLength = data.length;

        return data.map((item, index) => ({
            name  : item.username,
            volume: dataLength - index,
        }));
    },
};
