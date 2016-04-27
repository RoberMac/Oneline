const mid    = require('weibo-mid');
const filterUtils = require('../utils');

module.exports = data => {
    const postsLength = data.length;
    const cache = [];

    data.forEach((item, index) => {
        /**
         * Tweet / Reply
         *
         */
        const weiboObj = {
            type         : 'tweet',
            provider     : 'weibo',
            created_at   : Date.parse(item.created_at) + (postsLength - index),
            id_str       : item.idstr,
            mid          : mid.encode(item.mid),
            user         : filterUtils.weibo.user(item.user),
            text         : item.text,
            retweet_count: item.reposts_count,
            retweeted    : false,
            reply_count  : item.comments_count,
            like_count   : item.attitudes_count,
            liked        : item.favorited,
        };
        // Media
        const pic_urls = item.pic_urls;
        const pic_ids  = item.pic_ids;
        if (pic_urls && pic_urls.length > 0 || pic_ids && pic_ids.length > 0) {
            Object.assign(weiboObj, {
                media: filterUtils.weibo.media(pic_urls || pic_ids),
            });
        }
        // Location
        if (item.geo && item.geo.type === 'Point') {
            let _place_name;
            let _place_id;
            const annotations = item.annotations;

            if (annotations && annotations[0].place) {
                _place_name = annotations[0].place.title;
                _place_id = annotations[0].place.poiid;
            }

            const name = _place_name;
            const place_id = _place_id;
            const id = `${item.geo.coordinates[0]}_${item.geo.coordinates[1]}`;

            Object.assign(weiboObj, { location: { name, place_id, id } });
        }

        /**
         * Retweet & Quote
         *
         */
        if (item.retweeted_status) {
            const r_type = /^转发微博|Repost|轉發微博$/.test(item.text) ? 'retweet' : 'quote';
            const r_item = item.retweeted_status;

            const r_obj = {
                type         : 'tweet',
                provider     : 'weibo',
                created_at   : Date.parse(r_item.created_at),
                id_str       : r_item.idstr,
                mid          : mid.encode(r_item.mid),
                user         : filterUtils.weibo.user(r_item.user),
                text         : r_item.text,
                retweet_count: r_item.reposts_count,
                retweeted    : false,
                reply_count  : r_item.comments_count,
                like_count   : r_item.attitudes_count,
                liked        : r_item.favorited,
            };
            // Media
            const r_pic_urls = r_item.pic_urls;
            const r_pic_ids  = r_item.pic_ids;
            if (r_pic_urls && r_pic_urls.length > 0 || r_pic_ids && r_pic_urls.length > 0) {
                Object.assign(r_obj, {
                    media: filterUtils.weibo.media(r_pic_urls || r_pic_ids),
                });
            }
            // Location
            if (r_item.geo && r_item.geo.type === 'Point') {
                let _place_name;
                let _place_id;
                const annotations = r_item.annotations;

                if (annotations && annotations[0].place) {
                    _place_name = annotations[0].place.title;
                    _place_id = annotations[0].place.poiid;
                }

                const name = _place_name;
                const place_id = _place_id;
                const id = `${r_item.geo.coordinates[0]}_${r_item.geo.coordinates[1]}`;

                Object.assign(r_obj, { location: { name, place_id, id } });
            }

            Object.assign(weiboObj, { type: r_type, [r_type]: r_obj });
        }

        cache.push(weiboObj);
    });

    const returnObj = { data: cache };
    const firstData = cache[0];
    const lastData  = cache[postsLength - 1];

    if (lastData) {
        Object.assign(returnObj, {
            minId  : lastData.id_str,
            minDate: lastData.created_at,
            maxId  : firstData.id_str,
            maxDate: firstData.created_at,
        });
    }

    return returnObj;
};
