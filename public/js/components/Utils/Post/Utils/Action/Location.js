import React from 'react';
import { Link } from 'react-router';

// Helper
const selectLink = {
    twitter: ({ id, name }) => `/home/twitter/locations/${id}?name=${name}`,
    instagram: ({ id, name }) => `/home/instagram/locations/${id}?name=${name}`,
    weibo: ({ id, name, place_id  }) => (
        name
            ? `/home/weibo/locations/${id}?name=${name}&place_id=${place_id}`
        : `/home/weibo/locations/${id}`
    )
};

import Icon from '../../../Icon';
export default (props) => (
    <Link to={selectLink[props.provider]({...props})}>
        <span className="post__location btn tips--deep">
            <Icon className="post-action__icon" viewBox="0 0 26 26" name="location" />
            <span className="post__location__name">{props.name}</span>
        </span>
    </Link>
);