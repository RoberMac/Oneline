'use strict';
const calcRatio = require('./helpers').calcRatio;

function user(u) {
    const name        = u.full_name;
    const avatar      = u.profile_picture;
    const screen_name = u.username;
    const uid         = u.id;

    return { name, avatar, screen_name, uid };
}
function media(image) {
    const _low = image.low_resolution;
    const _standard = image.standard_resolution;

    return {
        small: _low.url,
        large: _standard.url,
        ratio: calcRatio(_standard.width, _standard.height),
    };
}


module.exports = { user, media };
