"use strict";
const filterUtils = require('../utils');


module.exports = data => {
    const postsLength = data.length;
    let cache = [];

    data.forEach((item, index) => {
        /**
         * Tweet / Reply
         *
         */
        let tweetObj = {
            type: 'tweet',
            provider: 'twitter',
            created_at: Date.parse(item.created_at) + (postsLength - index),
            id_str: item.id_str,
            user: filterUtils.twitter.user(item.user),
            text: item.text,
            retweet_count: item.retweet_count,
            like_count: item.favorite_count,
            retweeted: item.retweeted,
            liked: item.favorited
        };
        // Media
        let t_extended_entities = item.extended_entities;
        if (t_extended_entities && t_extended_entities.media){
            let media = filterUtils.twitter.media(t_extended_entities.media);
            let mediaLink = t_extended_entities.media[0].url;

            Object.assign(tweetObj, { media, mediaLink })
        }
        // Location
        if (item.place){
            Object.assign(tweetObj, {
                location: {
                    id: item.place.id,
                    name: item.place.name
                }
            })
        }

        /**
         * Retweet / Quote
         *
         */
        if (item.retweeted_status || item.quoted_status){
            let r_type = item.retweeted_status ? 'retweet' : 'quote';
            let r_item = item.retweeted_status || item.quoted_status;

            let r_obj = {
                type: 'tweet',
                provider: 'twitter',
                created_at: Date.parse(r_item.created_at),
                id_str: r_item.id_str,
                user: filterUtils.twitter.user(r_item.user),
                text: r_item.text,
                retweet_count: r_item.retweet_count,
                like_count: r_item.favorite_count,
                retweeted: r_item.retweeted,
                liked: r_item.favorited
            };
            // Media
            let r_extended_entities = r_item.extended_entities;
            if (r_extended_entities && r_extended_entities.media){
                let media = filterUtils.twitter.media(r_extended_entities.media);
                let mediaLink = r_extended_entities.media[0].url;

                Object.assign(r_obj, { media, mediaLink })
            }
            // Location
            if (r_item.place){
                Object.assign(r_obj, {
                    location: {
                        id: r_item.place.id,
                        name: r_item.place.name
                    }
                })
            }

            Object.assign(tweetObj, { type: r_type, [r_type]: r_obj })
        } 

        cache.push(tweetObj);
    })

    let returnObj = { data: cache };
    let firstData = cache[0];
    let lastData  = cache[postsLength - 1];

    if (lastData){
        Object.assign(returnObj, {
            minId  : lastData.id_str,
            minDate: lastData.created_at,
            maxId  : firstData.id_str,
            maxDate: firstData.created_at
        })
    }

    return returnObj;
};