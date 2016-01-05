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
            <Text provider="weibo" text={post.text} />
        </div>

        <div className="post post--quote post--quote--weibo">
            <Avatar provider="weibo" {...post.quote.user} />
            <div className="post__content">
                <Text provider="weibo" text={post.quote.text} />

                {post.quote.media && post.quote.media.length > 0
                    ? <WeiboMedia media={post.quote.media} />
                    : null
                }
            </div>

            <WeiboAction post={post.quote} opts={opts} />
            <TimeAgo date={post.quote.created_at} />
        </div>

        <WeiboAction post={post} opts={opts} />
        <TimeAgo date={post.created_at} />
    </div>
);