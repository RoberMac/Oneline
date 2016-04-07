import React from 'react';

import Text from 'components/Utils/Post/Utils/Text';

export default ({ provider, bio }) => (
    bio
        ? <Text provider={provider} className="profile__biography" text={bio} />
    : <span />
);
