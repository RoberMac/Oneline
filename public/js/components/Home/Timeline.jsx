import React from 'react';

import rerender from 'components/Utils/HoCs/ReRender';
import Post from 'components/Utils/Post';

const Timeline = ({ showingPosts, highlight }) => (
    <div>
    {
        showingPosts
        .sort((a, b) => a.created_at < b.created_at ? 1 : -1)
        .map(item => (
            <Post key={item.id_str} post={item} highlight={highlight} />
        ))
    }
    </div>
);
Timeline.displayName = 'Timeline';

export default rerender(Timeline);
