import React from 'react';

// Components
import Text from '../Utils/Text';
import Media from '../Utils/Media';
import Action from '../Utils/Action';
import TimeAgo from '../Utils/TimeAgo';
import { Avatar } from '../Utils/Avatar';

export default ({ post, highlight }) => (
    <div>
        {!post.avatarless && <Avatar provider="weibo" {...post.user} />}
        <div className="post__content">
            <Text
                provider="weibo"
                text={post.text}
                middlewares={[
                    { order: 5, middleware: 'highlight', opts: { provider: 'weibo', highlight } },
                ]}
            />
        </div>

        <div className="post post--quote post--quote--weibo">
            <Avatar provider="weibo" {...post.quote.user} />
            <div className="post__content">
                <Text
                    provider="weibo"
                    text={post.quote.text}
                    middlewares={[
                        {
                            order: 5,
                            middleware: 'highlight',
                            opts: { provider: 'weibo', highlight },
                        },
                    ]}
                />

                {post.quote.media && post.quote.media.length > 0 && (
                    <Media provider="weibo" media={post.quote.media} />
                )}
            </div>

            <Action post={post.quote} />
            <TimeAgo date={post.quote.created_at} />
        </div>

        <Action post={post} />
        <TimeAgo date={post.created_at} />
    </div>
);
