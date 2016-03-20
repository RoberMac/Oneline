"use strict";

// Helpers
const calcRatio = (width, height) => (height / width).toFixed(5);

/**
 * Trim User
 *
 */
function trimTweetUser(user) {
    const name        = user.name;
    const uid         = user.id_str;
    const screen_name = user.screen_name;
    const avatar      = user.profile_image_url_https;

    return { name, uid, screen_name, avatar };
}
function trimInstagramUser(user) {
    const name        = user.full_name;
    const avatar      = user.profile_picture;
    const screen_name = user.username;
    const uid         = user.id;
    const created_at  = user.created_time * 1000;

    return { name, avatar, screen_name, uid, created_at };
}
function trimWeiboUser(user) {
    if (!user){
        user = {
            name: '微博小秘书',
            idstr: '1642909335',
            screen_name: '微博小秘书',
            profile_image_url: 'https://tpssl.weibo.cn/1642909335/180/22867541466/1'
        }
    }

    const name = user.name;
    const uid = user.idstr;
    const screen_name = user.screen_name;
    const avatar = user.profile_image_url;

    return { name, uid, screen_name, avatar };
}
function trimUnsplashUser(user) {
    const name        = user.name;
    const uid         = user.id;
    const screen_name = user.username;
    const avatar      = user.profile_image.medium;

    return { name, uid, screen_name, avatar };
}
/**
 * Filter Media
 *
 */
function filterTweetMedia(items) {
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
function filterInstagramImage(image){
    const _low = image.low_resolution;
    const _standard = image.standard_resolution;

    return {
        small: _low.url,
        large: _standard.url,
        ratio: calcRatio(_standard.width, _standard.height)
    };
}
function filterWeiboMedia(items) {
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
function filterUnsplashImage(image) {
    return {
        small: image.urls.regular.replace('&w=1080&', '&w=640&'),
        large: image.urls.regular,
        ratio: calcRatio(image.width, image.height)
    };
}


module.exports = {
    twitter: {
        user: trimTweetUser,
        media: filterTweetMedia
    },
    instagram: {
        user: trimInstagramUser,
        media: filterInstagramImage
    },
    weibo: {
        user: trimWeiboUser,
        media: filterWeiboMedia
    },
    unsplash: {
        user: trimUnsplashUser,
        media: filterUnsplashImage
    }
}
