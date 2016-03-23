"use strict";
const mid    = require('weibo-mid');
const filterUtils = require('../utils');


module.exports = data => {
    const postsLength = data.length;
    let cache = [];

    data.forEach((item, index) => {
        /**
         * Tweet / Reply
         *
         */
        let weiboObj = {
            type: 'tweet',
            provider: 'weibo',
            created_at: Date.parse(item.created_at) + (postsLength - index),
            id_str: item.idstr,
            mid: mid.encode(item.mid),
            user: filterUtils.weibo.user(item.user),
            text: item.text,
            retweet_count: item.reposts_count,
            reply_count: item.comments_count,
            like_count: item.attitudes_count,
            liked: item.favorited
        };
        // Media
        let pic_urls = item.pic_urls;
        let pic_ids  = item.pic_ids;
        if (pic_urls && pic_urls.length > 0 || pic_ids && pic_ids.length > 0){
            Object.assign(weiboObj, {
                media: filterUtils.weibo.media(pic_urls || pic_ids)
            })
        }
        // Location
        if (item.geo && item.geo.type === 'Point'){
            let _place_name, _place_id;
            let annotations = item.annotations;

            if (annotations && annotations[0].place){
                _place_name = annotations[0].place.title
                _place_id = annotations[0].place.poiid
            }

            let name = _place_name;
            let place_id = _place_id;
            let id = item.geo.coordinates[0] + '_' + item.geo.coordinates[1];

            Object.assign(weiboObj, { location: { name, place_id, id } })
        }

        /**
         * Retweet & Quote
         *
         */
        if (item.retweeted_status){
            let r_type = /^转发微博|Repost|轉發微博$/.test(item.text) ? 'retweet' : 'quote';
            let r_item = item.retweeted_status;

            let r_obj = {
                type: 'tweet',
                provider: 'weibo',
                created_at: Date.parse(r_item.created_at),
                id_str: r_item.idstr,
                mid: mid.encode(r_item.mid),
                user: filterUtils.weibo.user(r_item.user),
                text: r_item.text,
                retweet_count: r_item.reposts_count,
                reply_count: r_item.comments_count,
                like_count: r_item.attitudes_count,
                liked: r_item.favorited
            };
            // Media
            let pic_urls = r_item.pic_urls;
            let pic_ids  = r_item.pic_ids;
            if (pic_urls && pic_urls.length > 0 || pic_ids && pic_urls.length > 0){
                Object.assign(r_obj, {
                    media: filterUtils.weibo.media(pic_urls || pic_ids)
                })
            }
            // Location
            if (r_item.geo && r_item.geo.type === 'Point'){
                let _place_name, _place_id;
                let annotations = r_item.annotations;

                if (annotations && annotations[0].place){
                    _place_name = annotations[0].place.title
                    _place_id = annotations[0].place.poiid
                }

                let name = _place_name;
                let place_id = _place_id;
                let id = r_item.geo.coordinates[0] + '_' + r_item.geo.coordinates[1];

                Object.assign(r_obj, { location: { name, place_id, id } })
            }

            Object.assign(weiboObj, { type: r_type, [r_type]: r_obj })
        }

        cache.push(weiboObj)
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