import React from 'react';

import Icon from 'components/Utils/Icon';

export default ({ website }) => (
    website ? (
        <div className="profile__website">
            <a href={website} target="_blank">
                <Icon name="link" className="tips animate--faster" />
            </a>
        </div>
    ) : <span />
);
