var extend = require('extend')

/**
 * Trim User
 *
 */
function trimTweetUser (user){
    return {
        name: user.name,
        uid: user.id_str,
        screen_name: user.screen_name,
        avatar: user.profile_image_url_https
    }
}
function trimInstagramUser (user){
    return {
        name: user.full_name,
        avatar: user.profile_picture,
        screen_name: user.username,
        uid: user.id,
        created_at: user.created_time * 1000
    }
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

    return {
        name: user.name,
        uid: user.idstr,
        screen_name: user.screen_name,
        avatar: user.profile_image_url
    }
}
/**
 * Filter Media
 *
 */
function filterTweetMedia(items){
    var cache = [];

    items.forEach(function (item){
        var _sizes = item.sizes.medium;

        var mediaObj = {
            type: item.type,
            image_url: item.media_url_https,
            ratio: (_sizes.h / _sizes.w).toFixed(5)
        }

        // 'animated_gif' / 'video'
        if (item.type !== 'photo'){
            var _video = item.video_info.variants
            .filter(function (video){
                return video.content_type === "video/mp4"
            })
            .sort(function (v1, v2){
                return v1.bitrate - v2.bitrate
            })[0];

            extend(mediaObj, {
                video_url: _video.url
            })
        }

        cache.push(mediaObj)
    })

    return cache
}
function filterInstagramImages (images){
    var _low = images.low_resolution,
        _standard = images.standard_resolution;

    return {
        low_resolution: _low.url,
        standard_resolution: _standard.url,
        ratio: (_standard.height / _standard.width).toFixed(5)
    }
}
function filterWeiboMedia(items){
    var cache = [];

    items.forEach(function (item){
        var type = item.thumbnail_pic.indexOf('\.gif') > 0 ? 'gif' : 'photo',
            image_url = item.thumbnail_pic.replace('thumbnail', 'square');

        var mediaObj = {
            type: type,
            image_url: image_url
        }

        cache.push(mediaObj)
    })

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
