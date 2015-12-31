import React from 'react';
import { Link } from 'react-router';

// Helper
// via https://github.com/KyleAMathews/isRetina
const isRetina = (
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
    twitter  : avatar => isRetina ? avatar.replace('normal', 'bigger') : avatar,
    instagram: avatar => avatar,
    weibo    : avatar => isRetina ? avatar.replace('/50/', '/180/') : avatar
}


// Components
const UserLink = ({ provider, screen_name, children }) => (
    provider === 'weibo'
        ? <a href={`//weibo.com/n/${screen_name}`} target="_blank">{children}</a>
    : <Link to={`/home/${provider}/user/${screen_name}`}>{children}</Link>
);
export const Avatar = ({ avatar, screen_name, name, provider }) => (
    <div className="post-profile">
        <UserLink provider={provider} screen_name={screen_name}>
            <img
                className={`post-profile__avatar post-profile__avatar--${provider}`}
                src={converToHDAvatar[provider](avatar)}
            />
        </UserLink>
        <div className="post-profile__fullname">
            <UserLink provider={provider} screen_name={screen_name}>
                <strong>{name}</strong>
            </UserLink>
        </div>
    </div>
);
export const RetweetAvatar = ({ avatar, screen_name, provider }) => (
    <UserLink provider={provider} screen_name={screen_name}>
        <span className="post-profile__avatar--retweet">
            <img className={`post-profile__avatar post-profile__avatar--${provider}`} src={avatar} />
        </span>
    </UserLink>
);