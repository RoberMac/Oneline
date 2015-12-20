import React from 'react';

// Helper
// via https://github.com/KyleAMathews/isRetina
const isRetina = window.devicePixelRatio > 1.25
                || window.matchMedia 
                && window.matchMedia(`
                    (-webkit-min-device-pixel-ratio: 1.25),
                    (min--moz-device-pixel-ratio: 1.25),
                    (-o-min-device-pixel-ratio: 5/4),
                    (min-resolution: 1.25dppx)
                `).matches;
const selectUserSrc = {
    twitter  : screen_name => `//twitter.com/${screen_name}`,
    instagram: screen_name => `//instagram.com/${screen_name}`,
    weibo    : screen_name => `//weibo.com/n/${screen_name}`
}
const converToHDAvatar = {
    twitter  : avatar => isRetina ? avatar.replace('normal', 'bigger') : avatar,
    instagram: avatar => avatar,
    weibo    : avatar => isRetina ? avatar.replace('/50/', '/180/') : avatar
}

export const Avatar = ({ avatar, screen_name, name, provider }) => (
        <div className="post-profile">
            <a href={selectUserSrc[provider](screen_name)} target="_blank">
                <img
                    className={`post-profile__avatar post-profile__avatar--${provider}`}
                    src={converToHDAvatar[provider](avatar)}
                />
            </a>
            <div className="post-profile__fullname">
                <a href={selectUserSrc[provider](screen_name)} target="_blank">
                    <strong>{name}</strong>
                </a>
            </div>
        </div>
);

export const RetweetAvatar = ({ avatar, screen_name, provider }) => (
    <a
        className="post-profile__avatar--retweet"
        href={selectUserSrc[provider](screen_name)}
        target="_blank"
    >
        <img className={`post-profile__avatar post-profile__avatar--${provider}`} src={avatar} />
    </a>
);