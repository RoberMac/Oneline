import React from 'react';

// Helper
import { Action } from '../../../../utils/api';

// Components
import Spin from '../../../Utils/Spin';
import Post from '../../../Utils/Post';
import DetailColumn from './DetailColumn';
import DetailRow from './DetailRow';

// Export
export default class Detail extends React.Component {
    constructor(props) {
        const historyState = props.location.state;

        super(props)
        this.state = historyState.likedList && props.location.state || {
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
            const likedList = res.body.like;
            const replyList = res.body.reply;
            const retweetedList = res.body.retweet;
            const newState = {
                post: location.state,
                likedList: likedList || [],
                replyList: replyList || [],
                retweetedList: retweetedList || [],
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
            __DEV__ && console.error(err)
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
        const {
            post, likedList, replyList, retweetedList, isInitLoad, isFetching, isFetchFail
        } = this.state;

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
                <Post className="detail__post"item={post} isDetailPost={true} />
                <div className={`detail__wrapper provider--${provider}`}>
                    {provider === 'instagram'
                        ? <DetailRow
                            type="like"
                            provider={provider}
                            list={likedList}
                            count={post.like_count}
                        />
                        : null
                    }
                    {provider !== 'twitter'
                        ? <DetailColumn provider={provider} list={replyList} count={post.reply_count} />
                        : null
                    }
                    {provider === 'twitter'
                        ? <DetailRow
                            type="retweet"
                            provider={provider}
                            list={retweetedList}
                            count={post.retweet_count}
                        /> 
                        : null
                    }
                </div>
            </div>
        );
    }
}
