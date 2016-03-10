import React from 'react';
import classNames from 'classnames';

import UserLink from 'components/Utils/UserLink';

export default ({ type, provider, list, children }) => {
    const _list = list || [];
    const listLength = _list.length;
    const columnClass = classNames({
        'detail__column': true,
        [`detail__column--${type}`]: type,
        ['detail__column--empty']: listLength <= 0
    })
    return (
        <div className={columnClass}>
            <div className="overflow--x">
                {children}
                {_list.map((item, index) => (
                    <UserLink
                        key={index}
                        provider={provider}
                        screen_name={item.screen_name}
                        className="detail__column__cell detail__avatar"
                    >
                        <img src={item.avatar} />
                    </UserLink>
                ))}
            </div>
        </div>
    );
};