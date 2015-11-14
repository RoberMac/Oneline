var extend = require('extend'),
    filterUtils = require('./utils');


var filter = {
    twitter: {
        retweet: function (data){
            var cache = [];

            data.forEach(function (item){
                cache.push({
                    name: item.user.name,
                    avatar: item.user.profile_image_url_https,
                    screen_name: item.user.screen_name,
                    uid: item.user.id_str
                })
            })

            return cache;
        },
        user: function (data){
            var entities = data.entities;

            var userObj = {
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

            extend(userObj, filterUtils.twitter.user(data))

            if (entities.description && entities.description.urls){
                entities.description.urls.forEach(function (item){
                    extend(userObj, {
                        bio: userObj.bio.replace(item.url, item.expanded_url)
                    })
                })
            }

            return userObj;
        },
        follow: function (data){
            var cache = [];

            data.forEach(function (item){
                cache.push({
                    name: item.name,
                    avatar: item.profile_image_url_https,
                    screen_name: item.screen_name
                })
            })

            return cache;
        },
        direct: function (data){
            var cache = [];

            data.forEach(function (item){
                var directObj = {
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
                }

                if (item.entities && item.entities.media){
                    extend(directObj, {
                        media: filterUtils.twitter.media(item.entities.media)
                    })
                }

                cache.push(directObj)
            })

            var returnObj = { data: cache },
                firstData = data[0],
                lastData  = data[data.length - 1];

            if (lastData){
                extend(returnObj, {
                    min_id  : lastData.id_str,
                    min_date: Date.parse(lastData.created_at),
                    max_id  : firstData.id_str,
                    max_date: Date.parse(firstData.created_at)
                })
            }

            return returnObj;
        }
    },
    instagram: {
        like: function (data){
            var cache = [];

            data.forEach(function (item){
                cache.push({
                    name: item.full_name,
                    avatar: item.profile_picture,
                    screen_name: item.username,
                    uid: item.id
                })
            })

            return cache;
        },
        reply: function (data){
            var cache = [];

            data.forEach(function (item){
                cache.push({
                    name: item.from.full_name,
                    avatar: item.from.profile_picture,
                    screen_name: item.from.username,
                    uid: item.from.id,
                    text: item.text,
                    created_at: item.created_time * 1000
                })
            })

            return cache;
        },
        user: function (data){
            var userObj = {
                bio: data.bio || '',
                website: data.website || '',
                counts: {
                    follows: data.counts.follows,
                    followed_by: data.counts.followed_by,
                    statuses: data.counts.media
                }
            };

            extend(userObj, filterUtils.instagram.user(data))

            return userObj;
        }
    },
    weibo: {
        user: function (data){
            var userObj = {
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

            extend(userObj, filterUtils.weibo.user(data))

            return userObj;
        },
        reply: function (data){
            var cache = [];

            data.forEach(function (item){
                cache.push({
                    name: item.user.name,
                    avatar: item.user.profile_image_url,
                    screen_name: item.user.screen_name,
                    id: item.user.idstr,
                    text: item.text,
                    created_at: Date.parse(item.created_at)
                })
            })

            return cache;
        }
    }
}

module.exports = filter