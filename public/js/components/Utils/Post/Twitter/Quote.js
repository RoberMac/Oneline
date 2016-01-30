import React from 'react';

// Components
import Text from '../Utils/Text';
import TimeAgo from '../Utils/TimeAgo';
import Action from '../Utils/Action';
import { Avatar } from '../Utils/Avatar';
import { TwitterMedia } from '../Utils/Media';

export default ({ post }) => (
    <div>
        {!post.avatarless ? <Avatar provider="twitter" {...post.user} /> : null}
        <div className="post__content">
            <Text
                provider="twitter"
                text={post.text}
                middlewares={[
                    { order: 1, middleware: 'trimSuffixLink' },
                    { order: 2, middleware: 'trimMediaLink', opts: { link: post.mediaLink } }
                ]}
            />
            {post.media && post.media.length > 0
                ? <TwitterMedia media={post.media} />
                : null
            }
        </div>

        <div className="post post--quote post--quote--twitter">
            <Avatar provider="twitter" {...post.quote.user} />
            <div className="post__content">
                <Text
                    provider="twitter"
                    text={post.quote.text}
                    middlewares={[
                        { middleware: 'trimMediaLink', opts: { link: post.quote.mediaLink } }
                    ]}
                />
                {post.quote.media && post.quote.media.length > 0
                    ? <TwitterMedia media={post.quote.media} />
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