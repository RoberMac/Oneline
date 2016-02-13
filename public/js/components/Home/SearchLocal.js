import React from 'react';
import classNames from 'classnames';

import Icon from 'components/Utils/Icon';
class SearchBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = { active: false }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }
    handleSubmit(e) {
        e.preventDefault()
        const inputElem = this.refs.input;
        this.props.onSearchChange(inputElem.value)
    }
    handleClick (){
        const { active } = this.state;
        const inputElem = this.refs.input;

        if (active) {
            inputElem.blur()
            inputElem.value = ''
        } else {
            inputElem.focus()
        }

        this.setState({ active: !active })
        this.props.onIconClick()
    }
    render() {
        const { type } = this.props;
        const { active } = this.state;
        const searchClass = classNames({
            'searchBar searchBar--local animate--faster': true,
            'searchBar--active': active
        });
        const searchIconClass = classNames({
            'searchBar__icon': true,
            'icon--gray': active,
            'icon--white': !active
        });
        const searchIconName = active ? 'cancel' : 'search';
        return (
            <div className={searchClass}>
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
                        className={searchIconClass}
                        type="button"
                        onClick={this.handleClick}
                    >
                        <Icon name={searchIconName} />
                    </button>
                </form>
            </div>
        );
    }
}

export default class SearchLocal extends React.Component {
    constructor(props) {
        super(props)
        this.state = { search: false }
        this.toggleSearch = this.toggleSearch.bind(this)
        this.handleSearchChange = this.handleSearchChange.bind(this)
    }
    toggleSearch() {
        const { onChange } = this.props;
        const { search } = this.state;

        if (search) {
            onChange({ actionType: 'reset' })
        } else {
            onChange({ actionType: 'init' })
        }

        this.setState({ search: !search })
    }
    handleSearchChange(searchText) {
        __DEV__ && console.time(`[Search] ${searchText}`)

        const { onChange, allPosts } = this.props;
        const newShowingPosts = (
            searchText
                ? allPosts.filter(post => {
                    const text = `${post.text} ${post.quote ? post.quote.text : ''} ${post.retweet ? post.retweet.text : ''}`;
                    return text.toLowerCase().indexOf(searchText) >= 0;
                })
            : []
        );
        onChange({ actionType: 'update', newShowingPosts })

        __DEV__ && console.timeEnd(`[Search] ${searchText}`)
    }
    render() {
        return <SearchBar onIconClick={this.toggleSearch} onSearchChange={this.handleSearchChange} />;
    }
}