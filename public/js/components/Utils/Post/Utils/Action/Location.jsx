import React from 'react';
import { Link } from 'react-router';

// Helper
import { selectLocationLink } from 'utils/select';
import reduxStore from 'state/store';
const SHARE_PAGE = reduxStore.getState().base.get('SHARE_PAGE');
const selectLink = (
    SHARE_PAGE
    ? selectLocationLink
    : {
        twitter: ({ id, name }) => `/home/twitter/locations/${id}?name=${name}`,
        instagram: ({ id, name }) => `/home/instagram/locations/${id}?name=${name}`,
        weibo: ({ id, name, place_id }) => (
            name
                ? `/home/weibo/locations/${id}?name=${name}&place_id=${place_id}`
            : `/home/weibo/locations/${id}`
        ),
        unsplash: ({ name }) => `//maps.google.com/maps?z=12&t=h&q=${name}`,
    }
);

// Components
import Icon from 'components/Utils/Icon';
const LocationLink = ({ link, children }) => {
    return (
        /^\/home/.test(link)
            ? <Link to={link}>{children}</Link>
        : <a href={link} target="_blank">{children}</a>
    );
};

export default (props) => (
    <LocationLink link={selectLink[props.provider]({ ...props })}>
        <span className="post__location btn color--steel tips--deep">
            <Icon className="post-action__icon" name="location" />
            <span className="post__location__name">{props.name}</span>
        </span>
    </LocationLink>
);
