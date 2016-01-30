import React from 'react';

// Components
import Text from '../Utils/Text';
import TimeAgo from '../Utils/TimeAgo';
import Action from '../Utils/Action';
import { Avatar, RetweetAvatar} from '../Utils/Avatar';
import { TwitterMedia } from '../Utils/Media';

export default ({ post }) => (
    <div>
        {!post.avatarless ? <Avatar provider="twitter" {...post.retweet.user} /> : null}
        <div className="post__content">
            <Text
                provider="twitter"
                text={post.retweet.text}
                middlewares={[
                    { order: 2, middleware: 'trimMediaLink', opts: { link: post.retweet.mediaLink } }
                ]}
            />
            {post.retweet.media && post.retweet.media.length > 0
                ? <TwitterMedia media={post.retweet.media} />
                : null
            }
        </div>

        <RetweetAvatar provider="twitter" {...post.user} />

        <Action post={post.retweet} />
        <TimeAgo date={post.created_at} />
    </div>
);