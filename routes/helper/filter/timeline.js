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
            let _created_at = Date.parse(item.created_at);

            /**
             * Tweet / Reply
             *
             */
            let tweetObj = {
                type: 'tweet',
                provider: 'twitter',
                created_at: _created_at,
                id_str: item.id_str,
                user: filterUtils.twitter.user(item.user),
                text: item.text,
                retweet_count: item.retweet_count,
                favorite_count: item.favorite_count,
                retweeted: item.retweeted,
                favorited: item.favorited
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
             * Retweet
             *
             */
            if (item.retweeted_status){
                let retweetItem = item.retweeted_status;

                // Extend Common Data
                let type = 'retweet';
                let r_id_str = item.id_str;
                let id_str = retweetItem.id_str;
                let text = retweetItem.text;
                let retweet = {
                    created_at: Date.parse(retweetItem.created_at),
                    user: filterUtils.twitter.user(retweetItem.user)
                };
                let favorite_count = retweetItem.favorite_count;

                Object.assign(tweetObj, { type, r_id_str, id_str, text, retweet, favorite_count })

                // Extend Media
                let r_extended_entities = retweetItem.extended_entities;
                if (r_extended_entities && r_extended_entities.media){
                    let media = filterUtils.twitter.media(r_extended_entities.media);
                    let mediaLink = r_extended_entities.media[0].url;

                    Object.assign(tweetObj, { media, mediaLink })
                }
            } 
            /**
             * Quote
             *
             */
            else if (item.quoted_status){
                let quoteItem = item.quoted_status;

                // Extend Common Data
                let type = 'quote';
                let quote = {
                    created_at: Date.parse(quoteItem.created_at),
                    id_str: quoteItem.id_str,
                    text: quoteItem.text,
                    user: filterUtils.twitter.user(quoteItem.user)
                };

                Object.assign(tweetObj, { type, quote })

                // Extend Media
                let q_extended_entities = quoteItem.extended_entities;
                if (q_extended_entities && q_extended_entities.media){
                    let media = filterUtils.twitter.media(q_extended_entities.media);
                    let mediaLink = q_extended_entities.media[0].url;

                    Object.assign(tweetObj.quote, { media, mediaLink })
                }
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
            let _created_at = Date.parse(new Date(item.created_time * 1000));

            let igPost = {
                provider: 'instagram',
                created_at: _created_at,
                id_str: item.id,
                type: 'post',
                user: filterUtils.instagram.user(item.user),
                text: item.caption && item.caption.text,
                images: filterUtils.instagram.media(item.images),
                favorite_count: item.likes.count,
                favorited: item.user_has_liked,
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
            let _created_at = Date.parse(item.created_at);

            /**
             * Tweet / Reply
             *
             */
            let weiboObj = {
                type: 'tweet',
                provider: 'weibo',
                created_at: _created_at,
                id_str: item.idstr,
                mid: mid.encode(item.mid),
                user: filterUtils.weibo.user(item.user),
                text: item.text,
                retweet_count: item.reposts_count,
                comments_count: item.comments_count,
                favorite_count: item.attitudes_count
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
                let id = _place_id;
                let q = item.geo.coordinates[0] + '_' + item.geo.coordinates[1];

                Object.assign(weiboObj, { location: { name, id, q } })
            }

            /**
             * Retweet & Quote
             *
             */
            if (item.retweeted_status){
                let retweetType = /^转发微博|Repost|轉發微博$/.test(item.text) ? 'retweet' : 'quote';
                let retweetItem = item.retweeted_status;

                // Reset Tweet
                if (retweetType === 'retweet'){
                    let r_id_str = item.idstr;
                    let id_str = retweetItem.idstr;
                    let retweet_count = retweetItem.reposts_count;
                    let comments_count = retweetItem.comments_count;
                    let favorite_count = retweetItem.attitudes_count;

                    Object.assign(weiboObj, {
                        r_id_str, id_str, retweet_count, comments_count, favorite_count
                    })
                }
                // Extend Common Data
                Object.assign(weiboObj, {
                    type: retweetType,
                    retweet: {
                        created_at: Date.parse(retweetItem.created_at),
                        id_str: retweetItem.idstr,
                        mid: mid.encode(retweetItem.mid),
                        user: filterUtils.weibo.user(retweetItem.user),
                        text: retweetItem.text,
                        retweet_count: retweetItem.reposts_count,
                        comments_count: retweetItem.comments_count,
                        favorite_count: retweetItem.attitudes_count
                    }
                })
                // Extend Media
                let pic_urls = retweetItem.pic_urls;
                let pic_ids  = retweetItem.pic_ids;
                if (pic_urls && pic_urls.length > 0 || pic_ids && pic_urls.length > 0){
                    Object.assign(weiboObj, {
                        media: filterUtils.weibo.media(pic_urls || pic_ids)
                    })
                }
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