import React from 'react';
import { Link } from 'react-router';

import Icon from 'components/Utils/Icon';

export default () => (
    <Link to="/settings/replicant">
        <span className="sidebar__button btn animate--faster">
            <Icon name="sidebar_replicant" />
        </span>
    </Link>
);