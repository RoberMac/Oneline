import React from 'react';

import { isInstagram, isUnsplash } from 'utils/detect';

import Icon from 'components/Utils/Icon';

export default ({ provider, counts }) => {
    const columnClass = `profile__count__column color--${provider}`;

    return (
        counts && !isUnsplash(provider)
            ? (
                <div className="profile__count">
                    <div className={columnClass} data-count={counts.statuses}>
                        <Icon name={isInstagram(provider) ? 'post' : 'tweet'} />
                    </div>
                    <div className={columnClass} data-count={counts.followed_by}>
                        <Icon name="followed_by" />
                    </div>
                    <div className={columnClass} data-count={counts.follows}>
                        <Icon name="follows" />
                    </div>
                </div>
            )
        : <span />
    );
};