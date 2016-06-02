import React from 'react';

// Helpers
import { selectUserLink } from 'utils/select';
const isRetina = ( // via https://github.com/KyleAMathews/isRetina
    window.devicePixelRatio > 1.25
    || window.matchMedia
    && window.matchMedia(''
        + '(-webkit-min-device-pixel-ratio: 1.25), '
        + '(min--moz-device-pixel-ratio: 1.25), '
        + '(-o-min-device-pixel-ratio: 5/4), '
        + '(min-resolution: 1.25dppx)'
    ).matches
);
const converToHDAvatar = {
    twitter: avatar => isRetina ? avatar.replace('normal', 'bigger') : avatar,
    weibo: avatar => isRetina ? avatar.replace('/50/', '/180/') : avatar,
    unsplash: avatar => isRetina ? avatar.replace('&h=64&w=64&', '&h=96&w=96&') : avatar,
};

// Component
import UserLink from 'components/Utils/UserLink';

// Export
export const Avatar = ({ avatar, screen_name, name, provider }) => {
    const displayName = name || screen_name;
    return (
        <header className="post-profile">
            <UserLink provider={provider} screen_name={screen_name}>
                <img
                    className="post-profile__avatar"
                    src={converToHDAvatar[provider](avatar)}
                    alt={`${displayName}'s avatar`}
                    title={displayName}
                />
            </UserLink>
            <div className="post-profile__fullname">
                <a href={selectUserLink[provider](screen_name)} target="_blank">
                    <strong>{displayName}</strong>
                </a>
            </div>
        </header>
    );
};
export const RetweetAvatar = ({ avatar, screen_name, provider }) => {
    const displayName = name || screen_name;
    return (
        <header>
            <UserLink provider={provider} screen_name={screen_name}>
                <span className="post-profile__avatar--retweet">
                    <img
                        className={`post-profile__avatar post-profile__avatar--${provider}`}
                        src={avatar}
                        alt={`${displayName}'s avatar`}
                        title={displayName}
                    />
                </span>
            </UserLink>
        </header>
    );
};
