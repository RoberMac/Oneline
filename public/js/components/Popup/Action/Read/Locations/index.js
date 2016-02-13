import React from 'react';

import Icon from 'components/Utils/Icon';
import Post from 'components/Utils/Post';
import Banner from 'components/Popup/Utils/Banner';

// Helpers
import { selectLocationLink } from 'utils/select';

export default class Locations extends React.Component {
    render() {
        const { provider, id, showingPosts } = this.props;
        const { name, place_id } = this.props.location.query;
        return (
            <div>
                <Banner
                    provider={provider}
                    iconName="location"
                    link={selectLocationLink[provider]({ id, place_id })}
                    title={name || ''}
                />
                {showingPosts.map(item => <Post className="popupPost" key={item.id_str} post={item} />)}
            </div>
        );
    }
}
