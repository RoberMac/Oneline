import React from 'react';

// Components
import Empty from '../../Empty';
import Avatar from '../Utils/Avatar';
import Text from '../Utils/Text';
import Media from '../Utils/Media/Weibo';
import TimeAgo from '../Utils/TimeAgo';
import { Retweet, Reply, Source, Star } from '../Utils/Action';

export default props => (
    <div className="post post--weibo">
        <Avatar provider="weibo" {...props.user} />
        <div className="post__content">
            <Text provider="weibo" text={props.text} />
            {
                props.media && props.type === 'tweet' && props.media.length > 0
                    ? <Media media={props.media} />
                : <Empty />
            }
        </div>

        <div className="post post--quote post--quote--weibo">
            <Avatar provider="weibo" {...props.retweet.user} />
            <div className="post__content">
                <Text text={props.retweet.text} provider="weibo" />
                {
                    props.media && props.media.length > 0
                        ? <Media media={props.media} />
                    : <Empty />
                }
            </div>
            <span className="cursor--pointer">
                <Source provider="weibo" uid={props.retweet.user.uid} mid={props.retweet.mid} />
            </span>

            <TimeAgo date={props.retweet.created_at} />
        </div>

        <span className="cursor--pointer">
            <Retweet count={props.retweet_count} />
            <Reply />
            <Source provider="weibo" uid={props.user.uid} mid={props.mid} />
            <Star />
        </span>

        <TimeAgo date={props.created_at} />
    </div>
);