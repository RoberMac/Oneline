import React from 'react';
import { Link } from 'react-router';

export default ({ provider, screen_name, children }) => (
    provider === 'weibo'
        ? <a href={`//weibo.com/n/${screen_name}`} target="_blank">{children}</a>
    : <Link to={`/home/${provider}/user/${screen_name}`}>{children}</Link>
);