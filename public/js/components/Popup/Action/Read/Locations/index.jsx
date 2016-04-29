import React from 'react';

import Post from 'components/Utils/Post';
import Banner from 'components/Popup/Utils/Banner';

import { selectLocationLink } from 'utils/select';

export default ({ provider, id, showingPosts, location: { query: { name, place_id } } }) => (
    <div>
        <Banner
            provider={provider}
            iconName="location"
            link={selectLocationLink[provider]({ id, place_id })}
            title={name || ''}
        />
        {showingPosts.map(item => (
            <Post className="popupPost" key={item.id_str} post={item} />
        ))}
    </div>
);
