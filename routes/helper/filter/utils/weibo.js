'use strict';

function user(u) {
    u = u || {
        name             : '微博小秘书',
        idstr            : '1642909335',
        screen_name      : '微博小秘书',
        profile_image_url: 'https://tpssl.weibo.cn/1642909335/180/22867541466/1',
    };

    const name        = u.name;
    const uid         = u.idstr;
    const screen_name = u.screen_name;
    const avatar      = u.profile_image_url;

    return { name, uid, screen_name, avatar };
}
function media(items) {
    const cache = [];

    for (let item of items) {
        // `pic_ids`
        if (item.length <= 32) {
            item = {
                thumbnail_pic: `http://ww1.sinaimg.cn/thumbnail/${item}.jpg`,
            };
        }

        const type = item.thumbnail_pic.indexOf('\.gif') > 0 ? 'gif' : 'photo';
        const image_url = item.thumbnail_pic.replace('thumbnail', 'square');

        cache.push({ type, image_url });
    }

    return cache;
}

module.exports = { user, media };
