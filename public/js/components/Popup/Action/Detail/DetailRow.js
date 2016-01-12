import React from 'react';

import UserLink from '../../../Utils/UserLink';
import Text from '../../../Utils/Post/Utils/Text';
import TimeAgo from '../../../Utils/Post/Utils/TimeAgo';

export default ({ provider, list }) => (
    <div>
    {list.map((item, index) => (
        <li key={index} className={`detail__row vertically_center ${index === 0 ? 'detail__row--reply' : ''}`}>
            <UserLink
                provider={provider}
                screen_name={item.screen_name}
                className="detail__row__avatar detail__avatar"
            >
                <img src={item.avatar} />
            </UserLink>
            <div className="detail__row__content">
                <Text
                    className="detail__row__text"
                    provider={provider}
                    text={item.text}
                />
                <TimeAgo className="detail__row__time" date={item.created_at} />
            </div>
        </li>
    ))}
    </div>
);