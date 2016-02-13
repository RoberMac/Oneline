import React from 'react';
import assign from 'object.assign';
import classNames from 'classnames';

// Helpers
import store from 'utils/store';
import { Action } from 'utils/api';
import { selectSearchLink } from 'utils/select';
const initSearchState = {
    searchText: '',
    showingPosts: [],
    isFetching: false,
    isFetchFail: false,
    isInitLoad: true,
    minId: ''
};

// Components
import Icon from 'components/Utils/Icon';
import Spin from 'components/Utils/Spin';
import Post from 'components/Utils/Post';
import Banner from 'components/Popup/Utils/Banner';
class SearchBar extends React.Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }
    handleSubmit(e) {
        e.preventDefault()
        const inputElem = this.refs.input;
        this.props.onSearchChange(inputElem.value)
    }
    handleClick() {
        const inputElem = this.refs.input;

        inputElem.value = '';
        inputElem.focus()
        this.props.onIconClick();
    }
    render() {
        return (
            <div className="searchBar searchBar--remote searchBar--active animate--faster">
                <form className="searchBar__form" onSubmit={this.handleSubmit}>
                    <input
                        className="searchBar__input animate--faster"
                        type="text"
                        autoComplete="off"
                        spellCheck="false"
                        required={true}
                        ref="input"
                    />
                    <button
                        className="searchBar__icon icon--white"
                        type="button"
                        onClick={this.handleClick}
                    >
                        <Icon name="search" />
                    </button>
                </form>
            </div>
        );
    }
}
class Trends extends React.Component {
    constructor(props) {
        super(props)
        this.state = { trends: store.get(`trends_${props.provider}`) || {} }
        this.getTrends = this.getTrends.bind(this)
    }
    getTrends() {
        const { provider } = this.props;
        const { trends } = this.state;

        if (!trends.created_at || Date.now() - trends.created_at > 1000 * 60 * 10) {
            Action
            .get({
                provider,
                action: 'trends',
                id: 1 // 1 for Worldwide,
            })
            .then(res => {
                this.setState({ trends: res })
                store.set(`trends_${provider}`, res)
            })
        }
    }
    componentDidMount() {
        this.getTrends()
    }
    render() {
        const { provider, onTrendClick } = this.props;
        const { trends } = this.state;
        return (
            <ul className={`search__trends color--${provider} overflow--y`}>
            {trends.data && trends.data
            .sort((a, b) => a.volume < b.volume ? 1 : -1)
            .map(trend => {
                const { name } = trend;
                return (
                    <li
                        className="search__trends__item tips"
                        key={name}
                        onClick={onTrendClick.bind(null, name)}
                    >
                        {name}
                    </li>
                );
            })}
            </ul>
        );
    }
}

// Export
export default class Search extends React.Component {
    constructor(props) {
        super(props)
        this.state = assign({}, initSearchState)
        this.resetState = this.resetState.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.loadPosts = this.loadPosts.bind(this);
    }
    resetState() {
        console.log({}, initSearchState)
        this.setState(assign({}, initSearchState));
    }
    handleSearchChange(searchText) {
        this.setState(assign({}, initSearchState, {
            searchText: window.encodeURIComponent(`${searchText}`),
        }), () => {
            this.loadPosts()
        });
    }
    loadPosts() {
        const { provider } = this.props;
        const { searchText, showingPosts, isFetching, minId } = this.state;

        if (isFetching || !searchText) return;
        this.setState({ isFetching: true, isFetchFail: false })

        Action
        .get({
            provider,
            action: 'search',
            id: searchText,
        }, minId ? { maxId: minId } : undefined)
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
    render() {
        const { provider } = this.props;
        const { searchText, showingPosts, isInitLoad, isFetching, isFetchFail } = this.state;

        return (
            <div className="search">
                <Banner
                    provider={provider}
                    iconName="search"
                    link={searchText && selectSearchLink[provider]({ searchText })}
                    title={window.decodeURIComponent(`${searchText}`)}
                />
                <SearchBar onSearchChange={this.handleSearchChange} onIconClick={this.resetState} />
                {showingPosts.map(item => <Post className="popupPost" key={item.id_str} post={item} />)}
                {!searchText && <Trends provider={provider} onTrendClick={this.handleSearchChange} />}
                {isFetching || showingPosts.length >= 7
                    ? <Spin
                        type="oldPosts"
                        provider={provider}
                        initLoad={isInitLoad}
                        isFetching={isFetching}
                        isFetchFail={isFetchFail}
                        onClick={this.loadPosts}
                    />
                    : null
                }
            </div>
        );
    }
}
