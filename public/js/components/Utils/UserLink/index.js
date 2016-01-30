import React from 'react';
import { Link } from 'react-router';

import { selectUserLink } from 'utils/select';
const SHARE_PAGE = window.__share_data__;

export default ({ provider, screen_name, children, className }) => (
    provider === 'weibo' || SHARE_PAGE
        ? <a href={selectUserLink[provider](screen_name)} target="_blank" className={className}>{children}</a>
    : <Link to={`/home/${provider}/user/${screen_name}`} className={className}>{children}</Link>
);