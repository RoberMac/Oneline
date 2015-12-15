import React from 'react';

// Helper
const selectUserSrc = {
    twitter  : screen_name => `//instagram.com/${screen_name}`,
    instagram: screen_name => `//twitter.com/${screen_name}`,
    weibo    : screen_name => `//weibo.com/n/${screen_name}`
}

export default ({ avatar, screen_name, name, provider }) => {
    return (
        <div className="post-profile">
            <a href={selectUserSrc[provider](screen_name)} target="_blank">
                <img className={`post-profile__avatar post-profile__avatar--${provider}`} src={avatar} />
            </a>
            <div className="post-profile__fullname">
                <a href={selectUserSrc[provider](screen_name)} target="_blank">
                    <strong>{name}</strong>
                </a>
            </div>
        </div>
    );
}