function user(u) {
    const name        = u.name;
    const uid         = u.id_str;
    const screen_name = u.screen_name;
    const avatar      = u.profile_image_url_https;

    return { name, uid, screen_name, avatar };
}
function media(items) {
    const cache = [];

    for (const item of items) {
        const _sizes = item.sizes.medium;
        const type = item.type;
        const image_url = item.media_url_https;
        const ratio = (_sizes.h / _sizes.w).toFixed(5);

        const mediaObj = { type, image_url, ratio };

        // 'animated_gif' / 'video'
        if (item.type !== 'photo') {
            const _video = (
                item
                .video_info.variants
                .filter((video) => video.content_type === 'video/mp4')
                .sort((v1, v2) => v1.bitrate - v2.bitrate)[0]
            );

            Object.assign(mediaObj, { video_url: _video.url });
        }

        cache.push(mediaObj);
    }

    return cache;
}

module.exports = { user, media };
