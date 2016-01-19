import React from 'react';

import Icon from 'components/Utils/Icon';
import Post from 'components/Utils/Post';

// Helpers
const selectLocationHref = {
    twitter  : ({ id }) => `//twitter.com/search?q=place%3A${id}`,
    instagram: ({ id }) => `//instagram.com/explore/locations/${id}`,
    weibo: ({ id, place_id }) => (
        place_id
            ? `//weibo.com/p/100101${place_id}`
        : `//maps.google.com/maps?z=12&t=h&q=loc:${id.split('_')[0]}+${id.split('_')[1]}`
    )
};

export default class Locations extends React.Component {
    render() {
        const { provider, id, showingPosts } = this.props;
        const { name, place_id } = this.props.location.query;

        return (
            <div>
                <div className={`banner banner--${provider}`}>
                    <a
                        href={selectLocationHref[provider]({ id, place_id })}
                        target="_blank"
                    >
                        <span className={`banner__title btn icon--${provider} tips--deep`}>
                            <Icon viewBox="0 0 60 60" name="location" />
                            <span>{name || ''}</span>
                        </span>
                    </a>
                </div>
                {showingPosts.map(item=> (
                    <Post className="popupPost" key={item.id_str} item={item} />
                ))}
            </div>
        );
    }
}
