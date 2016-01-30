import React from 'react';

// Components
import Text from '../Utils/Text';
import TimeAgo from '../Utils/TimeAgo';
import Action from '../Utils/Action';
import { Avatar } from '../Utils/Avatar';
import { InstagramMedia } from '../Utils/Media';

export default ({ post }) => (
    <div>
        {!post.avatarless ? <Avatar provider="instagram" {...post.user} /> : null}
        <div className="post__content">
            <InstagramMedia
                images={post.images}
                videos={post.videos}
                users_in_photo={post.users_in_photo}
            />
            <Text provider="instagram" text={post.text} />
        </div>

        <Action post={post} />
        <TimeAgo date={post.created_at} />
    </div>
);