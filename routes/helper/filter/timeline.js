"use strict";
/** 
 * 向前端發送數據前，過濾多餘信息
 *
 */
const mid    = require('weibo-mid');
const filterUtils = require('./utils');


let filter = {
    twitter: data => {
        let cache = [];

        for (let item of data){
            /**
             * Tweet / Reply
             *
             */
            let tweetObj = {
                type: 'tweet',
                provider: 'twitter',
                created_at: Date.parse(item.created_at),
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
    instagram: data => {
        let cache = [];

        for (let item of data){
            let igPost = {
                provider: 'instagram',
                created_at: Date.parse(new Date(item.created_time * 1000)),
                id_str: item.id,
                type: 'post',
                user: filterUtils.instagram.user(item.user),
                text: item.caption && item.caption.text,
                images: filterUtils.instagram.media(item.images),
                like_count: item.likes.count,
                liked: item.user_has_liked,
                reply_count: item.comments.count,
                link: item.link
            };

            // Video
            if (item.type === 'video'){
                Object.assign(igPost, {
                    videos: {
                        low_resolution: item.videos.low_resolution.url,
                        standard_resolution: item.videos.standard_resolution.url
                    }
                })
            }

            // User In Photo
            if (item.users_in_photo.length > 0){
                Object.assign(igPost, { users_in_photo: item.users_in_photo })
            }

            // Location
            if (item.location){
                Object.assign(igPost, {
                    location: {
                        name: item.location.name,
                        id: item.location.id
                    }
                })
            }

            cache.push(igPost);
        }


        let returnObj = { data: cache };
        let firstData = data[0];
        let lastData  = data[data.length - 1];

        if (lastData){
            Object.assign(returnObj, {
                minId  : lastData.id,
                minDate: Date.parse(new Date(lastData.created_time * 1000)),
                maxId  : firstData.id,
                maxDate: Date.parse(new Date(firstData.created_time * 1000))
            })
        }

        return returnObj;
    },
    weibo: data => {
        let cache = [];

        for (let item of data){
            /**
             * Tweet / Reply
             *
             */
            let weiboObj = {
                type: 'tweet',
                provider: 'weibo',
                created_at: Date.parse(item.created_at),
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
        }

        let returnObj = { data: cache };
        let firstData = data[0];
        let lastData  = data[data.length - 1];

        if (lastData){
            Object.assign(returnObj, {
                minId  : lastData.idstr,
                minDate: Date.parse(lastData.created_at),
                maxId  : firstData.idstr,
                maxDate: Date.parse(firstData.created_at)
            })
        }

        return returnObj;
    }
}

module.exports = filter