import React from 'react';

// Helper
import { selectSourceLink } from 'utils/select';
const isActive = ({ id, link, mid }) => {
    return id || link || mid;
};

import Icon from 'components/Utils/Icon';

export default (props) => (
    <a href={selectSourceLink[props.provider]({...props})} target="_blank" role="button">
        <span className={`post-action__btn btn tips--deep ${isActive({...props}) ? '' : 'tips--inactive'}`}>
            <Icon className="post-action__icon" viewBox="0 0 26 26" name="source" />
            <span className="post-action__count" />
        </span>
    </a>
)