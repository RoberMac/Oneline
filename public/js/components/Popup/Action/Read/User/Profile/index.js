import React from 'react';

// Components
import Icon from '../../../../../Utils/Icon';
import { Avatar } from '../../../../../Utils/Post/Utils/Avatar';
import Text from '../../../../../Utils/Post/Utils/Text';
const Counts = ({ provider, counts }) => {
    const columnClass = `profile__count__column icon--${provider}`;

    return (
        counts
        ? (
            <div className="profile__count">
                <div className={columnClass} data-count={counts.statuses}>
                    <Icon viewBox="0 0 60 60" name={provider === 'instagram' ? 'post' : 'tweet'} />
                </div>
                <div className={columnClass} data-count={counts.followed_by}>
                    <Icon viewBox="0 0 60 60" name="followed_by" />
                </div>
                <div className={columnClass} data-count={counts.follows}>
                    <Icon viewBox="0 0 60 60" name="follows" />
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
            className="profile__biography"
            text={bio} 
            middlewares={[
                { middleware: 'linkify', opts: { provider } }
            ]}
        />
    )
    : <span />
);
const Website = ({ website }) => (
    website
    ? (
        <div className="profile__website">
            <a href={website} target="_blank">
                <Icon viewBox="0 0 100 100" name="link" className="tips animate--faster" />
            </a>
        </div>
    )
    : <span />
);

// Export
export default class Profile extends React.Component {
    render() {
        const { provider, user } = this.props;
        return (
            <div className={`profile--${provider} provider--${provider}`}>
                <Avatar provider={provider} {...user} />
                <Counts provider={provider} counts={user.counts} />
                <Bio provider={provider} bio={user.bio} />
                <Website website={user.website} />
            </div>
        );
    }
}