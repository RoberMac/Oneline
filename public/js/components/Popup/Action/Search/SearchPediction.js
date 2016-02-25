import React from 'react';
import { Link } from 'react-router';

// Helpers
import store from 'utils/store';
import { Action } from 'utils/api';
import { isTwitter as _isTwitter } from 'utils/detect';
const PEDICTION = {
    twitter: {
        text: {
            action: 'trends',
            id: () => 1, // 1 for Worldwide
            initState: () => store.get('trends_twitter') || {},
            storeState: data => store.set('trends_twitter', data),
            isFresh: data => data.created_at && Date.now() - data.created_at < 1000 * 60 * 30,
            renderItem: ({ name, onClick }) => (
                <span onClick={() => onClick({ searchText: name })}>
                    {name}
                </span>
            )
        }
    },
    instagram: {
        tags: {
            action: 'pediction_tags',
            initState: () => ({}),
            id: i => i,
            renderItem: ({ name }) => <Link to={`/home/instagram/tags/${name}`}>#{name}</Link>
        },
        users: {
            action: 'pediction_users',
            initState: () => ({}),
            id: i => i,
            renderItem: ({ name }) => <Link to={`/home/instagram/user/${name}`}>@{name}</Link>
        }
    }
}

// Components
import Spin from 'components/Utils/Spin';

export default class SearchPediction extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            pedictions: PEDICTION[props.provider][props.searchType]['initState'](),
            isFetching: false,
            isFetchFail: false
        }
        this.fetchPedictions = this.fetchPedictions.bind(this)
    }
    fetchPedictions() {
        const { provider, searchType, searchText } = this.props;
        const { pedictions, isFetching } = this.state;

        const isTwitter = _isTwitter(provider);
        const P = PEDICTION[provider][searchType];

        if (isFetching || isTwitter && P['isFresh'](pedictions)) return;

        if (!searchText && !isTwitter) {
            this.setState({ pedictions: {}, isFetching: false, isFetchFail: false })
            return;
        }

        this.setState({ pedictions: {}, isFetching: true, isFetchFail: false })

        Action
        .get({
            provider,
            action: P['action'],
            id: P['id'](searchText)
        })
        .then(res => {
            this.setState({
                pedictions: res,
                isFetching: false,
                isFetchFail: false,
            })
            isTwitter && P['storeState'](res)
        })
        .catch(err => {
            this.setState({ isFetching: false, isFetchFail: true })
        })
    }
    componentDidUpdate(prevProps, prevState) {
        const { searchType: prevType , searchText: prevText } = prevProps;
        const { searchType: currentType , searchText: currentText } = this.props;

        if (prevType !== currentType || prevText !== currentText) {
            this.fetchPedictions()
        }
    }
    componentDidMount() {
        _isTwitter(this.props.provider) && this.fetchPedictions()
    }
    render() {
        const { provider, searchType, searchText, onPedictionClick } = this.props;
        const { pedictions, isFetching, isFetchFail } = this.state;
        const Item = PEDICTION[provider][searchType]['renderItem'];
        return (
            <ul className={`search__pedictions color--${provider} overflow--y`}>
            {pedictions.data && pedictions.data
            .sort((a, b) => a.volume < b.volume ? 1 : -1)
            .map(item => {
                const { name, volume } = item;
                return (
                    <li className="search__pedictions__item tips" key={name + volume}>
                        <Item name={name} onClick={onPedictionClick} />
                    </li>
                );
            })}
            {(isFetching || isFetchFail) && (
                <Spin
                    type="oldPosts"
                    provider={provider}
                    initLoad={true}
                    isFetching={isFetching}
                    isFetchFail={isFetchFail}
                />
            )}
            </ul>
        );
    }
}
