import React from 'react';

import UserLink from '../../../Utils/UserLink';
import Text from '../../../Utils/Post/Utils/Text';
import TimeAgo from '../../../Utils/Post/Utils/TimeAgo';

export default ({ type, provider, list, count }) => (
    <div>
    {list.map((item, index) => (
        <li key={index} className="detail__column vertically_center">
            <UserLink
                provider={provider}
                screen_name={item.screen_name}
                className="detail__column__avatar detail__avatar"
            >
                <img src={item.avatar} />
            </UserLink>
            <div className="detail__column__content">
                <Text
                    className="detail__column__text"
                    provider={provider} text={item.text}
                />
                <TimeAgo className="detail__column__time" date={item.created_at} />
            </div>
        </li>
    ))}
    </div>
);