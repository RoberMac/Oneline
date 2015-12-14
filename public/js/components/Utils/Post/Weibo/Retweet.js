import React from 'react';

// Components
import Empty from '../../../Utils/Empty';
import Avatar from '../Utils/Avatar';
import Text from '../Utils/Text';
import Media from '../Utils/Media/Weibo';
import { Retweet, Reply, Source, Star } from '../Utils/Action';

export default props => (
    <div className="timeline timeline--weibo">
        <Avatar provider="weibo" {...props.retweet.user} />
        <div className="timeline__content">
            <Text provider="weibo" text={props.retweet.text} />
            {
                props.media && props.type === 'tweet' && props.media.length > 0
                    ? <Media media={props.media} />
                : <Empty />
            }
        </div>

        <a
            className="timeline--retweet__profile__avatar"
            href={`//weibo.com/n/${props.user.screen_name}`}
            target="_blank"
        >
            <img className="timeline__profile__avatar" src={props.user.avatar} alt="avatar" />
        </a>

        <span className="cursor--pointer">
            <Retweet />
            <Reply />
            <Source provider="weibo" uid={props.user.uid} mid={props.mid} />
            <Star />
        </span>
    </div>
);