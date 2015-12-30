import React from 'react';

// Helper
const selectSrc = {
    twitter: ({ screen_name, id }) => `//twitter.com/${screen_name}/status/${id}`,
    instagram: ({ link }) => link,
    weibo: ({ uid, mid }) => `//weibo.com/${uid}/${mid}`
};
const isActive = ({ id, link, mid }) => {
    return id || link || mid;
};

import Icon from '../../../Icon';

export default (props) => (
    <a
        href={selectSrc[props.provider]({...props})}
        target="_blank"
        role="button"
    >
        <span
            className="post-action btn tips--deep"
            style={ isActive({...props}) ? null : { 'pointerEvents': 'none', 'opacity': '.1' } }
        >
            <Icon className="post-action__button" viewBox="0 0 26 26" name="source" />
            <span className="post-action__count" />
        </span>
    </a>
)