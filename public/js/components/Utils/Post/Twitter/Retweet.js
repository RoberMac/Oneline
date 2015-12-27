import React from 'react';

// Components
import { Avatar, RetweetAvatar} from '../Utils/Avatar';
import Text from '../Utils/Text';
import { TwitterMedia } from '../Utils/Media';
import TimeAgo from '../Utils/TimeAgo';
import { Like, Retweet, Reply, Source } from '../Utils/Action';

export default props => (
    <div className="post post--twitter">
        <Avatar provider="twitter" {...props.retweet.user} />
        <div className="post__content">
            <Text
                text={props.retweet.text}
                middlewares={[
                    { middleware: 'trimMediaLink', opts: { link: props.retweet.mediaLink } },
                    { middleware: 'linkify', opts: { provider: 'twitter' } }
                ]}
            />
            {
                props.retweet.media && props.retweet.media.length > 0
                    ? <TwitterMedia media={props.retweet.media} />
                : null
            }
        </div>

        <RetweetAvatar provider="twitter" {...props.user} />

        <span className="cursor--pointer">
            <Like count={props.retweet.favorite_count}/>
            <Retweet
                provider="twitter"
                id={props.retweet.id_str}
                count={props.retweet.retweet_count}
                post={props.retweet}
            />
            <Reply provider="twitter" id={props.retweet.id_str} post={props.retweet} />
            <Source
                provider="twitter"
                screen_name={props.retweet.user.screen_name}
                id_str={props.retweet.id_str}
            />
        </span>

        <TimeAgo date={props.created_at} />
    </div>
);