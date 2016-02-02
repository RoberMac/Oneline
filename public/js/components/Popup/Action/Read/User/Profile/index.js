import React from 'react';
import classNames from 'classnames';

// Helpers
import { Action } from 'utils/api';
import { addClassTemporarily } from 'utils/dom';

// Components
import Icon from 'components/Utils/Icon';
import { Avatar } from 'components/Utils/Post/Utils/Avatar';
import Text from 'components/Utils/Post/Utils/Text';
class FollowBtn extends React.Component {
    constructor(props) {
        super(props)
        this.state = { inprocess: false, following: props.following }
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick() {
        const { inprocess, following } = this.state;
        const { uid, provider } = this.props;

        if (inprocess) return;
        this.setState({ inprocess: true })

        Action[following ? 'destroy' : 'create']({
            action: 'follow',
            provider: provider,
            id: uid
        })
        .then(() => {
            this.setState({ inprocess: false, following: !following })
        })
        .catch(err => {
            addClassTemporarily(this.refs.btn, 'tips--error', 500)
            this.setState({ inprocess: false })
        })
    }
    render() {
        const { inprocess, following } = this.state;
        const btnClass = classNames({
            'profile__following tips--deep': true,
            'icon--twitter tips--active': following,
            'tips--inprocess': inprocess
        });
        return (
            <button
                className={btnClass}
                type="button"
                onClick={this.handleClick}
                ref="btn"
            >
                <Icon name="following" />
            </button>
        );
    }
}

const Counts = ({ provider, counts }) => {
    const columnClass = `profile__count__column icon--${provider}`;

    return (
        counts
        ? (
            <div className="profile__count">
                <div className={columnClass} data-count={counts.statuses}>
                    <Icon name={provider === 'instagram' ? 'post' : 'tweet'} />
                </div>
                <div className={columnClass} data-count={counts.followed_by}>
                    <Icon name="followed_by" />
                </div>
                <div className={columnClass} data-count={counts.follows}>
                    <Icon name="follows" />
                </div>
            </div>
        )
        : null
    );
};
const Bio = ({ provider, bio }) => (
    bio
    ? (
        <Text
            provider={provider}
            className="profile__biography"
            text={bio}
        />
    )
    : <span />
);
const Website = ({ website }) => (
    website
    ? (
        <div className="profile__website">
            <a href={website} target="_blank">
                <Icon name="link" className="tips animate--faster" />
            </a>
        </div>
    )
    : <span />
);

// Export
export default ({ provider, user }) => (
    <div className={`profile--${provider} provider--${provider}`}>
        <Avatar provider={provider} {...user} />
        <Counts provider={provider} counts={user.counts} />
        <Bio provider={provider} bio={user.bio} />
        <Website website={user.website} />
        {provider === 'twitter'
            ? <FollowBtn provider={provider} following={user.following} uid={user.uid} />
            : null
        }
        {user.location
            ? <span className="post__location">
                <Icon className="post-action__icon" name="location" />
                <span className="post__location__name">{user.location}</span>
            </span>
            : null
        }
    </div>
);