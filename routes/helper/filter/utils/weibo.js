"use strict";
const calcRatio = require('./helpers').calcRatio;


function user(user) {
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
function media(items) {
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

    return cache;
}


module.exports = { user, media };