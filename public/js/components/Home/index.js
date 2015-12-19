import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { fetchPosts } from '../../actions/timeline';

// Component
import Post from '../Utils/Post';
import Spin from '../Utils/Spin';
class Home extends React.Component {
    constructor (props){
        super(props)
        this.loadPosts = this.loadPosts.bind(this)
    }
    loadPosts({ postsType, isAutoFetch }) {
        return this.props.fetchPosts({ postsType, isAutoFetch })
    }
    componentDidMount() {
        this.loadPosts({ postsType: 'newPosts' })
        .then(() => {
            // Register Auto Fetch
            this.autoFetchIntervalId = setInterval( () => {
                this.loadPosts({ postsType: 'newPosts', isAutoFetch: true })
            }, 1000 * 60 * 3)
        })
    }
    componentWillUnmount() {
        clearInterval(this.autoFetchIntervalId)
    }
    render() {
        const { newPosts, oldPosts, showingPosts, isInitLoad } = this.props;
        return (
            <div>
                <Spin
                    type="newPosts"
                    initLoad={isInitLoad}
                    loading={newPosts.isFetching}
                    loadFail={newPosts.isFetchFail}
                    unreadCount={newPosts.unreadCount}
                    onClick={this.loadPosts.bind(this, { postsType:'newPosts' })}
                />
                    {
                        showingPosts
                        .sort((a, b) => a.created_at < b.created_at ? 1 : -1)
                        .map(item => <Post key={item.id_str} item={item}/>)
                    }
                <Spin
                    type="oldPosts"
                    initLoad={isInitLoad}
                    loading={oldPosts.isFetching}
                    loadFail={oldPosts.isFetchFail}
                    unreadCount={oldPosts.unreadCount}
                    onClick={this.loadPosts.bind(this, { postsType: 'oldPosts' })}
                />
            </div>
        );
    }
}

// Export
export default connect(
    state => ({
        newPosts: state.timeline.newPosts,
        oldPosts: state.timeline.oldPosts,
        showingPosts: state.timeline.showingPosts,
        isInitLoad: state.timeline.isInitLoad
    }),
    { fetchPosts }
)(Home)