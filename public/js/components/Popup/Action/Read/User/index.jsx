import React from 'react';
import assign from 'object.assign';

import Post from 'components/Utils/Post';
import Profile from './Profile';

export default ({ provider, showingPosts, user }) => (
    <div>
        <Profile provider={provider} user={user} />
        {showingPosts.map(item=> {
            const isRetweet = item.type === 'retweet';
            const post = isRetweet ? item : assign(item, { avatarless: true });
            return (
                <Post
                    className={`userPost ${isRetweet ? 'userPost--gutter' : ''}`}
                    key={item.id_str}
                    post={post}
                />
            );
        })}
    </div>
);
