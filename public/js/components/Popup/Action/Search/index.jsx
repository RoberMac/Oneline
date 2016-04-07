import React from 'react';

// Helpers
import { selectSearchLink, selectSearchType } from 'utils/select';
import { isTwitter, isUnsplash } from 'utils/detect';

// Components
import Banner from 'components/Popup/Utils/Banner';
import SearchBar from 'components/Utils/SearchBar';
import SearchPediction from './SearchPediction';
import SearchPost from './SearchPost';

// Export
export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchType: selectSearchType.remote[props.provider][0].name, searchText: '',
        };
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }
    handleSearchChange({ searchType, searchText }) {
        this.setState({
            searchType: searchType || this.state.searchType,
            searchText,
        });
    }
    render() {
        const { provider } = this.props;
        const { searchText } = this.state;

        return (
            <div className="search">
                <Banner
                    provider={provider}
                    iconName="search"
                    link={searchText && selectSearchLink[provider]({ searchText })}
                    title={searchText}
                />
                <SearchBar
                    type="remote"
                    provider={provider}
                    searchText={searchText}
                    onSearchChange={this.handleSearchChange}
                    onRightBtnClick={() => this.handleSearchChange({ searchText: '' })}
                />
                {isTwitter(provider) && searchText || isUnsplash(provider)
                    ? <SearchPost {...this.state} {...this.props} />
                    : <SearchPediction
                        onPedictionClick={this.handleSearchChange}
                        {...this.state}
                        {...this.props}
                    />
                }
            </div>
        );
    }
}
