import React from 'react';

// Components
import Text from '../Utils/Text';
import Media from '../Utils/Media';
import Action from '../Utils/Action';
import TimeAgo from '../Utils/TimeAgo';
import { Avatar } from '../Utils/Avatar';

export default ({ post, highlight }) => (
    <div>
        {!post.avatarless && <Avatar provider="twitter" {...post.user} />}
        <div className="post__content">
            <Text
                provider="twitter"
                text={post.text}
                middlewares={[
                    { order: 1, middleware: 'trimSuffixLink' },
                    { order: 2, middleware: 'trimMediaLink', opts: { link: post.mediaLink } },
                    { order: 5, middleware: 'highlight', opts: { provider: 'twitter', highlight } },
                ]}
            />
            {post.media && post.media.length > 0 && (
                <Media provider="twitter" media={post.media} />
            )}
        </div>

        <div className="post post--quote post--quote--twitter">
            <Avatar provider="twitter" {...post.quote.user} />
            <div className="post__content">
                <Text
                    provider="twitter"
                    text={post.quote.text}
                    middlewares={[
                        {
                            order: 2,
                            middleware: 'trimMediaLink',
                            opts: { link: post.quote.mediaLink },
                        },
                        {
                            order: 5,
                            middleware: 'highlight',
                            opts: { provider: 'twitter', highlight },
                        },
                    ]}
                />
                {post.quote.media && post.quote.media.length > 0 && (
                    <Media provider="twitter" media={post.quote.media} />
                )}
            </div>

            <Action post={post.quote} />
            <TimeAgo date={post.quote.created_at} />
        </div>

        <Action post={post} />
        <TimeAgo date={post.created_at} />
    </div>
);
