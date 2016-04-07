import React from 'react';
import { Link } from 'react-router';

import { selectProviderColor } from 'utils/select';
import { providersActive } from 'utils/detect';

export default ({ link, activeProviders }) => {
    const {
        isTwitterActive,
        isInstagramActive,
        isWeiboActive,
    } = providersActive({ activeProviders });

    return (
        <Link to={link}>
            <span className="sidebar__button btn animate--faster">
                <svg viewBox="0 0 200 200">
                    <g fill="none">
                        <circle fill="#F1F1F1" cx="100" cy="100" r="100" />
                        <circle
                            fill={isTwitterActive ? selectProviderColor.twitter : '#FFF'}
                            cx="100" cy="42.5" r="15"
                        />
                        <circle
                            fill={isInstagramActive ? selectProviderColor.instagram : '#FFF'}
                            cx="100" cy="100" r="15"
                        />
                        <circle
                            fill={isWeiboActive ? selectProviderColor.weibo : '#FFF'}
                            cx="100" cy="157.5" r="15"
                        />
                    </g>
                </svg>
            </span>
        </Link>
    );
};
