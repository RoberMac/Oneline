import React from 'react';
import { Link } from 'react-router';

import Icon from 'components/Utils/Icon';

export default ({ provider, post }) => {
    const { id_str } = post;
    return (
        <Link to={`/home/${provider}/share/${id_str}`} state={post}>
            <span className={`post-action__btn btn tips--deep ${id_str ? '' : 'tips--inactive'}`}>
                <Icon className="post-action__icon" name="share" />
                <span className="post-action__count" />
            </span>
        </Link>
    );
};