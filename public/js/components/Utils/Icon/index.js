import React from 'react';

import iconSprites from 'images/icon-sprites.svg';

const _SQUARE = '0 0 100 100';
const ICONS_VIEWBOX = {
    // Provider
    "instagram": "0 0 775 300",
    "twitter": _SQUARE,
    "weibo": _SQUARE,
    // Actions
    "calendar": _SQUARE,
    "camera": _SQUARE,
    "clipboard": _SQUARE,
    "detail": "0 0 34 26",
    "location": _SQUARE,
    "like": _SQUARE,
    "reply": _SQUARE,
    "retweet": "0 0 34 26",
    "share": "0 0 34 26",
    "source": _SQUARE,
    "star": _SQUARE,
    "trash": _SQUARE,
    // Post
    "eyeball": _SQUARE,
    "play": _SQUARE,
    "users_in_photo": "0 0 100 117",
    // Write New Tweet
    "emotions": _SQUARE,
    "geoPicker": _SQUARE,
    "sensitive": _SQUARE,
    "tweet": _SQUARE,
    // Sidebar & Menu
    "2": _SQUARE,
    "cancel": _SQUARE,
    "deckard": _SQUARE,
    "newTweet": _SQUARE,
    "ok": _SQUARE,
    "menu": _SQUARE,
    "rachael": _SQUARE,
    "replicant": _SQUARE,
    "profile": _SQUARE,
    "settings": _SQUARE,
    "tags": _SQUARE,
    // User Profile
    "followed_by": _SQUARE,
    "following": _SQUARE,
    "follows": _SQUARE,
    "link": _SQUARE,
    "post": _SQUARE,
    // Others
    "direct_msg": "0 0 28 23",
    "locked": _SQUARE,
    "mentions": _SQUARE,
    "notification": _SQUARE,
    "show": "0 0 200 100",
    "wand": _SQUARE,
    "writing": "0 0 113 72"
};

export default ({ viewBox, name, className }) => (
    <svg viewBox={ICONS_VIEWBOX[name]} className={className ? className : ''}>
        <use xlinkHref={`#${name}`}></use>
    </svg>
);