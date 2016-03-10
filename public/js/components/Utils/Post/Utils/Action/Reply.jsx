import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import numAbbr from 'utils/numAbbr';

import Icon from 'components/Utils/Icon';

export default ({ provider, post }) => {
    const { id_str, reply_count } = post;
    const btnClass = classNames({
        'post-action__btn btn color--steel tips--deep': true,
        'tips--inactive': !id_str
    });
    return (
        <Link to={{ pathname: `/home/${provider}/reply/${id_str}`, state: post }}>
            <span className={btnClass}>
                <Icon className="post-action__icon" name="reply" />
                <span className="post-action__count" data-count={reply_count > 0 ? numAbbr(reply_count) : ''} />
            </span>
        </Link>
    );
};