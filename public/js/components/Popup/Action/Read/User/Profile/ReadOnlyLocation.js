import React from 'react';

import Icon from 'components/Utils/Icon';

export default ({ location }) => (
    location ? (
        <span className="post__location">
            <Icon className="post-action__icon" name="location" />
            <span className="post__location__name">{location}</span>
        </span>
    ) : <span />
);
