import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

// Helpers
import { selectProviderColor } from 'utils/select';

// Components
import Icon from 'components/Utils/Icon';
import MenuIcon from './MenuIcon';

// Export
export default ({ data }) => (
    <div className="menu">
    {data.map(item => {
        const { link, provider, iconName, iconType } = item;
        const btnClass = classNames({
            'menu__btn btn tips animate--faster': true,
            [`color--${provider}`]: provider,
        });
        const providerColor = selectProviderColor[provider];
        const activeColor = '#000';

        return (
            <Link to={link} key={link} onClick={e => e.stopPropagation()}>
                <span className={btnClass}>
                    {iconType === 'menu'
                        ? <MenuIcon
                            oColor={providerColor}
                            tColor={provider !== 'unsplash' && activeColor}
                            cColor={activeColor}
                            rColor={provider !== 'weibo' && activeColor}
                        />
                        : <Icon name={iconName} />
                    }
                </span>
            </Link>
        );
    })}
    </div>
);
