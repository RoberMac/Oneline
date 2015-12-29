import React from 'react';

// Components
import { Avatar } from '../Utils/Avatar';
import Text from '../Utils/Text';
import { WeiboMedia } from '../Utils/Media';
import TimeAgo from '../Utils/TimeAgo';
import { Like, Retweet, Reply, Source, Star } from '../Utils/Action';

export default props => (
    <div className="post post--weibo">
        <Avatar provider="weibo" {...props.user} />
        <div className="post__content">
            <Text
                text={props.text}
                middlewares={[
                    { middleware: 'linkify', opts: { provider: 'weibo' } },
                    { middleware: 'weiboEmotify' }
                ]}
            />
        </div>

        <div className="post post--quote post--quote--weibo">
            <Avatar provider="weibo" {...props.quote.user} />
            <div className="post__content">
                <Text
                    text={props.quote.text}
                    middlewares={[
                        { middleware: 'linkify', opts: { provider: 'weibo' } },
                        { middleware: 'weiboEmotify' }
                    ]}
                />
                {
                    props.quote.media && props.quote.media.length > 0
                        ? <WeiboMedia media={props.quote.media} />
                    : null
                }
            </div>
            <span className="cursor--pointer">
                <Retweet
                    provider="weibo"
                    id={props.quote.id_str}
                    count={props.quote.retweet_count}
                    post={props.quote}
                />
                <Reply
                    provider="weibo"
                    id={props.quote.id_str}
                    count={props.quote.reply_count}
                    post={props.quote}
                />
                <Source provider="weibo" uid={props.quote.user.uid} mid={props.quote.mid} />
                <Star provider="weibo" id={props.quote.id_str} stared={props.quote.stared} />
                <Like count={props.quote.favorite_count} liked={props.quote.liked} />
            </span>

            <TimeAgo date={props.quote.created_at} />
        </div>

        <span className="cursor--pointer">
            <Retweet provider="weibo" id={props.id_str} count={props.quote_count} post={props} />
            <Reply provider="weibo" id={props.id_str} count={props.reply_count} post={props} />
            <Source provider="weibo" uid={props.user.uid} mid={props.mid} />
            <Star provider="weibo" id={props.id_str} stared={props.stared} />
            <Like count={props.favorite_count} liked={props.liked} />
        </span>

        <TimeAgo date={props.created_at} />
    </div>
);