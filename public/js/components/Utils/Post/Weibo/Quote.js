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
        </div>

        <div className="post post--quote post--quote--weibo">
            <Avatar provider="weibo" {...post.quote.user} />
            <div className="post__content">
                <Text
                    provider="weibo"
                    text={post.quote.text}
                    middlewares={post.quote.location && post.quote.location.name ? [
                        { order: 1, middleware: 'trimSuffixLink' }
                    ] : null}
                />

                {post.quote.media && post.quote.media.length > 0
                    ? <WeiboMedia media={post.quote.media} />
                    : null
                }
            </div>

            <Action post={post.quote} />
            <TimeAgo date={post.quote.created_at} />
        </div>

        <Action post={post} />
        <TimeAgo date={post.created_at} />
    </div>
);