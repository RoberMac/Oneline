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
        <section className="post__content">
            <Text
                provider="twitter"
                text={post.text}
                middlewares={[
                    { order: 2, middleware: 'trimMediaLink', opts: { link: post.mediaLink } },
                    { order: 5, middleware: 'highlight', opts: { provider: 'twitter', highlight } },
                ]}
            />
            {post.media && post.media.length > 0 && <Media provider="twitter" media={post.media} />}
        </section>

        <section className="post__footer">
            <Action post={post} />
            <TimeAgo date={post.created_at} />
        </section>
    </div>
);
