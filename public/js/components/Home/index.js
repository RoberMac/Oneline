import React from 'react';
import { connect } from 'react-redux';
import Swipeable from 'react-swipeable';
import shallowCompare from 'react-addons-shallow-compare';

// Helpers
import { replaceTokenList } from '../../actions/auth';
import { resetState, fetchPosts } from '../../actions/timeline';
import DependencyLoader from './loader';

// Components
import Post from '../Utils/Post';
import Spin from '../Utils/Spin';
import Transition from '../Utils/Transition';
class Timeline extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        __DEV__ && console.time('[shallowCompare]')
        const shouldUpdate = shallowCompare(this, nextProps, nextState);
        __DEV__ && console.timeEnd('[shallowCompare]')
        return shouldUpdate;
    }
    render() {
        return (
            <div>
            {
                this.props.showingPosts
                .sort((a, b) => a.created_at < b.created_at ? 1 : -1)
                .map(item => (
                    <Post key={item.id_str} item={item} />
                ))
            }
            </div>
        );
    }
}
class Home extends React.Component {
    constructor (props){
        super(props)
        this.state = { isDependenciesLoaded: false }
        this.loadPosts = this.loadPosts.bind(this)
        this.handleSwipedLeft = this.handleSwipedLeft.bind(this)
        this.handleSwipedRight = this.handleSwipedRight.bind(this)
    }
    loadPosts({ postsType, isAutoFetch }) {
        const { fetchPosts, replaceTokenList, history } = this.props;
        return fetchPosts({ postsType, isAutoFetch })
        .catch(err => {
            if (err.status === 401){
                replaceTokenList([])
                history.push('/settings')
            }
        })
    }
    handleSwipedLeft() {
        const { activeProviders } = this.props;
        let firstProvider = (
            activeProviders.indexOf('twitter') >= 0
                ? 'twitter'
            : activeProviders.indexOf('weibo') >= 0
                ? 'weibo'
            : 'instagram'
        );

        this.props.history.push(`/home/${firstProvider}`)
    }
    handleSwipedRight() {
        this.props.history.push('/settings')
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
            __DEV__ && console.log('[Auto Fetch]: Registered')
            this.autoFetchIntervalId = setInterval( () => {
                this.loadPosts({ postsType: 'newPosts', isAutoFetch: true })
            }, 1000 * 60 * 3)
        })
    }
    componentWillUnmount() {
        // Reset `isInitLoad`
        this.props.resetState();
        document.title = '｜';
        // Unregister Auto Fetch
        __DEV__ && console.log('[Auto Fetch]: Unregistered')
        clearInterval(this.autoFetchIntervalId)
    }
    render() {
        const { newPosts, oldPosts, showingPosts, isInitLoad, children } = this.props;
        const { isDependenciesLoaded } = this.state;
        return (
            <Swipeable onSwipedLeft={this.handleSwipedLeft} onSwipedRight={this.handleSwipedRight}>
                <div className="oneline__wrapper overflow--y">
                    <Spin
                        type="newPosts"
                        initLoad={isInitLoad && isDependenciesLoaded}
                        {...newPosts}
                        onClick={this.loadPosts.bind(this, { postsType: 'newPosts' })}
                    />
                    {isDependenciesLoaded && showingPosts
                        ? <Timeline showingPosts={showingPosts} />
                        : null
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
            </Swipeable>
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
    { resetState, fetchPosts, replaceTokenList }
)(Home)