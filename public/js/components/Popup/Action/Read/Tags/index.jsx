import React from 'react';

import Post from 'components/Utils/Post';
import Banner from 'components/Popup/Utils/Banner';

import { selectTagLink } from 'utils/select';

export default ({ provider, id, showingPosts }) => (
    <div>
        <Banner
            provider={provider}
            iconName="tags"
            link={selectTagLink[provider]({ tagName: id })}
            title={id}
        />
        {showingPosts.map(item => <Post className="popupPost" key={item.id_str} post={item} />)}
    </div>
);
