import React from 'react';

// Components
import Text from '../Utils/Text';
import Media from '../Utils/Media';
import Action from '../Utils/Action';
import TimeAgo from '../Utils/TimeAgo';
import { Avatar } from '../Utils/Avatar';

export const InstagramPost = ({ post }) => (
    <div>
        {!post.avatarless ? <Avatar provider="instagram" {...post.user} /> : null}
        <div className="post__content">
            <Media
                provider="instagram"
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