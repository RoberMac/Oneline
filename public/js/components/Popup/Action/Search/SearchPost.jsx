/* eslint react/no-did-update-set-state: 0, no-shadow: 0 */

import React from 'react';
import { fromJS } from 'immutable';

// Helpers
import { selectNextPageId } from 'utils/select';
import { Action } from 'utils/api';
const initSearchState = fromJS({
    showingPosts: [],
    isFetching: false,
    isFetchFail: false,
    isInitLoad: true,
    minId: '',
});

// Components
import rerender from 'components/Utils/HoCs/rerender';
import Spin from 'components/Utils/Spin';
import Post from 'components/Utils/Post';

class SearchPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = { postsState: initSearchState };
        this.fetchPosts = this.fetchPosts.bind(this);
    }
    componentDidMount() {
        this.fetchPosts();
    }
    componentDidUpdate(prevProps) {
        const { searchText: prevText } = prevProps;
        const { searchText: currentText } = this.props;

        if (prevText !== currentText) {
            this.setState(() => ({ postsState: initSearchState }), () => this.fetchPosts());
        }
    }
    fetchPosts() {
        const { provider, searchText } = this.props;
        const { postsState } = this.state;
        const minId = postsState.get('minId');
        const nextPageId = selectNextPageId[provider]({
            minId,
            postsSize: postsState.get('showingPosts').size,
            action: 'search',
        });

        if (postsState.get('isFetching') || !searchText) return;
        this.setState(({ postsState }) => ({
            postsState: postsState.set('isFetching', true).set('isFetchFail', false),
        }));

        Action
        .get({
            provider,
            action: 'search',
            id: window.encodeURIComponent(`${searchText}`),
        }, minId ? { maxId: nextPageId } : undefined)
        .then(res => {
            // Update State
            const posts = res.data.sort((a, b) => a.created_at < b.created_at ? 1 : -1);
            const lastPost = posts[posts.length - 1] && posts[posts.length - 1];

            this.setState(({ postsState }) => ({
                postsState: postsState.withMutations(map => {
                    map
                    .update('showingPosts', list => list.concat(posts))
                    .set('isFetching', false)
                    .set('isInitLoad', false)
                    .set('minId', lastPost && lastPost.id_str);
                }),
            }));
        })
        .catch(() => {
            this.setState(({ postsState }) => ({
                postsState: postsState.set('isFetching', false).set('isFetchFail', true),
            }));
        });
    }
    render() {
        const { provider, searchText } = this.props;
        const { postsState } = this.state;
        const showingPosts = postsState.get('showingPosts');
        const isFetching = postsState.get('isFetching');
        const isFetchFail = postsState.get('isFetchFail');
        const isInitLoad = postsState.get('isInitLoad');

        return (
            <div>
                {showingPosts.map(item => (
                    <Post
                        className="popupPost"
                        key={item.id_str}
                        post={item}
                        highlight={searchText}
                    />
                ))}
                {(isFetching || showingPosts.size >= 7) && (
                    <Spin
                        type="oldPosts"
                        provider={provider}
                        initLoad={isInitLoad}
                        isFetching={isFetching}
                        isFetchFail={isFetchFail}
                        onClick={this.fetchPosts}
                    />
                )}
            </div>
        );
    }
}
SearchPost.displayName = 'SearchPost';

// Export
export default rerender(SearchPost);
