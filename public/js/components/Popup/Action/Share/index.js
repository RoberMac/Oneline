import React from 'react';

// Helper
import { Share } from 'utils/api';

// Components
import Spin from 'components/Utils/Spin';
import SelectText from 'components/Utils/SelectText';

// Export
export default class Index extends React.Component {
    constructor(props) {
        const historyState = props.location.state;
        const restoreState = historyState && historyState.sharedLink ? historyState : null;

        super(props)
        this.state = restoreState || {
            sharedLink: '',
            isFetching: false,
            isFetchFail: false,
            isInitLoad: true
        }
    }
    fetchSharedLink() {
        const { provider, id, location } = this.props;
        const { isFetching } = this.state;

        if (isFetching) return;
        this.setState({ isFetching: true, isFetchFail: false })

        Share
        .post({ provider, id }, {
            sharer: window[`profile_${provider}`],
            post: location.state
        })
        .then(res => {
            // Update State
            const newState = {
                sharedLink: `${window.location.origin}/share/${provider}/${id}`,
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
    componentDidMount() {
        if (this.state.isInitLoad) {
            this.fetchSharedLink()
        }
    }
    render() {
        const { provider } = this.props;
        const { sharedLink, isInitLoad, isFetching, isFetchFail } = this.state;
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
            : (
                <div className={`share vertically_center provider--${provider}`}>
                    <SelectText value={sharedLink} />
                </div>
            )
        );
    }
}
