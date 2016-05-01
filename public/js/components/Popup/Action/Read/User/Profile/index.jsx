import React from 'react';

// Components
import { Avatar } from 'components/Utils/Post/Utils/Avatar';
import Counts from './Counts';
import Bio from './Bio';
import Website from './Website';
import FollowUser from './FollowUser';
import ReadOnlyLocation from './ReadOnlyLocation';

// Export
export default ({ provider, user }) => (
    <section className={`profile--${provider} provider--${provider}`}>
        <Avatar provider={provider} {...user} />
        <Counts provider={provider} counts={user.counts} />
        <Bio provider={provider} bio={user.bio} />
        <Website website={user.website} />
        <FollowUser provider={provider} following={user.following} uid={user.uid} />
        <ReadOnlyLocation location={user.location} />
    </section>
);
