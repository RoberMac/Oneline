import React from 'react';
import { Link } from 'react-router';

import Icon from '../../../Icon';

export default ({ provider, id, count }) => (
    <Link to={`/home/${provider}/retweet/${id}`}>
        <span className="post-action btn tips--deep">
            <Icon className="post-action__button" viewBox="0 0 34 26" name="retweet" />
            <span
                className="post-action__count"
                data-count={count > 0 ? count : ''}
            />
        </span>
    </Link>
);