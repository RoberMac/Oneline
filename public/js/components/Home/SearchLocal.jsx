/* eslint no-console: 0 */

import React from 'react';

import { MAX_SHOWING_COUNT } from 'utils/constants';

import SearchBar from 'components/Utils/SearchBar';

export default class SearchLocal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { search: false };
        this.toggleSearch = this.toggleSearch.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }
    toggleSearch() {
        const { onChange } = this.props;
        const { search } = this.state;

        if (search) {
            onChange({ actionType: 'reset' });
        } else {
            onChange({ actionType: 'init' });
        }

        this.setState({ search: !search });
    }
    handleSearchChange({ searchType, searchText }) {
        __DEV__ && console.time(`[Search] ${searchText}`);

        if (!searchText) return;

        const { onChange, allPosts } = this.props;
        const newShowingPosts = searchText ? (
            allPosts
            .filter(post => {
                let srcText;

                switch (searchType) {
                    case 'text':
                        srcText = (
                            post.text
                            + (post.quote && post.quote.text || '')
                            + (post.retweet && post.retweet.text || '')
                        );
                        break;
                    case 'user':
                        srcText = (
                            post.user.name + post.user.screen_name
                            + (post.quote
                                && (post.quote.user.name + post.quote.user.screen_name)
                                || ''
                            )
                            + (post.retweet
                                && (post.retweet.user.name + post.retweet.user.screen_name)
                                || ''
                            )
                        );
                        break;
                    default:
                        break;
                }

                return srcText.toLowerCase().indexOf(searchText.toLowerCase()) >= 0;
            })
            .slice(0, MAX_SHOWING_COUNT - 1)
        ) : [];

        onChange({
            searchText,
            actionType: 'update',
            newShowingPosts,
        });

        __DEV__ && console.timeEnd(`[Search] ${searchText}`);
    }
    render() {
        return (
            <SearchBar
                type="local"
                provider="all"
                onSearchChange={this.handleSearchChange}
                onRightBtnClick={this.toggleSearch}
            />
        );
    }
}
