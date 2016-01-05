import React from 'react';

import UserLink from '../../../Utils/UserLink';
import Text from '../../../Utils/Post/Utils/Text';
import TimeAgo from '../../../Utils/Post/Utils/TimeAgo';

export default ({ provider, replyList }) => (
    <div>
    {replyList.map(item => (
        <li key={item.id} className="detail__list-cell vertically_center">
            <UserLink provider={provider} screen_name={item.screen_name}>
                <span className="detail__list-cell__avatar detail__avatar">
                    <img src={item.avatar} />
                </span>
            </UserLink>
            <div className="detail__list-cell__text">
                <Text provider={provider} text={item.text} />
                <TimeAgo className="detail__list-cell__time" date={item.created_at} />
            </div>
        </li>
    ))}
    </div>
);