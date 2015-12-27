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

        <span className="cursor--pointer">
            <Like count={props.favorite_count}/>
            <Retweet provider="twitter" id={props.id_str} count={props.retweet_count} post={props} />
            <Reply provider="twitter" id={props.id_str} post={props} />
            <Source provider="twitter" screen_name={props.user.screen_name} id_str={props.id_str} />
        </span>

        <TimeAgo date={props.created_at} />
    </div>
);