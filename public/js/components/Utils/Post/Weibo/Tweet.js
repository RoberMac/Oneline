import React from 'react';

// Components
import Text from '../Utils/Text';
import TimeAgo from '../Utils/TimeAgo';
import Action from '../Utils/Action';
import { Avatar } from '../Utils/Avatar';
import { WeiboMedia } from '../Utils/Media';

export default ({ post }) => (
    <div>
        {!post.avatarless ? <Avatar provider="weibo" {...post.user} /> : null}
        <div className="post__content">
            <Text
                provider="weibo"
                text={post.text}
                middlewares={post.location && post.location.name ? [
                    { order: 1, middleware: 'trimSuffixLink' }
                ] : null}
            />

            {post.media && post.media.length > 0
                ? <WeiboMedia media={post.media} />
                : null
            }
        </div>

        <Action post={post} />

        <TimeAgo date={post.created_at} />
    </div>
);