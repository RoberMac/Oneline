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
    minId: ''
});

// Components
import ReRender from 'components/Utils/HoCs/ReRender';
import Spin from 'components/Utils/Spin';
import Post from 'components/Utils/Post';

class SearchPost extends React.Component {
    constructor(props) {
        super(props)
        this.state = { data: initSearchState };
        this.fetchPosts = this.fetchPosts.bind(this)
    }
    fetchPosts() {
        const { provider, searchText } = this.props;
        const { data } = this.state;
        const minId = data.get('minId');
        const nextPageId = selectNextPageId[provider]({
            minId,
            postsSize: data.get('showingPosts').size,
            action: 'search'
        });

        if (data.get('isFetching') || !searchText) return;
        this.setState(({ data }) => ({
            data: data.set('isFetching', true).set('isFetchFail', false)
        }))

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

            this.setState(({ data }) => ({
                data: data.withMutations(map => {
                    map
                    .update('showingPosts', list => list.concat(posts))
                    .set('isFetching', false)
                    .set('isInitLoad', false)
                    .set('minId', lastPost && lastPost.id_str)
                })
            }))
        })
        .catch(err => {
            this.setState(({ data }) => ({
                data: data.set('isFetching', false).set('isFetchFail', true)
            }))
        })
    }
    componentDidUpdate(prevProps, prevState) {
        const { searchText: prevText } = prevProps;
        const { searchText: currentText } = this.props;

        if (prevText !== currentText) {
            this.setState(() => ({ data: initSearchState }), () => this.fetchPosts())
        }
    }
    componentDidMount() {
        this.fetchPosts()
    }
    render() {
        const { provider, searchText } = this.props;
        const { data } = this.state;
        const showingPosts = data.get('showingPosts');
        const isFetching = data.get('isFetching');
        const isFetchFail = data.get('isFetchFail');
        const isInitLoad = data.get('isInitLoad');

        return (
            <div>
                {showingPosts.map(item => (
                    <Post className="popupPost" key={item.id_str} post={item} highlight={searchText} />
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
export default ReRender(SearchPost);