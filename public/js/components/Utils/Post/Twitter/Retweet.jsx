import React from 'react';

// Components
import Text from '../Utils/Text';
import Media from '../Utils/Media';
import Action from '../Utils/Action';
import TimeAgo from '../Utils/TimeAgo';
import { Avatar, RetweetAvatar } from '../Utils/Avatar';

export default ({ post, highlight }) => (
    <div>
        {!post.avatarless && <Avatar provider="twitter" {...post.retweet.user} />}
        <section className="post__content">
            <Text
                provider="twitter"
                text={post.retweet.text}
                middlewares={[
                    {
                        order: 2,
                        middleware: 'trimMediaLink',
                        opts: { link: post.retweet.mediaLink },
                    },
                    {
                        order: 5,
                        middleware: 'highlight',
                        opts: { provider: 'twitter', highlight },
                    },
                ]}
            />
            {post.retweet.media && post.retweet.media.length > 0 && (
                <Media provider="twitter" media={post.retweet.media} />
            )}
        </section>

        <RetweetAvatar provider="twitter" {...post.user} />

        <section className="post__footer">
            <Action post={post.retweet} />
            <TimeAgo date={post.created_at} />
        </section>
    </div>
);
