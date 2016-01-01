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
                    <Post className="userPost" key={item.r_id_str || item.id_str} item={item} />
                ))}
            </div>
        );
    }
}
