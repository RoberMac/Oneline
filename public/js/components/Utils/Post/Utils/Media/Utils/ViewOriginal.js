import React from 'react';
import classNames from 'classnames';

import Icon from 'components/Utils/Icon';

export default ({ link, provider }) => {
    const originIconClass = classNames(
        'post-media__icon',
        'post-media__icon--origin',
        `color--${provider}`,
        'tips--deep'
    );

    return (
        <a className={originIconClass} href={link} target="_blank">
            <Icon name="eyeball" />
        </a>
    );
}