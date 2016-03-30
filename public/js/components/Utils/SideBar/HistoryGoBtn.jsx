import React from 'react';
import { browserHistory as history } from 'react-router';

import Icon from 'components/Utils/Icon';

export default ({ step, className }) => (
    <button
        onClick={() => history.go(step)}
        className={`sidebar__button btn animate--faster ${className}`}
        type="button"
    >
        <Icon name="sidebar_go" />
    </button>
);