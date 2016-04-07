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
    <div>
    {data.map((item, index) => {
        const { link, provider, iconName, iconType } = item;
        const rowNum = data.length;
        const btnClass = classNames({
            'menu--row menu__btn btn tips animate--faster': true,
            [`menu--row-${rowNum}-${index + 1}`]: true,
            [`color--${provider}`]: provider,
        });
        const providerColor = selectProviderColor[provider];
        const activeColor = '#000';

        return (
           <Link to={link} key={link}>
                <span className={btnClass}>
                    {iconType === 'menu'
                        ? <MenuIcon
                            oColor={providerColor}
                            tColor={
                                provider !== 'instagram'
                                && provider !== 'unsplash'
                                && activeColor
                            }
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
