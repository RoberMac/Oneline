/* eslint no-unused-vars: 0 */

import React from 'react';

import iconSprites from 'images/icon-sprites.svg';

const _SQUARE = '0 0 100 100';
const ICONS_VIEWBOX = {
    instagram: '0 0 775 300',
    unsplash: '0 0 775 300',
    detail: '0 0 34 26',
    retweet: '0 0 34 26',
    share: '0 0 34 26',
    users_in_photo: '0 0 100 117',
    writing: '0 0 113 72',
};

export default ({ name, className }) => (
    <svg
        viewBox={ICONS_VIEWBOX[name] || _SQUARE}
        className={`${className || ''} color--current--fill`}
    >
        <use xlinkHref={`#${name}`}></use>
    </svg>
);
