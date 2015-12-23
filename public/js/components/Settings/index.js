import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { addToken, removeToken, clearTokenIfTokenInvalid } from '../../actions/auth';
import './settings.css';

// Components
import Icon from '../Utils/Icon';
import Transition from '../Utils/Transition';
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
                <Icon viewBox="0 0 300 300" name={provider} />
            </button>
        </div>
    );
};
class SocialAuth extends React.Component {
    constructor (props){
        super(props)
        this.toggleAuth = this.toggleAuth.bind(this)
        this.handleStorageChange = this.handleStorageChange.bind(this)
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
    componentWillMount() {
        this.props.clearTokenIfTokenInvalid()
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
            <div>
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
            </div>
        );
    }
}

// Export
export default connect(
    state => {
        const { providers, activeProviders } = state.auth;
        return { providers, activeProviders }
    },
    { addToken, removeToken, clearTokenIfTokenInvalid }
)(SocialAuth)