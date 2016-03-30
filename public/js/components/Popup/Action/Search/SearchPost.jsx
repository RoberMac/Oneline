import React from 'react';
import assign from 'object.assign';

// Helpers
import { selectNextPageId } from 'utils/select';
import { Action } from 'utils/api';
const initSearchState = {
    showingPosts: [],
    isFetching: false,
    isFetchFail: false,
    isInitLoad: true,
    minId: ''
};

// Components
import Spin from 'components/Utils/Spin';
import Post from 'components/Utils/Post';

export default class SearchPost extends React.Component {
    constructor(props) {
        super(props)
        this.state = assign({}, initSearchState)
        this.fetchPosts = this.fetchPosts.bind(this)
    }
    fetchPosts() {
        const { provider, searchText } = this.props;
        const { showingPosts, isFetching, minId } = this.state;
        const nextPageId = selectNextPageId[provider]({ minId, showingPosts, action: 'search', });

        if (isFetching || !searchText) return;
        this.setState({ isFetching: true, isFetchFail: false })

        Action
        .get({
            provider,
            action: 'search',
            id: window.encodeURIComponent(`${searchText}`),
        }, minId ? { maxId: nextPageId } : undefined)
        .then(res => {
            // Update State
            const data = res.data.sort((a, b) => a.created_at < b.created_at ? 1 : -1);
            const lastPost = data[data.length - 1] && data[data.length - 1];
            const newState = {
                showingPosts: showingPosts.concat(data),
                isFetching: false,
                isInitLoad: false,
                minId: lastPost && lastPost.id_str
            };
            this.setState(newState)
        })
        .catch(err => {
            this.setState({ isFetching: false, isFetchFail: true })
        })
    }
    componentDidUpdate(prevProps, prevState) {
        const { searchText: prevText } = prevProps;
        const { searchText: currentText } = this.props;

        if (prevText !== currentText) {
            this.setState(assign({}, initSearchState), () => this.fetchPosts());
        }
    }
    componentDidMount() {
        this.fetchPosts()
    }
    render() {
        const { provider, searchText } = this.props;
        const { showingPosts, isInitLoad, isFetching, isFetchFail } = this.state;

        return (
            <div>
                {showingPosts.map(item => (
                    <Post className="popupPost" key={item.id_str} post={item} highlight={searchText} />
                ))}
                {isFetching || showingPosts.length >= 7
                    ? <Spin
                        type="oldPosts"
                        provider={provider}
                        initLoad={isInitLoad}
                        isFetching={isFetching}
                        isFetchFail={isFetchFail}
                        onClick={this.fetchPosts}
                    />
                    : null
                }
            </div>
        );
    }
}
