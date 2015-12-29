import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import Icon from '../../../Icon';

export default ({ provider, id, count, retweeted, post }) => {
    const btnClass = classNames({
        'post-action btn tips--deep': true,
        'icon--retweet': retweeted
    });
    return (
        <Link
            to={`/home/${provider}/retweet/${id}`}
            state={post}
            style={ id || !retweeted ? null : { 'pointerEvents': 'none', 'opacity': '.1' } }
        >
            <span className={btnClass}>
                <Icon className="post-action__button" viewBox="0 0 34 26" name="retweet" />
                <span className="post-action__count" data-count={count > 0 ? count : ''} />
            </span>
        </Link>
    );
};