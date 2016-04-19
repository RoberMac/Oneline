/* eslint jsx-a11y/img-uses-alt: 0 */

import React from 'react';
import classNames from 'classnames';

// Helpers
import { calcDegree } from '../helper.js';

// Components
import Icon from 'components/Utils/Icon';
import UserLink from 'components/Utils/UserLink';
import Transition from 'components/Utils/Transition';

// Export
export default class UsersInPhoto extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isShowing: false };
        this.toggleUsersInPhoto = this.toggleUsersInPhoto.bind(this);
    }
    toggleUsersInPhoto() {
        const { isShowing } = this.state;
        this.setState({ isShowing: !isShowing });
    }
    render() {
        const { users_in_photo, imgWidth, imgHeight } = this.props;
        const { isShowing } = this.state;

        const usersInPhotoIconClass = classNames({
            'post-media__icon post-media__icon--users color--instagram': true,
            'tips--deep--peace animate--faster': true,
            'tips--active--peace': isShowing,
        });

        let userTags;
        if (isShowing) {
            userTags = users_in_photo.map(user => {
                const { x, y } = user.position;
                const degree = calcDegree(x, y, imgWidth, imgHeight);
                const userTagStyle = {
                    top: `calc(${y * 100}% + 5px)`,
                    left: `calc(${x * 100}% - 17px)`,
                    transform: `rotate(${degree}deg)`,
                    WebkitTransform: `rotate(${degree}deg)`,
                };
                const avatarStyle = {
                    transform: `rotate(${(- degree)}deg)`,
                    WebkitTransform: `rotate(${(- degree)}deg)`,
                };
                return (
                    <span
                        key={user.user.username}
                        className="post-media__userTag"
                        style={userTagStyle}
                    >
                        <UserLink provider="instagram" screen_name={user.user.username}>
                            <img
                                style={avatarStyle}
                                className="post-media__userTag__content"
                                src={user.user.profile_picture}
                            />
                        </UserLink>
                    </span>
                );
            });
        } else {
            userTags = null;
        }

        return (
            <div>
                <button className={usersInPhotoIconClass} onClick={this.toggleUsersInPhoto}>
                    <Icon name="users_in_photo" />
                </button>

                <Transition>
                    {userTags}
                </Transition>
            </div>
        );
    }
}
