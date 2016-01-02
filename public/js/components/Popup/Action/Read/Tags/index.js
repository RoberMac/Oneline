import React from 'react';

import Icon from '../../../../Utils/Icon';
import Post from '../../../../Utils/Post';

// Helpers
const selectTagHref = {
    twitter  : ({ tagName }) => `//twitter.com/search?q=%23${tagName}`,
    instagram: ({ tagName }) => `//instagram.com/explore/tags/${tagName}`
};

export default class Tags extends React.Component {
    render() {
        const { provider, id, showingPosts } = this.props;
        return (
            <div>
                <div className={`banner banner--${provider}`}>
                    <a href={selectTagHref[provider]({ tagName: id })} target="_blank">
                        <span className={`banner__title btn icon--${provider} tips--deep`}>
                            <Icon viewBox="0 0 60 60" name="tags" />
                            <span>{id}</span>
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
