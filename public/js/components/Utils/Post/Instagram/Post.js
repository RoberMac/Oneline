import React from 'react';

// Components
import Text from '../Utils/Text';
import TimeAgo from '../Utils/TimeAgo';
import { Avatar } from '../Utils/Avatar';
import { InstagramMedia } from '../Utils/Media';
import { InstagramAction } from '../Utils/Action';

export default ({ post, opts }) => (
    <div>
        {!opts.isAvatarLess ? <Avatar provider="instagram" {...post.user} /> : null}
        <div className="post__content">
            <InstagramMedia
                images={post.images}
                videos={post.videos}
                users_in_photo={post.users_in_photo}
            />
            <Text provider="instagram" text={post.text} />
        </div>

        <InstagramAction post={post} opts={opts} />
        <TimeAgo date={post.created_at} />
    </div>
);