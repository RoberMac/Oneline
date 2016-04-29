import React from 'react';

// Components
import Text from '../Utils/Text';
import Action from '../Utils/Action';
import Media from '../Utils/Media';
import TimeAgo from '../Utils/TimeAgo';
import { Avatar } from '../Utils/Avatar';

export default ({ post, highlight }) => (
    <div>
        {!post.avatarless && <Avatar provider="weibo" {...post.user} />}
        <section className="post__content">
            <Text
                provider="weibo"
                text={post.text}
                middlewares={[
                    { order: 5, middleware: 'highlight', opts: { provider: 'weibo', highlight } },
                ]}
            />

            {post.media && post.media.length > 0 && <Media provider="weibo" media={post.media} />}
        </section>

        <footer className="post__footer">
            <Action post={post} />
            <TimeAgo date={post.created_at} />
        </footer>
    </div>
);
