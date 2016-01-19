import React from 'react';
import { Link } from 'react-router';

import numAbbr from 'utils/numAbbr';

import Icon from 'components/Utils/Icon';

export default ({ provider, post }) => {
    const { id_str, reply_count } = post;
    return (
        <Link to={`/home/${provider}/reply/${id_str}`} state={post}>
            <span
                className="post-action btn tips--deep"
                style={ id_str ? null : { 'pointerEvents': 'none', 'opacity': '.1' } }
            >
                <Icon className="post-action__icon" viewBox="0 0 26 26" name="reply" />
                <span className="post-action__count" data-count={reply_count > 0 ? numAbbr(reply_count) : ''} />
            </span>
        </Link>
    );
};