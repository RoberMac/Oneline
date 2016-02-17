import React from 'react';
import { Link } from 'react-router';

// Helpers
import { selectUserLink } from 'utils/select';
import reduxStore from 'store';
const { base: { SHARE_PAGE } } = reduxStore.getState();

export default ({ provider, screen_name, children, className }) => (
    provider === 'weibo' || SHARE_PAGE
        ? <a href={selectUserLink[provider](screen_name)} target="_blank" className={className}>{children}</a>
    : <Link to={`/home/${provider}/user/${screen_name}`} className={className}>{children}</Link>
);