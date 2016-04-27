const filterUtils = require('../utils');

module.exports = {
    retweet(data) {
        return data.map(i => ({
            name       : i.user.name,
            avatar     : i.user.profile_image_url_https,
            screen_name: i.user.screen_name,
            uid        : i.user.id_str,
        }));
    },
    user(data) {
        const {
            entities, description, location, url, following,
            friends_count, followers_count, statuses_count,
        } = data;
        // User
        const userObj = {
            following,
            location,
            bio    : description || '',
            website: (url && entities.url.urls[0].expanded_url) || '',
            counts : {
                follows    : friends_count,
                followed_by: followers_count,
                statuses   : statuses_count,
            },
            protected: data.protected,
        };
        Object.assign(userObj, filterUtils.twitter.user(data));
        // Expanded Url
        if (entities.description && entities.description.urls) {
            for (const item of entities.description.urls) {
                Object.assign(userObj, {
                    bio: userObj.bio.replace(item.url, item.expanded_url),
                });
            }
        }

        return userObj;
    },
    follow(data) {
        return data.map(i => ({
            name       : i.name,
            avatar     : i.profile_image_url_https,
            screen_name: i.screen_name,
        }));
    },
    direct(data) {
        const cache = data.map(i => {
            const directObj = {
                created_at: Date.parse(i.created_at),
                id_str    : i.id_str,
                text      : i.text,
                sender    : {
                    name       : i.sender.name,
                    uid        : i.sender.id_str,
                    screen_name: i.sender.screen_name,
                    avatar     : i.sender.profile_image_url_https,
                },
                recipient: {
                    name       : i.recipient.name,
                    uid        : i.recipient.id_str,
                    screen_name: i.recipient.screen_name,
                    avatar     : i.recipient.profile_image_url_https,
                },
            };

            if (i.entities && i.entities.media) {
                Object.assign(directObj, {
                    media: filterUtils.twitter.media(i.entities.media),
                });
            }

            return directObj;
        });

        const returnObj = { data: cache };
        const firstData = data[0];
        const lastData  = data[data.length - 1];

        if (lastData) {
            Object.assign(returnObj, {
                minId  : lastData.id_str,
                minDate: Date.parse(lastData.created_at),
                maxId  : firstData.id_str,
                maxDate: Date.parse(firstData.created_at),
            });
        }

        return returnObj;
    },
    trends(data) {
        const dataLength = data.length;

        return data.map((item, index) => ({
            name  : item.name,
            volume: item.tweet_volume || dataLength - index,
        }));
    },
};
