import React from 'react';
import classNames from 'classnames';

import Icon from '../../../../Icon';

export default ({ link, provider }) => {
    const originIconClass = classNames(
        'post-media__icon',
        'post-media__icon--origin',
        `icon--${provider}`,
        'tips--deep'
    );

    return (
        <a className={originIconClass} href={link} target="_blank">
            <Icon viewBox="0 0 100 100" name="eyeball" />
        </a>
    );
}