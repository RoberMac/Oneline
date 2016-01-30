import React from 'react';

// Components
import Text from '../Utils/Text';
import TimeAgo from '../Utils/TimeAgo';
import Action from '../Utils/Action';
import { Avatar, RetweetAvatar } from '../Utils/Avatar';
import { WeiboMedia } from '../Utils/Media';

export default ({ post }) => (
    <div>
        {!post.avatarless ? <Avatar provider="weibo" {...post.retweet.user} /> : null}
        <div className="post__content">
            <Text
                provider="weibo"
                text={post.retweet.text}
                middlewares={post.retweet.location && post.retweet.location.name ? [
                    { order: 1, middleware: 'trimSuffixLink' }
                ] : null}
            />

            {post.retweet.media && post.retweet.media.length > 0
                ? <WeiboMedia media={post.retweet.media} />
                : null
            }
        </div>

        <RetweetAvatar provider="weibo" {...post.user}/>

        <Action post={post.retweet} />

        <TimeAgo date={post.created_at} />
    </div>
);