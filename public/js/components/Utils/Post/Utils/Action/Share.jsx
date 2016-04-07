import React from 'react';
import { Link } from 'react-router';

import Icon from 'components/Utils/Icon';

export default ({ provider, post }) => {
    const { id_str } = post;
    return (
        <Link
            to={{ pathname: `/home/${provider}/share/${id_str}`, state: post }}
            className={id_str ? '' : 'tips--inactive'}
        >
            <span className="post-action__btn btn color--steel tips--deep">
                <Icon className="post-action__icon" name="share" />
                <span className="post-action__count" />
            </span>
        </Link>
    );
};
