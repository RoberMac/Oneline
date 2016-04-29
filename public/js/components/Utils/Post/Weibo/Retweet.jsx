import React from 'react';

// Components
import Text from '../Utils/Text';
import Media from '../Utils/Media';
import Action from '../Utils/Action';
import TimeAgo from '../Utils/TimeAgo';
import { Avatar, RetweetAvatar } from '../Utils/Avatar';

export default ({ post, highlight }) => (
    <div>
        {!post.avatarless ? <Avatar provider="weibo" {...post.retweet.user} /> : null}
        <section className="post__content">
            <Text
                provider="weibo"
                text={post.retweet.text}
                middlewares={[
                    { order: 5, middleware: 'highlight', opts: { provider: 'weibo', highlight } },
                ]}
            />

            {post.retweet.media && post.retweet.media.length > 0 && (
                <Media provider="weibo" media={post.retweet.media} />
            )}
        </section>

        <RetweetAvatar provider="weibo" {...post.user} />

        <footer className="post__footer">
            <Action post={post.retweet} />
            <TimeAgo date={post.created_at} />
        </footer>
    </div>
);
