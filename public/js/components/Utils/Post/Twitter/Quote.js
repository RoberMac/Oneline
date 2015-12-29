import React from 'react';

// Components
import { Avatar } from '../Utils/Avatar';
import Text from '../Utils/Text';
import { TwitterMedia } from '../Utils/Media';
import TimeAgo from '../Utils/TimeAgo';
import { Like, Retweet, Reply, Source } from '../Utils/Action';

export default props => (
    <div className="post post--twitter">
        <Avatar provider="twitter" {...props.user} />
        <div className="post__content">
            <Text
                text={props.text}
                middlewares={[
                    { middleware: 'trimSuffixLink' },
                    { middleware: 'trimMediaLink', opts: { link: props.mediaLink } },
                    { middleware: 'linkify', opts: { provider: 'twitter' } }
                ]}
            />
            {
                props.media && props.media.length > 0
                    ? <TwitterMedia media={props.media} />
                : null
            }
        </div>

        <div className="post post--quote post--quote--twitter">
            <Avatar provider="twitter" {...props.quote.user} />
            <div className="post__content">
                <Text
                    text={props.quote.text}
                    middlewares={[
                        { middleware: 'trimMediaLink', opts: { link: props.quote.mediaLink } },
                        { middleware: 'linkify', opts: { provider: 'twitter' } }
                    ]}
                />
                {
                    props.quote.media && props.quote.media.length > 0
                        ? <TwitterMedia media={props.quote.media} />
                    : null
                }
            </div>
            <span className="cursor--pointer">
                <Like
                    provider="twitter"
                    id={props.quote.id_str}
                    count={props.quote.like_count}
                    liked={props.quote.liked}
                />
                <Retweet
                    provider="twitter"
                    id={props.quote.id_str}
                    count={props.quote.retweet_count}
                    retweeted={props.quote.retweeted}
                    post={props.quote}
                />
                <Reply provider="twitter" id={props.quote.id_str} post={props.quote} />
                <Source
                    provider="twitter"
                    screen_name={props.quote.user.screen_name}
                    id={props.quote.id_str}
                />
            </span>
        </div>

        <span className="cursor--pointer">
            <Like provider="twitter" count={props.like_count} liked={props.liked} />
            <Retweet
                provider="twitter"
                id={props.id_str}
                count={props.retweet_count}
                retweeted={props.retweeted}
                post={props}
            />
            <Reply provider="twitter" id={props.id_str} post={props} />
            <Source provider="twitter" screen_name={props.user.screen_name} id={props.id_str} />
        </span>

        <TimeAgo date={props.created_at} />
    </div>
);