import React from 'react';

// Components
import Text from '../Utils/Text';
import TimeAgo from '../Utils/TimeAgo';
import { Avatar, RetweetAvatar} from '../Utils/Avatar';
import { TwitterMedia } from '../Utils/Media';
import { TwitterAction } from '../Utils/Action';

export default ({ post, opts }) => (
    <div>
        {!opts.isAvatarLess ? <Avatar provider="twitter" {...post.retweet.user} /> : null}
        <div className="post__content">
            <Text
                text={post.retweet.text}
                middlewares={[
                    { middleware: 'trimMediaLink', opts: { link: post.retweet.mediaLink } },
                    { middleware: 'linkify', opts: { provider: 'twitter' } }
                ]}
            />
            {post.retweet.media && post.retweet.media.length > 0
                ? <TwitterMedia media={post.retweet.media} />
                : null
            }
        </div>

        <RetweetAvatar provider="twitter" {...post.user} />

        <TwitterAction post={post.retweet} opts={opts} />
        <TimeAgo date={post.created_at} />
    </div>
);