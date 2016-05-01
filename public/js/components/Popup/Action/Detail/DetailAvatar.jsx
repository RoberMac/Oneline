import React from 'react';
import classNames from 'classnames';

// Components
import UserLink from 'components/Utils/UserLink';

export default ({ type, provider, list = [] }) => {
    const columnClass = classNames({
        detail__avatar: true,
        [`detail__avatar--${type}`]: type,
    });

    return (
        <div className={columnClass}>
            <div className="overflow--x">
                {list.map((item, index) => (
                    <UserLink key={index} provider={provider} screen_name={item.screen_name}>
                        <span className="detail__avatar__item detail__avatar">
                            <img
                                src={item.avatar}
                                alt={`${item.name || item.screen_name}'s avatar`}
                            />
                        </span>
                    </UserLink>
                ))}
            </div>
        </div>
    );
};
