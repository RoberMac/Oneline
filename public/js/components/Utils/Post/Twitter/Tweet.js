import React from 'react';

// Components
import Text from '../Utils/Text';
import Media from '../Utils/Media';
import Action from '../Utils/Action';
import TimeAgo from '../Utils/TimeAgo';
import { Avatar } from '../Utils/Avatar';

export default ({ post }) => (
    <div>
        {!post.avatarless ? <Avatar provider="twitter" {...post.user} /> : null}
        <div className="post__content">
            <Text
                provider="twitter"
                text={post.text}
                middlewares={[
                    { order: 2, middleware: 'trimMediaLink', opts: { link: post.mediaLink } }
                ]}
            />
            {post.media && post.media.length > 0
                ? <Media provider="twitter" media={post.media} />
                : null
            }
        </div>

        <Action post={post} />
        <TimeAgo date={post.created_at} />
    </div>
);