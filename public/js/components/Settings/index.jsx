import React from 'react';
import classNames from 'classnames';
import Swipeable from 'react-swipeable';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';

import { addToken, removeToken, clearTokenIfTokenExpired } from 'state/actions/auth';

// Components
import Icon from 'components/Utils/Icon';
import Transition from 'components/Utils/Transition';
class SocialAuth extends React.Component {
    constructor(props) {
        super(props);
        this.toggleAuth = this.toggleAuth.bind(this);
        this.handleStorageChange = this.handleStorageChange.bind(this);
        this.handleSwipedLeft = this.handleSwipedLeft.bind(this);
        this.handleSwipedRight = this.handleSwipedRight.bind(this);
    }
    componentWillMount() {
        this.props.clearTokenIfTokenExpired();
    }
    componentDidMount() {
        window.addEventListener('storage', this.handleStorageChange);
    }
    componentWillUnmount() {
        window.removeEventListener('storage', this.handleStorageChange);
    }
    toggleAuth(provider) {
        if (this.props.activeProviders.indexOf(provider) < 0) {
            window.open(`/auth/${provider}`, '_blank');
        } else {
            this.props.removeToken(provider);
        }
    }
    handleStorageChange(e) {
        if (e.key === 'addToken') this.props.addToken();
    }
    handleSwipedLeft() {
        history.push('/home');
    }
    handleSwipedRight() {
        history.push('/settings/replicant');
    }
    _renderAuthBtns() {
        const { providers, activeProviders } = this.props;

        return (providers.map(provider => {
            const isActive = activeProviders.indexOf(provider) >= 0;
            const soicalBtnClass = classNames({
                'social__icon animate--faster tips': true,
                'social__icon--active tips--active': isActive,
            });

            return (
                <button
                    key={provider}
                    className={soicalBtnClass}
                    onClick={() => this.toggleAuth(provider)}
                    type="button"
                >
                    <Icon name={provider} />
                </button>
            );
        }));
    }
    render() {
        const { children } = this.props;

        return (
            <Swipeable onSwipedLeft={this.handleSwipedLeft} onSwipedRight={this.handleSwipedRight}>
                <div className="social animate--faster">
                    {this._renderAuthBtns()}
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
    state => ({
        providers: state.auth.get('providers'),
        activeProviders: state.auth.get('activeProviders'),
    }),
    { addToken, removeToken, clearTokenIfTokenExpired }
)(SocialAuth);
