import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';

import { handleImageError, lazySize, calcDegree } from './helper.js';
//todo: ol-lazy-image users_in_photo

// Components
import Icon from '../../../Icon';
import Empty from '../../../Empty';
import ViewOriginal from './Utils/ViewOriginal';
import Video from './Utils/Video';


class UsersInPhoto extends React.Component {
    constructor(props) {
        super(props)
        this.state = { isShowing: false }
        this.toggleUsersInPhoto = this.toggleUsersInPhoto.bind(this)
    }
    toggleUsersInPhoto() {
        const { isShowing } = this.state;
        this.setState({ isShowing: !isShowing })
    }
    render() {
        const { users_in_photo, imgWidth, imgHeight } = this.props;
        const { isShowing } = this.state;

        const usersInPhotoIconClass = classNames({
            'post-media__icon post-media__icon--users icon--instagram': true,
            'tips--deep--peace animate--faster': true,
            'tips--active--peace': isShowing
        });

        let userTags;
        if (isShowing){
            userTags = users_in_photo.map(user => {
                const { x, y } = user.position;
                const degree = calcDegree(x, y, imgWidth, imgHeight);
                const userTagStyle = {
                    top: y * 100 + '%',
                    left: 'calc(' + x * 100 + '% - 16px)',
                    transform: 'rotate(' + degree + 'deg)',
                    WebkitTransform: 'rotate(' + degree + 'deg)'
                }
                const avatarStyle = {
                    transform: 'rotate(' + (- degree) + 'deg)',
                    WebkitTransform: 'rotate(' + (- degree) + 'deg)'
                }
                return (
                    <a
                        ref={user.user.username}
                        key={user.user.username}
                        className='post-media__userTag animate--faster'
                        href={`/instagram/user/${user.user.username}`}
                        style={userTagStyle}
                    >
                        <div className="post-media__userTag__pointer"></div>
                        <span className="post-media__userTag__content">
                            <img style={avatarStyle} src={user.user.profile_picture} />
                        </span>
                    </a>
                );
            })
        } else {
            userTags = <Empty />
        }

        return (
            <div>
                <button className={usersInPhotoIconClass} onClick={this.toggleUsersInPhoto}>
                    <Icon viewBox="0 0 102 118" name="users_in_photo" />
                </button>

                <ReactCSSTransitionGroup
                    transitionName="react"
                    transitionEnterTimeout={700}
                    transitionLeaveTimeout={700}
                >
                    {userTags}
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}
class Image extends React.Component {
    constructor(props) {
        super(props)
        this.state = { imgWidth: 0, imgHeight: 0 }
    }
    componentDidMount() {
        const { offsetWidth, offsetHeight } = this.refs.image;

        this.setState({ imgWidth: offsetWidth, imgHeight: offsetHeight })
    }
    render() {
        const { images, users_in_photo } = this.props;
        return (
            <div className="post-media--large" style={lazySize(images.ratio)}>
                <img src={images.standard_resolution} onError={handleImageError} ref="image" />
                <ViewOriginal link={images.standard_resolution} provider="instagram" />
                {
                    users_in_photo
                        ? <UsersInPhoto users_in_photo={users_in_photo} {...this.state}/>
                    : <Empty />
                }
            </div>
        );
    }
}

// Export
export default class Media extends React.Component {
    render() {
        const { images, videos, users_in_photo } = this.props;

        return (
            <div className="post-media">
                { videos
                        ? <Video
                            src={videos.standard_resolution}
                            poster={images.low_resolution}
                            ratio={images.ratio}
                        />
                    : <Image images={images} users_in_photo={users_in_photo}/>
                }
            </div>
        );
    }
}