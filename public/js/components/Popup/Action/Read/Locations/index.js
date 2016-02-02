import React from 'react';

import Icon from 'components/Utils/Icon';
import Post from 'components/Utils/Post';

// Helpers
import { selectLocationLink } from 'utils/select';

export default class Locations extends React.Component {
    render() {
        const { provider, id, showingPosts } = this.props;
        const { name, place_id } = this.props.location.query;

        return (
            <div>
                <div className={`banner banner--${provider}`}>
                    <a
                        href={selectLocationLink[provider]({ id, place_id })}
                        target="_blank"
                    >
                        <span className={`banner__title btn icon--${provider} tips--deep`}>
                            <Icon name="location" />
                            <span>{name || ''}</span>
                        </span>
                    </a>
                </div>
                {showingPosts.map(item=> (
                    <Post className="popupPost" key={item.id_str} post={item} />
                ))}
            </div>
        );
    }
}
