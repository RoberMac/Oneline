"use strict";
const filterUtils = require('./utils');


let filter = {
    twitter: {
        retweet (data){
            let cache = [];

            for (let item of data){
                cache.push({
                    name: item.user.name,
                    avatar: item.user.profile_image_url_https,
                    screen_name: item.user.screen_name,
                    uid: item.user.id_str
                })
            }

            return cache;
        },
        user (data){
            let entities = data.entities;
            // User
            let userObj = {
                bio: data.description || '',
                location: data.location,
                website: (data.url && entities.url.urls[0].expanded_url) || '',
                counts: {
                    follows: data.friends_count,
                    followed_by: data.followers_count,
                    statuses: data.statuses_count
                },
                following: data.following,
                protected: data.protected
            };
            Object.assign(userObj, filterUtils.twitter.user(data))
            // Expanded Url
            if (entities.description && entities.description.urls){
                for (let item of entities.description.urls){
                    Object.assign(userObj, {
                        bio: userObj.bio.replace(item.url, item.expanded_url)
                    })
                }
            }

            return userObj;
        },
        follow (data){
            let cache = [];

            for (let item of data){
                cache.push({
                    name: item.name,
                    avatar: item.profile_image_url_https,
                    screen_name: item.screen_name
                })
            }

            return cache;
        },
        direct (data){
            let cache = [];

            for (let item of data){
                let directObj = {
                    created_at: Date.parse(item.created_at),
                    id_str: item.id_str,
                    text: item.text,
                    sender: {
                        name: item.sender.name,
                        uid: item.sender.id_str,
                        screen_name: item.sender.screen_name,
                        avatar: item.sender.profile_image_url_https
                    },
                    recipient: {
                        name: item.recipient.name,
                        uid: item.recipient.id_str,
                        screen_name: item.recipient.screen_name,
                        avatar: item.recipient.profile_image_url_https
                    }
                };

                if (item.entities && item.entities.media){
                    Object.assign(directObj, {
                        media: filterUtils.twitter.media(item.entities.media)
                    })
                }

                cache.push(directObj)
            }

            let returnObj = { data: cache };
            let firstData = data[0];
            let lastData  = data[data.length - 1];

            if (lastData){
                Object.assign(returnObj, {
                    minId  : lastData.id_str,
                    minDate: Date.parse(lastData.created_at),
                    maxId  : firstData.id_str,
                    maxDate: Date.parse(firstData.created_at)
                })
            }

            return returnObj;
        },
        trends (data){
            const dataLength = data.length;
            let cache = [];

            data.forEach((item, index) => {
                cache.push({
                    name: item.name,
                    volume: item.tweet_volume || dataLength - index
                })
            })

            return cache;
        }
    },
    instagram: {
        like (data){
            let cache = [];

            for (let item of data){
                cache.push({
                    name: item.full_name,
                    avatar: item.profile_picture,
                    screen_name: item.username,
                    uid: item.id
                })
            }

            return cache;
        },
        reply (data){
            let cache = [];

            for (let item of data){
                cache.push({
                    name: item.from.full_name,
                    avatar: item.from.profile_picture,
                    screen_name: item.from.username,
                    uid: item.from.id,
                    text: item.text,
                    created_at: item.created_time * 1000
                })
            }

            return cache;
        },
        user (data){
            let userObj = {
                bio: data.bio || '',
                website: data.website || '',
                counts: {
                    follows: data.counts.follows,
                    followed_by: data.counts.followed_by,
                    statuses: data.counts.media
                }
            };

            Object.assign(userObj, filterUtils.instagram.user(data))

            return userObj;
        }
    },
    weibo: {
        user (data){
            let userObj = {
                bio: data.description || '',
                location: data.location,
                website: data.url || '',
                counts: {
                    follows: data.friends_count,
                    followed_by: data.followers_count,
                    statuses: data.statuses_count
                },
                following: data.following
            };

            Object.assign(userObj, filterUtils.weibo.user(data))

            return userObj;
        },
        reply (data){
            let cache = [];

            for (let item of data){
                cache.push({
                    name: item.user.name,
                    avatar: item.user.profile_image_url,
                    screen_name: item.user.screen_name,
                    id: item.user.idstr,
                    text: item.text,
                    created_at: Date.parse(item.created_at)
                })
            }

            return cache;
        }
    }
}

module.exports = filter