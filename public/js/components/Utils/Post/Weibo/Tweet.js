import React from 'react';

// Components
import Text from '../Utils/Text';
import TimeAgo from '../Utils/TimeAgo';
import { Avatar } from '../Utils/Avatar';
import { WeiboMedia } from '../Utils/Media';
import { WeiboAction } from '../Utils/Action';

export default ({ post, opts }) => (
    <div>
        {!opts.isAvatarLess ? <Avatar provider="weibo" {...post.user} /> : null}
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

        <WeiboAction post={post} opts={opts} />

        <TimeAgo date={post.created_at} />
    </div>
);