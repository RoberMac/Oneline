import React from 'react';

// Components
import { Avatar } from '../Utils/Avatar';
import Text from '../Utils/Text';
import { TwitterMedia } from '../Utils/Media';
import TimeAgo from '../Utils/TimeAgo';
import { Like, Retweet, Reply, Source, Trash, Location } from '../Utils/Action';

export default ({ post, opts }) => (
    <div>
        {!opts.isAvatarLess ? <Avatar provider="twitter" {...post.user} /> : null}
        <div className="post__content">
            <Text
                text={post.text}
                middlewares={[
                    { middleware: 'trimSuffixLink' },
                    { middleware: 'trimMediaLink', opts: { link: post.mediaLink } },
                    { middleware: 'linkify', opts: { provider: 'twitter' } }
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
                    text={post.quote.text}
                    middlewares={[
                        { middleware: 'trimMediaLink', opts: { link: post.quote.mediaLink } },
                        { middleware: 'linkify', opts: { provider: 'twitter' } }
                    ]}
                />
                {post.quote.media && post.quote.media.length > 0
                    ? <TwitterMedia media={post.quote.media} />
                    : null
                }
            </div>

            <TwitterAction post={post.quote} opts={opts} />
            <TimeAgo date={post.quote.created_at} />
        </div>

        <TwitterAction post={post} opts={opts} />
        <TimeAgo date={post.created_at} />
    </div>
);