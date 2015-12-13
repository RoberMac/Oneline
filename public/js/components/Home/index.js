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
        // TODO
    }
    componentWillMount() {
        // TODO: options: auth ?
    }
    componentDidMount() {
        console.log('componentDidMount')
        this.props.fetchPosts({
            postsType: 'newPosts'
        })
    }
    render() {
        const { newPosts, oldPosts, showingPosts, isInitLoad } = this.props;
        console.log(showingPosts)
        return (
            <div>
                <Spin
                    type="newPosts"
                    initLoad={isInitLoad}
                    loading={newPosts.isFetching}
                    loadFail={newPosts.isFetchFail}
                />
                    {showingPosts.map(item => {
                        return <Post key={item.id_str} item={item}/>;
                    })}
                <Spin
                    type="oldPosts"
                    initLoad={isInitLoad}
                    loading={oldPosts.isFetching}
                    loadFail={oldPosts.isFetchFail}
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