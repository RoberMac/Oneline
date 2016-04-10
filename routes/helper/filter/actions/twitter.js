'use strict';
const filterUtils = require('../utils');

module.exports = {
    retweet(data) {
        const cache = [];

        for (const item of data) {
            cache.push({
                name       : item.user.name,
                avatar     : item.user.profile_image_url_https,
                screen_name: item.user.screen_name,
                uid        : item.user.id_str,
            });
        }

        return cache;
    },
    user(data) {
        const entities = data.entities;
        // User
        const userObj = {
            bio     : data.description || '',
            location: data.location,
            website : (data.url && entities.url.urls[0].expanded_url) || '',
            counts  : {
                follows    : data.friends_count,
                followed_by: data.followers_count,
                statuses   : data.statuses_count,
            },
            following: data.following,
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
        const cache = [];

        for (const item of data) {
            cache.push({
                name       : item.name,
                avatar     : item.profile_image_url_https,
                screen_name: item.screen_name,
            });
        }

        return cache;
    },
    direct(data) {
        const cache = [];

        for (const item of data) {
            const directObj = {
                created_at: Date.parse(item.created_at),
                id_str    : item.id_str,
                text      : item.text,
                sender    : {
                    name       : item.sender.name,
                    uid        : item.sender.id_str,
                    screen_name: item.sender.screen_name,
                    avatar     : item.sender.profile_image_url_https,
                },
                recipient: {
                    name       : item.recipient.name,
                    uid        : item.recipient.id_str,
                    screen_name: item.recipient.screen_name,
                    avatar     : item.recipient.profile_image_url_https,
                },
            };

            if (item.entities && item.entities.media) {
                Object.assign(directObj, {
                    media: filterUtils.twitter.media(item.entities.media),
                });
            }

            cache.push(directObj);
        }

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
        const cache = [];

        data.forEach((item, index) => {
            cache.push({
                name  : item.name,
                volume: item.tweet_volume || dataLength - index,
            });
        });

        return cache;
    },
};
