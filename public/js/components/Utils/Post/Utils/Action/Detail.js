import React from 'react';
import { Link } from 'react-router';
import assign from 'object.assign';

import Icon from 'components/Utils/Icon';

export default ({ provider, id, post }) => {
    const _id = id || post && post.id_str;
    const linkObj = { to: `/home/${provider}/detail/${_id}` };

    if (post){
        assign(linkObj, { state: post })
    }

    return (
        <Link {...linkObj}>
            <span className={`post-action__btn btn tips--deep ${_id ? '' : 'tips--inactive'}`}>
                <Icon className="post-action__icon" name="detail" />
                <span className="post-action__count" />
            </span>
        </Link>
    );
};