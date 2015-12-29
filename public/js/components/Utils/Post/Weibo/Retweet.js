import React from 'react';

// Components
import { Avatar, RetweetAvatar } from '../Utils/Avatar';
import Text from '../Utils/Text';
import { WeiboMedia } from '../Utils/Media';
import TimeAgo from '../Utils/TimeAgo';
import { Like, Retweet, Reply, Source, Star } from '../Utils/Action';

export default props => (
    <div className="post post--weibo">
        <Avatar provider="weibo" {...props.retweet.user} />
        <div className="post__content">
            <Text
                text={props.retweet.text}
                middlewares={[
                    { middleware: 'linkify', opts: { provider: 'weibo' } },
                    { middleware: 'weiboEmotify' }
                ]}
            />
            {
                props.retweet.media && props.retweet.media.length > 0
                    ? <WeiboMedia media={props.retweet.media} />
                : null
            }
        </div>

        <RetweetAvatar provider="weibo" {...props.user}/>

        <span className="cursor--pointer">
            <Retweet
                provider="weibo"
                id={props.retweet.id_str}
                count={props.retweet.retweet_count}
                post={props.retweet}
            />
            <Reply
                provider="weibo"
                id={props.retweet.id_str}
                count={props.retweet.reply_count}
                post={props.retweet}
            />
            <Source provider="weibo" uid={props.retweet.user.uid} mid={props.retweet.mid} />
            <Star provider="weibo" id={props.retweet.id_str} stared={props.retweet.stared} />
            <Like count={props.retweet.favorite_count} liked={props.retweet.liked} />
        </span>

        <TimeAgo date={props.created_at} />
    </div>
);