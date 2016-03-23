"use strict";
const filterUtils = require('../utils');


module.exports = data => {
    const postsLength = data.length;
    let cache = [];

    data.forEach((item, index) => {
        let igPost = {
            provider: 'instagram',
            created_at: Date.parse(new Date(item.created_time * 1000)) + (postsLength - index),
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
                    small: item.videos.low_resolution.url,
                    large: item.videos.standard_resolution.url
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