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
    "users_in_photo": "0 0 100 117",
    // Write New Tweet
    "emotions": _SQUARE,
    "geoPicker": _SQUARE,
    "sensitive": _SQUARE,
    "tweet": _SQUARE,
    // Sidebar & Menu
    "2": _SQUARE,
    "sidebar_cancel": _SQUARE,
    "sidebar_ok": _SQUARE,
    "sidebar_menu": _SQUARE,
    "sidebar_settings": _SQUARE,
    "sidebar_replicant": _SQUARE,
    "menu_deckard": _SQUARE,
    "menu_rachael": _SQUARE,
    "menu_tweet": _SQUARE,
    "menu_profile": _SQUARE,
    "menu_search": _SQUARE,
    "tags": _SQUARE,
    // User Profile
    "followed_by": _SQUARE,
    "following": _SQUARE,
    "follows": _SQUARE,
    "link": _SQUARE,
    "post": _SQUARE,
    // Others
    "cancel": _SQUARE,
    "search": _SQUARE,
    "locked": _SQUARE,
    "user": _SQUARE,
    "mentions": _SQUARE,
    "triangle": _SQUARE,
    "wand": _SQUARE,
    "writing": "0 0 113 72"
};

export default ({ viewBox, name, className }) => (
    <svg
        viewBox={ICONS_VIEWBOX[name]}
        className={`${className ? className : ''} color--current--fill`}
    >
        <use xlinkHref={`#${name}`}></use>
    </svg>
);