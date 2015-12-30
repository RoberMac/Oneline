import React from 'react';
import { Link } from 'react-router';

import Icon from '../../../Icon';

export default ({ post }) => {
    const { provider, id_str, reply_count } = post;
    return (
        <Link to={`/home/${provider}/reply/${id_str}`} state={post}>
            <span
                className="post-action btn tips--deep"
                style={ id_str ? null : { 'pointerEvents': 'none', 'opacity': '.1' } }
            >
                <Icon className="post-action__button" viewBox="0 0 26 26" name="reply" />
                <span className="post-action__count" data-count={reply_count > 0 ? reply_count : ''} />
            </span>
        </Link>
    );
};