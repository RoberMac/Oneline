"use strict";
const calcRatio = require('./helpers').calcRatio;


function user(user) {
    const name        = user.full_name;
    const avatar      = user.profile_picture;
    const screen_name = user.username;
    const uid         = user.id;
    const created_at  = user.created_time * 1000;

    return { name, avatar, screen_name, uid, created_at };
}
function media(image){
    const _low = image.low_resolution;
    const _standard = image.standard_resolution;

    return {
        small: _low.url,
        large: _standard.url,
        ratio: calcRatio(_standard.width, _standard.height)
    };
}


module.exports = { user, media };