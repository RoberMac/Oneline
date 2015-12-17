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
    loadPosts(postsType) {
        this.props.fetchPosts({ postsType })
    }
    componentDidMount() {
        this.loadPosts('newPosts')
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
                    onClick={this.loadPosts.bind(this, 'newPosts')}
                />
                    {
                        showingPosts.posts
                        .sort((a, b) => a.created_at < b.created_at ? 1 : -1)
                        .map(item => <Post key={item.id_str} item={item}/>)
                    }
                <Spin
                    type="oldPosts"
                    initLoad={isInitLoad}
                    loading={oldPosts.isFetching}
                    loadFail={oldPosts.isFetchFail}
                    onClick={this.loadPosts.bind(this, 'oldPosts')}
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