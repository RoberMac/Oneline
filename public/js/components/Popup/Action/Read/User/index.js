import React from 'react';

import Post from '../../../../Utils/Post';
import Profile from './Profile';

export default class User extends React.Component {
    render() {
        const { provider, showingPosts, user } = this.props;
        return (
            <div>
                <Profile provider={provider} user={user} />
                {showingPosts.map(item=> (
                    <Post
                        className={`userPost ${item.type === 'retweet' ? 'userPost--gutter' : ''}`}
                        key={item.id_str}
                        item={item}
                        isAvatarLess={item.type !== 'retweet'}
                    />
                ))}
            </div>
        );
    }
}
