import React from 'react';
import { Link } from 'react-router';

// Helpers
import metaData from 'utils/metaData';
import { selectUserLink } from 'utils/select';
const SHARE_PAGE = metaData.get('sharePage');

export default ({ provider, screen_name, children, className }) => (
    provider === 'weibo' || SHARE_PAGE
        ? <a href={selectUserLink[provider](screen_name)} target="_blank" className={className}>{children}</a>
    : <Link to={`/home/${provider}/user/${screen_name}`} className={className}>{children}</Link>
);