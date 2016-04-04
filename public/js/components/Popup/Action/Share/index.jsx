import React from 'react';

// Helpers
import { Share } from 'utils/api';
import reduxStore from 'state/store';

// Components
import Icon from 'components/Utils/Icon';
import Spin from 'components/Utils/Spin';
import ClipboardBtn from './ClipboardBtn';

// Export
export default class Index extends React.Component {
    constructor(props) {
        const historyState = props.location.state;
        const restoreState = historyState && historyState.sharedLink ? historyState : null;

        super(props)
        this.state = restoreState || {
            post: {},
            sharedLink: '',
            sharedText: '',
            isFetching: false,
            isFetchFail: false,
            isInitLoad: true
        }

        this.toggleSharedText = this.toggleSharedText.bind(this)
    }
    fetchSharedLink() {
        const { provider, id, location } = this.props;
        const post = location.state;
        const { isFetching } = this.state;

        if (isFetching) return;
        this.setState({ isFetching: true, isFetchFail: false })

        Share
        .post({ provider, id }, {
            post,
            sharer: reduxStore.getState().base.get('PROFILE')[provider],
        })
        .then(res => {
            // Update State
            const newState = {
                post,
                sharedLink: `${window.location.origin}/share/${provider}/${id}`,
                sharedText: '',
                isFetching: false,
                isFetchFail: false,
                isInitLoad: false
            };
            this.setState(newState)
            // Store State in History State
            const { history } = this.props;
            history.replace({
                pathname: location.pathname,
                search: location.search,
                state: newState
            })
        })
        .catch(err => {
            this.setState({ isFetching: false, isFetchFail: true })
        })
    }
    toggleSharedText() {
        const { post, sharedText: preSharedText } = this.state;
        const { user: { screen_name } } = post;
        const text = post.text || '';

        this.setState({
            sharedText: (
                preSharedText
                    ? ''
                : `｜ @${screen_name}: ` + (text.length > 17 ? `${text.slice(0, 17)}…` : text)
            )
        })
    }
    componentDidMount() {
        if (this.state.isInitLoad) {
            this.fetchSharedLink()
        }
    }
    render() {
        const { provider } = this.props;
        const { sharedLink, sharedText, isInitLoad, isFetching, isFetchFail } = this.state;
        return (
            isInitLoad
                ? <Spin
                    type="oldPosts"
                    provider={provider}
                    initLoad={isInitLoad}
                    isFetching={isFetching}
                    isFetchFail={isFetchFail}
                    onClick={this.fetchSharedLink}
                />
            : <div className={`share provider--${provider}`}>
                <textarea
                    className="share__text"
                    type="text"
                    value={`${sharedText} ${sharedLink}`}
                    readOnly
                />
                <div className="share__toolBar vertically_center">
                    <ClipboardBtn />
                    <button
                        className={`share__btn ${sharedText ? '' : 'tips--deep--peace'}`}
                        type="button"
                        onClick={this.toggleSharedText}
                    >
                        <Icon name="wand" />
                    </button>
                </div>
            </div>
        );
    }
}
