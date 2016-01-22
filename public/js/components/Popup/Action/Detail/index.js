import React from 'react';

// Helper
import { Action } from 'utils/api';

// Components
import Spin from 'components/Utils/Spin';
import Post from 'components/Utils/Post';
import DetailContainer from './DetailContainer';

// Export
export default class Detail extends React.Component {
    constructor(props) {
        const historyState = props.location.state;
        const restoreState = historyState && historyState.likedList ? historyState : null;

        super(props)
        this.state = restoreState || {
            post: historyState,
            likedList: [],
            replyList: [],
            retweetedList: [],
            isFetching: false,
            isFetchFail: false,
            isInitLoad: true
        }
    }
    loadDetail() {
        const { action, provider, id, location } = this.props;
        const { isFetching } = this.state;

        if (isFetching) return;
        this.setState({ isFetching: true, isFetchFail: false })

        Action
        .get({ action, provider, id })
        .then(res => {
            // Update State
            const post = res.post || location.state;
            const likedList = res.like || [];
            const replyList = res.reply || [];
            const retweetedList = res.retweet || [];
            const newState = {
                post,
                likedList,
                replyList,
                retweetedList,
                isFetching: false,
                isFetchFail: false,
                isInitLoad: false
            };
            this.setState(newState)
            // Store State in History State
            const { history } = this.props;
            history.replace({
                pathname: location.pathname,
                search: location.search,
                state: newState
            })
        })
        .catch(err => {
            this.setState({ isFetching: false, isFetchFail: true })
        })
    }
    componentDidMount() {
        if (this.state.isInitLoad) {
            this.loadDetail()
        }
    }
    render() {
        const { provider } = this.props;
        const { post, isInitLoad, isFetching, isFetchFail } = this.state;
        return (
            isInitLoad
                ? <Spin
                    type="oldPosts"
                    provider={provider}
                    initLoad={isInitLoad}
                    isFetching={isFetching}
                    isFetchFail={isFetchFail}
                    onClick={this.loadPosts}
                />
            : <div className="detail overflow--y animate--enter">
                <Post className="detail__post" item={post} isDetailPost={true} />
                <DetailContainer provider={provider} {...this.state} />
            </div>
        );
    }
}
