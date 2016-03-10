import React from 'react';
import classNames from 'classnames';
import Swipeable from 'react-swipeable';
import { connect } from 'react-redux';
import { browserHistory as history } from 'react-router';

import { addToken, removeToken, clearTokenIfTokenExpired } from 'state/actions/auth';

// Components
import Icon from 'components/Utils/Icon';
import Transition from 'components/Utils/Transition';
let SocialAuthBtn = ({ provider, isActive, toggleAuth }) => {
    const soicalListClass = classNames('social-list', 'vertically_center');
    const soicalBtnClass = classNames({
        'social-icon animate--faster tips': true,
        'social-icon--active tips--active': isActive  
    });

    return (
        <div className={soicalListClass}>
            <button
                className={soicalBtnClass}
                type="button"
                onClick={toggleAuth.bind(null, provider)}
            >
                <Icon name={provider} />
            </button>
        </div>
    );
};
class SocialAuth extends React.Component {
    constructor (props){
        super(props)
        this.toggleAuth = this.toggleAuth.bind(this)
        this.handleStorageChange = this.handleStorageChange.bind(this)
        this.handleSwipedLeft = this.handleSwipedLeft.bind(this)
        this.handleSwipedRight = this.handleSwipedRight.bind(this)
    }
    // 授權／吊銷授權
    toggleAuth(provider) {
        if (this.props.activeProviders.indexOf(provider) < 0){
            window.open('/auth/' + provider, '_blank')
        } else {
            this.props.removeToken(provider)
        }
    }
    handleStorageChange(e) {
        if (e.key === 'addToken'){ this.props.addToken() };
    }
    handleSwipedLeft() {
        history.push('/home')
    }
    handleSwipedRight() {
        history.push('/settings/replicant')
    }
    componentWillMount() {
        this.props.clearTokenIfTokenExpired()
    }
    componentDidMount() {
        window.addEventListener('storage', this.handleStorageChange)
    }
    componentWillUnmount() {
        window.removeEventListener('storage', this.handleStorageChange)
    }
    render() {
        const { providers, activeProviders, children } = this.props;
        const soicalWrapperClass = classNames('social-wrapper', 'animate--faster');

        return (
            <Swipeable onSwipedLeft={this.handleSwipedLeft} onSwipedRight={this.handleSwipedRight}>
                <div className={soicalWrapperClass}>
                    {providers.map(provider => (
                        <SocialAuthBtn
                            key={provider}
                            provider={provider}
                            isActive={activeProviders.indexOf(provider) >= 0}
                            toggleAuth={this.toggleAuth}
                        />
                    ))}
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
        const { providers, activeProviders } = state.auth;
        return { providers, activeProviders }
    },
    { addToken, removeToken, clearTokenIfTokenExpired }
)(SocialAuth)