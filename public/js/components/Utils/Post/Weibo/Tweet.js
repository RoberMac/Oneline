import React from 'react';

// Components
import Empty from '../../../Utils/Empty';
import Avatar from '../Utils/Avatar';
import Text from '../Utils/Text';
import Media from '../Utils/Media/Weibo';
import { Retweet, Reply, Source, Star } from '../Utils/Action';

export default props => (
    <div className="timeline timeline--weibo">
        <Avatar provider="weibo" {...props.user} />
        <div className="timeline__content">
            <Text provider="weibo" text={props.text} />
            {
                props.media && props.type === 'tweet' && props.media.length > 0
                    ? <Media media={props.media} />
                : <Empty />
            }
        </div>

        <span className="cursor--pointer">
            <Retweet />
            <Reply />
            <Source provider="weibo" uid={props.user.uid} mid={props.mid} />
            <Star />
        </span>
    </div>
);