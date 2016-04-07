import React from 'react';
import { Link } from 'react-router';
import assign from 'object.assign';

import Icon from 'components/Utils/Icon';

export default ({ provider, id, post }) => {
    const _id = id || post && post.id_str;
    const to = { pathname: `/home/${provider}/detail/${_id}` };

    post && assign(to, { state: post });

    return (
        <Link to={to} className={_id ? '' : 'tips--inactive'}>
            <span className="post-action__btn btn color--steel tips--deep">
                <Icon className="post-action__icon" name="detail" />
                <span className="post-action__count" />
            </span>
        </Link>
    );
};
