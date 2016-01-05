import React from 'react';
import { Link } from 'react-router';

import Icon from '../../../Icon';

export default ({ provider, post }) => {
    const { id_str } = post;
    return (
        <Link to={`/home/${provider}/detail/${id_str}`} state={post}>
            <span
                className="post-action btn tips--deep"
                style={ id_str ? null : { 'pointerEvents': 'none', 'opacity': '.1' } }
            >
                <Icon className="post-action__button" viewBox="0 0 26 26" name="detail" />
                <span className="post-action__count" />
            </span>
        </Link>
    );
};