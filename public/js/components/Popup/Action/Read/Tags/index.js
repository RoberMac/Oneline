import React from 'react';

import Icon from 'components/Utils/Icon';
import Post from 'components/Utils/Post';
import Banner from 'components/Popup/Utils/Banner';

// Helpers
import { selectTagLink } from 'utils/select';

export default class Tags extends React.Component {
    render() {
        const { provider, id, showingPosts } = this.props;
        return (
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
    }
}
