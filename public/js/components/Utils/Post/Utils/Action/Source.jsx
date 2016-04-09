import React from 'react';

// Helper
import { selectSourceLink } from 'utils/select';
const isActive = ({ id, link, mid }) => {
    return id || link || mid;
};

import Icon from 'components/Utils/Icon';

export default (props) => (
    <a
        href={selectSourceLink[props.provider]({ ...props })}
        target="_blank"
        role="button"
        className={!isActive({ ...props }) ? 'tips--inactive' : ''}
    >
        <span className="post-action__btn btn color--steel tips--deep">
            <Icon className="post-action__icon" name="source" />
            <span className="post-action__count" />
        </span>
    </a>
);
