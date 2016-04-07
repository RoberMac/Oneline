import React from 'react';

import Icon from 'components/Utils/Icon';

export default ({ provider, link, iconName, title }) => (
    <div className={`banner color--${provider}`}>
        {link
            ? <a href={link} target="_blank">
                <span className={`banner__title btn color--${provider} tips--deep`}>
                    <Icon name={iconName} />
                    <span>{title}</span>
                </span>
            </a>
            : <span className={`banner__title color--${provider} tips--deep--peace`}>
                <Icon name={iconName} />
                <span>{title}</span>
            </span>
        }
    </div>
);
