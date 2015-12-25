import React from 'react';
import { Link } from 'react-router';

import Icon from '../../../Icon';

export default ({ provider, id }) => (
    <Link to={`/home/${provider}/reply/${id}`}>
        <span className="post-action btn tips--deep">
            <Icon className="post-action__button" viewBox="0 0 26 26" name="reply" />
            <span className="post-action__count" />
        </span>
    </Link>
);