import React from 'react';

// Components
import Text from '../Utils/Text';
import TimeAgo from '../Utils/TimeAgo';
import { Avatar } from '../Utils/Avatar';
import { InstagramMedia } from '../Utils/Media';
import { InstagramAction } from '../Utils/Action';

export default ({ post, opts }) => (
    <div>
        {!props.isAvatarLess ? <Avatar provider="instagram" {...props.user} /> : null}
        <div className="post__content">
            <InstagramMedia
                images={props.images}
                videos={props.videos}
                users_in_photo={props.users_in_photo}
            />
            <Text provider="instagram" text={post.text} />
        </div>

        <InstagramAction post={post} opts={opts} />
        <TimeAgo date={props.created_at} />
    </div>
);