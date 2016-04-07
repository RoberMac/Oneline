import React from 'react';
import { Link } from 'react-router';

// Helpers
import { selectUserLink } from 'utils/select';
import { isWeibo } from 'utils/detect';
import reduxStore from 'state/store';
const SHARE_PAGE = reduxStore.getState().base.get('SHARE_PAGE');

export default ({ provider, screen_name, children, className }) => (
    isWeibo(provider) || SHARE_PAGE
        ? <a href={selectUserLink[provider](screen_name)} target="_blank" className={className}>
            {children}
        </a>
    : <Link to={`/home/${provider}/user/${screen_name}`} className={className}>{children}</Link>
);
