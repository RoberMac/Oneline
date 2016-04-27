const filterUtils = require('../utils');

module.exports = {
    user(data) {
        const {
            description, location, url, following,
            friends_count, followers_count, statuses_count,
        } = data;
        const userObj = {
            following,
            location,
            bio    : description || '',
            website: url || '',
            counts : {
                follows    : friends_count,
                followed_by: followers_count,
                statuses   : statuses_count,
            },
        };

        Object.assign(userObj, filterUtils.weibo.user(data));

        return userObj;
    },
    reply(data) {
        return data.map(i => ({
            name       : i.user.name,
            avatar     : i.user.profile_image_url,
            screen_name: i.user.screen_name,
            id         : i.user.idstr,
            text       : i.text,
            created_at : Date.parse(i.created_at),
        }));
    },
};
