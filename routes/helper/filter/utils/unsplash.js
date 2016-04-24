'use strict';

const calcRatio = require('./helpers').calcRatio;

function user(u) {
    const name        = u.name;
    const uid         = u.id;
    const screen_name = u.username;
    const avatar      = u.profile_image.medium;

    return { name, uid, screen_name, avatar };
}
function media(image) {
    return {
        small: image.urls.regular.replace('&w=1080&', '&w=640&'),
        large: image.urls.regular,
        ratio: calcRatio(image.width, image.height),
    };
}
function text(categories) {
    return categories.map(i => {
        const isFoodAndDrink = /food/i.test(i.title);
        const tagName = isFoodAndDrink ? 'Food' : i.title;

        return `#${tagName}`;
    }).join(' ');
}

module.exports = { user, media, text };
