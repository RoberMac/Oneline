import React from 'react';

// Components
import { Avatar } from '../Utils/Avatar';
import Text from '../Utils/Text';
import { InstagramMedia } from '../Utils/Media';
import TimeAgo from '../Utils/TimeAgo';
import { Like, Reply, Source } from '../Utils/Action';

export default props => (
    <div className="post post--instagram">
        <Avatar provider="instagram" {...props.user} />
        <div className="post__content">
            <InstagramMedia
                images={props.images}
                videos={props.videos}
                users_in_photo={props.users_in_photo}
            />
            <Text
                text={props.text}
                middlewares={[
                    { middleware: 'linkify', opts: { provider: 'instagram' } }
                ]}
            />
        </div>

        <span className="cursor--pointer">
            <Like count={props.favorite_count} />
            <Reply />
            <Source provider="instagram" link={props.link} />
        </span>

        <TimeAgo date={props.created_at} />
    </div>
);