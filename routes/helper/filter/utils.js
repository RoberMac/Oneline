"use strict";
/**
 * Trim User
 *
 */
function trimTweetUser (user){
    let name        = user.name;
    let uid         = user.id_str;
    let screen_name = user.screen_name;
    let avatar      = user.profile_image_url_https;

    return { name, uid, screen_name, avatar };
}
function trimInstagramUser (user){
    let name        = user.full_name;
    let avatar      = user.profile_picture;
    let screen_name = user.username;
    let uid         = user.id;
    let created_at  = user.created_time * 1000;

    return { name, avatar, screen_name, uid, created_at };
}
function trimWeiboUser (user){
    if (!user){
        user = {
            name: '微博小秘书',
            idstr: '1642909335',
            screen_name: '微博小秘书',
            profile_image_url: 'https://tpssl.weibo.cn/1642909335/180/22867541466/1'
        }
    }

    let name = user.name;
    let uid = user.idstr;
    let screen_name = user.screen_name;
    let avatar = user.profile_image_url;

    return { name, uid, screen_name, avatar };
}
/**
 * Filter Media
 *
 */
function filterTweetMedia (items){
    let cache = [];

    for (let item of items){
        let _sizes = item.sizes.medium;
        let type = item.type;
        let image_url = item.media_url_https;
        let ratio = (_sizes.h / _sizes.w).toFixed(5);

        let mediaObj = { type, image_url, ratio };

        // 'animated_gif' / 'video'
        if (item.type !== 'photo'){
            let _video = item.video_info.variants
                            .filter((video) => video.content_type === "video/mp4")
                            .sort((v1, v2) => v1.bitrate - v2.bitrate)[0];

            Object.assign(mediaObj, { video_url: _video.url })
        }

        cache.push(mediaObj)
    }

    return cache
}
function filterInstagramImages (images){
    let _low = images.low_resolution;
    let _standard = images.standard_resolution;

    let low_resolution = _low.url;
    let standard_resolution = _standard.url;
    let ratio = (_standard.height / _standard.width).toFixed(5);

    return { low_resolution, standard_resolution, ratio };
}
function filterWeiboMedia(items){
    let cache = [];

    for (let item of items){
        // `pic_ids`
        if (item.length <= 32){
            item = {
                thumbnail_pic: 'http://ww1.sinaimg.cn/thumbnail/' + item + '.jpg'
            }
        }

        let type = item.thumbnail_pic.indexOf('\.gif') > 0 ? 'gif' : 'photo';
        let image_url = item.thumbnail_pic.replace('thumbnail', 'square');

        cache.push({ type, image_url })
    }

    return cache
}

module.exports = {
    twitter: {
        user: trimTweetUser,
        media: filterTweetMedia
    },
    instagram: {
        user: trimInstagramUser,
        media: filterInstagramImages
    },
    weibo: {
        user: trimWeiboUser,
        media: filterWeiboMedia
    }
}
