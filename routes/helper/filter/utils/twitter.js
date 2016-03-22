"use strict";


function user(user) {
    const name        = user.name;
    const uid         = user.id_str;
    const screen_name = user.screen_name;
    const avatar      = user.profile_image_url_https;

    return { name, uid, screen_name, avatar };
}
function media(items) {
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

    return cache;
}


module.exports = { user, media };