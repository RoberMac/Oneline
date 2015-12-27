import React from 'react';
import { connect } from 'react-redux';

import { resetState, fetchPosts } from '../../actions/timeline';
import DependencyLoader from './loader';

// Component
import Post from '../Utils/Post';
import Spin from '../Utils/Spin';
import Transition from '../Utils/Transition';
class Home extends React.Component {
    constructor (props){
        super(props)
        this.state = { isDependenciesLoaded: false }
        this.loadPosts = this.loadPosts.bind(this)
    }
    loadPosts({ postsType, isAutoFetch }) {
        return this.props.fetchPosts({ postsType, isAutoFetch })
    }
    componentWillMount() {
        const { activeProviders, isInitLoad, resetState } = this.props;

        DependencyLoader(activeProviders)
        .then(() => this.setState({ isDependenciesLoaded: true }))

        // Reset `timePointer`
        resetState();

        isInitLoad && this.loadPosts({ postsType: 'newPosts' })
        .then(() => {
            // Register Auto Fetch
            this.autoFetchIntervalId = setInterval( () => {
                this.loadPosts({ postsType: 'newPosts', isAutoFetch: true })
            }, 1000 * 60 * 3)
        })
        .catch(err => {
            console.error(err)
        })
    }
    componentWillUnmount() {
        // Reset `isInitLoad`
        this.props.resetState();
        // Unregister Auto Fetch
        clearInterval(this.autoFetchIntervalId)
    }
    render() {
        const { newPosts, oldPosts, showingPosts, isInitLoad, children } = this.props;
        const { isDependenciesLoaded } = this.state;
        return (
            <div>
                <div className="oneline__wrapper overflow--y">
                    <Spin
                        type="newPosts"
                        initLoad={isInitLoad && isDependenciesLoaded}
                        {...newPosts}
                        onClick={this.loadPosts.bind(this, { postsType: 'newPosts' })}
                    />
                    {
                        isDependenciesLoaded && showingPosts
                        .sort((a, b) => a.created_at < b.created_at ? 1 : -1)
                        .map(item => <Post key={item.r_id_str || item.id_str} item={item}/>)
                    }
                    <Spin
                        type="oldPosts"
                        initLoad={isInitLoad && isDependenciesLoaded}
                        {...oldPosts}
                        onClick={this.loadPosts.bind(this, { postsType: 'oldPosts' })}
                    />
                </div>
                <Transition>
                    {children}
                </Transition>
            </div>
        );
    }
}

// Export
export default connect(
    state => {
        const { activeProviders } = state.auth;
        const { newPosts, oldPosts, isInitLoad, showingPosts } = state.timeline;
        return {
            activeProviders,

            newPosts,
            oldPosts,
            isInitLoad,
            showingPosts
        }
    },
    { resetState, fetchPosts }
)(Home)