import React from 'react';
import { Link } from 'react-router';
import assign from 'object.assign';

import Icon from '../../../Icon';

export default ({ provider, id, post }) => {
    const _id = id || post.id_str;
    const linkObj = { to: `/home/${provider}/detail/${_id}` };

    if (post){
        assign(linkObj, { state: post })
    }

    return (
        <Link {...linkObj}>
            <span
                className="post-action btn tips--deep"
                style={ _id ? null : { 'pointerEvents': 'none', 'opacity': '.1' } }
            >
                <Icon className="post-action__button" viewBox="0 0 26 26" name="detail" />
                <span className="post-action__count" />
            </span>
        </Link>
    );
};