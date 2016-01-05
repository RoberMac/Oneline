import React from 'react';

// Helper
import { Action } from '../../../../utils/api';

// Components
import Spin from '../../../Utils/Spin';
import Post from '../../../Utils/Post';
import LikedList from './LikedList';
import ReplyList from './ReplyList';
import RetweetedList from './RetweetedList';

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
                <Post item={post} isDetailPost={true} />
                <div className="detail__wrapper">
                    {provider === 'instagram'
                        ? <LikedList provider={provider} likedList={likedList} />
                        : null
                    }
                    {provider !== 'twitter'
                        ? <ReplyList provider={provider} replyList={replyList} />
                        : null
                    }
                    {provider === 'twitter'
                        ? <RetweetedList provider={provider} retweetedList={retweetedList} /> 
                        : null
                    }
                </div>
            </div>
        );
    }
}
