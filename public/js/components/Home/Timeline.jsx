import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import Post from 'components/Utils/Post';

export default class Timeline extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        __DEV__ && console.time('[shallowCompare]')
        const shouldUpdate = shallowCompare(this, nextProps, nextState);
        __DEV__ && console.timeEnd('[shallowCompare]')
        return shouldUpdate;
    }
    render() {
        const { showingPosts, highlight } = this.props;
        return (
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
    }
}