import React from 'react';

import Icon from 'components/Utils/Icon';
import Post from 'components/Utils/Post';

// Helpers
import { selectTagLink } from 'utils/select';

export default class Tags extends React.Component {
    render() {
        const { provider, id, showingPosts } = this.props;
        return (
            <div>
                <div className={`banner banner--${provider}`}>
                    <a href={selectTagLink[provider]({ tagName: id })} target="_blank">
                        <span className={`banner__title btn icon--${provider} tips--deep`}>
                            <Icon name="tags" />
                            <span>{id}</span>
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
