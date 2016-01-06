import React from 'react';

import numAbbr from '../../../../utils/numAbbr';

import Icon from '../../../Utils/Icon';
import UserLink from '../../../Utils/UserLink';

export default ({ type, provider, list, count }) => (
    <div className="detail__row overflow--x">
        <span className={`detail__row__cell icon--${type}`}>
            <div className="detail__row__icon">
                <Icon viewBox="0 0 26 26" name={type} />
            </div>
            <div className="detail__row__count">
                <span>{numAbbr(count)}</span>
            </div>
        </span>
        {list.map((item, index) => (
            <UserLink
                key={index}
                provider={provider}
                screen_name={item.screen_name}
                className="detail__row__cell detail__avatar"
            >
                <img src={item.avatar} />
            </UserLink>
        ))}
    </div>
);