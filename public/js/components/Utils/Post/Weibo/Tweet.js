import React from 'react';

// Components
import { Avatar } from '../Utils/Avatar';
import Text from '../Utils/Text';
import { WeiboMedia } from '../Utils/Media';
import TimeAgo from '../Utils/TimeAgo';
import { Like, Retweet, Reply, Source, Star, Trash } from '../Utils/Action';

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
            {props.media && props.media.length > 0
                ? <WeiboMedia media={props.media} />
                : null
            }
        </div>

        <span className="cursor--pointer">
            <Retweet provider="weibo" post={props} />
            <Reply provider="weibo" post={props} />
            <Source provider="weibo" uid={props.user.uid} mid={props.mid} />
            <Star provider="weibo" id={props.id_str} stared={props.stared} />
            {props.like_count ? <Like count={props.like_count} liked={props.liked} /> : null}
            {props.user.screen_name === window.profile_weibo.screen_name
                ? <Trash provider="weibo" id={props.id_str} />
                : null
            }
        </span>

        <TimeAgo date={props.created_at} />
    </div>
);