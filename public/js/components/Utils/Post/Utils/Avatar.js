import React from 'react';
import { Link } from 'react-router';

// Helper
const selectUserSrc = {
    twitter  : screen_name => `//instagram.com/${screen_name}`,
    instagram: screen_name => `//twitter.com/${screen_name}`,
    weibo    : screen_name => `//weibo.com/n/${screen_name}`
}

export default ({ avatar, screen_name, name, provider }) => {
    return (
        <div className="timeline__profile">
            <a href={selectUserSrc[provider](screen_name)} target="_blank">
                <img className="timeline__profile__avatar" src={avatar} />
            </a>
            <div className="timeline__profile__fullname">
                <a href={selectUserSrc[provider](screen_name)} target="_blank">
                    <strong>{name}</strong>
                </a>
            </div>
        </div>
    );
}