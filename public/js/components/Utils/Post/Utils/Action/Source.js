import React from 'react';

import './action.css';

// Helper
const selectSrc = {
    twitter: ({ screen_name, id_str }) => `//twitter.com/${screen_name}/status/${id_str}`,
    instagram: ({ link }) => link,
    weibo: ({ uid, mid }) => `//weibo.com/${uid}/${mid}`
}

import Icon from '../../../Icon';

export default (props) => (
    <a href={selectSrc[props.provider]({...props})} target="_blank" role="button">
        <span className="action btn tips--deep">
            <Icon className="action__button" viewBox="0 0 26 26" name="source" data-source />
            <span className="action__count" />
        </span>
    </a>
)