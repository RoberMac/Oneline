import React from 'react';

// Components
import { Avatar, RetweetAvatar} from '../Utils/Avatar';
import Text from '../Utils/Text';
import { TwitterMedia } from '../Utils/Media';
import TimeAgo from '../Utils/TimeAgo';
import { Like, Retweet, Reply, Source, Trash } from '../Utils/Action';

export default props => (
    <div>
        {!props.isAvatarLess ? <Avatar provider="twitter" {...props.retweet.user} /> : null}
        <div className="post__content">
            <Text
                text={props.retweet.text}
                middlewares={[
                    { middleware: 'trimMediaLink', opts: { link: props.retweet.mediaLink } },
                    { middleware: 'linkify', opts: { provider: 'twitter' } }
                ]}
            />
            {props.retweet.media && props.retweet.media.length > 0
                ? <TwitterMedia media={props.retweet.media} />
                : null
            }
        </div>

        <RetweetAvatar provider="twitter" {...props.user} />

        <span className="cursor--pointer">
            <Like
                provider="twitter"
                id={props.retweet.id_str}
                count={props.retweet.like_count}
                liked={props.retweet.liked}
            />
            <Retweet provider="twitter" post={props.retweet} />
            <Reply provider="twitter" post={props.retweet} />
            <Source
                provider="twitter"
                screen_name={props.retweet.user.screen_name}
                id={props.retweet.id_str}
            />
        </span>

        <TimeAgo date={props.created_at} />
    </div>
);