import React from 'react';

// Components
import Text from '../Utils/Text';
import Action from '../Utils/Action';
import Media from '../Utils/Media';
import TimeAgo from '../Utils/TimeAgo';
import { Avatar } from '../Utils/Avatar';

export default ({ post }) => (
    <div>
        {!post.avatarless && <Avatar provider="weibo" {...post.user} />}
        <div className="post__content">
            <Text
                provider="weibo"
                text={post.text}
                middlewares={post.location && post.location.name ? [
                    { order: 1, middleware: 'trimSuffixLink' }
                ] : null}
            />

            {post.media && post.media.length > 0 && <Media provider="weibo" media={post.media} />}
        </div>

        <Action post={post} />

        <TimeAgo date={post.created_at} />
    </div>
);