import React from 'react';

import { isInstagram, isUnsplash } from 'utils/detect';

import Icon from 'components/Utils/Icon';

export default ({ provider, counts }) => {
    const columnItemClass = `profile__count__item column__item color--${provider}`;

    return (
        counts && !isUnsplash(provider) ? (
            <div className="profile__count column">
                <span className={columnItemClass}>
                    <Icon name={isInstagram(provider) ? 'post' : 'tweet'} />
                    <span>{counts.statuses}</span>
                </span>
                <span className={columnItemClass}>
                    <Icon name="followed_by" />
                    <span>{counts.followed_by}</span>
                </span>
                <span className={columnItemClass}>
                    <Icon name="follows" />
                    <span>{counts.follows}</span>
                </span>
            </div>
        )
        : <span />
    );
};
