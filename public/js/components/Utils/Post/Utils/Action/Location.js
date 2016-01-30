import React from 'react';
import { Link } from 'react-router';

// Helper
import { selectLocationLink } from 'utils/select';
const SHARE_PAGE = window.__share_data__;
const selectLink = (
    SHARE_PAGE
    ? selectLocationLink
    : {
        twitter: ({ id, name }) => `/home/twitter/locations/${id}?name=${name}`,
        instagram: ({ id, name }) => `/home/instagram/locations/${id}?name=${name}`,
        weibo: ({ id, name, place_id  }) => (
            name
                ? `/home/weibo/locations/${id}?name=${name}&place_id=${place_id}`
            : `/home/weibo/locations/${id}`
        )
    }
);

// Components
import Icon from 'components/Utils/Icon';
const LocationLink = ({ link, children }) => {
    return (
        SHARE_PAGE
            ? <a href={link} target="_blank">{children}</a>
        : <Link to={link}>{children}</Link>
    );
};

export default (props) => (
    <LocationLink link={selectLink[props.provider]({...props})}>
        <span className="post__location btn tips--deep">
            <Icon className="post-action__icon" viewBox="0 0 26 26" name="location" />
            <span className="post__location__name">{props.name}</span>
        </span>
    </LocationLink>
);