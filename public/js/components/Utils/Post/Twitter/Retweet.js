import React from 'react';

// Components
import { Avatar, RetweetAvatar} from '../Utils/Avatar';
import Text from '../Utils/Text';
import { TwitterMedia } from '../Utils/Media';
import TimeAgo from '../Utils/TimeAgo';
import { Like, Retweet, Reply, Source, Trash, Location } from '../Utils/Action';

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