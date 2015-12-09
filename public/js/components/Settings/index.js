import React from 'react';
import { connect } from 'react-redux';

// Components
import { Icon } from '../Utils/Icon';
import { addToken, removeToken } from '../../actions/auth';

let SocialAuthBtn = ({ provider, isActive, toggleAuth }) => {
    let activeClass = isActive ? ' social-icon--active tips--active' : '';

    return (
        <div className="social-list vertically_center">
            <button
                className={`social-icon animate--faster tips${activeClass}`}
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
    toggleAuth (provider){
        if (this.props.activeProviders.indexOf(provider) < 0){
            window.open('/auth/' + provider, '_blank')
        } else {
            this.props.removeToken(provider)
        }
    }
    handleStorageChange (e){
        if (e.key === 'addToken'){ this.props.addToken() };
    }
    componentDidMount (){
        window.addEventListener('storage', this.handleStorageChange)
    }
    componentWillUnmount (){
        window.removeEventListener('storage', this.handleStorageChange)
    }
    render (){
        const { providers, activeProviders } = this.props;
        return (
            <div className="social-wrapper animate--faster">
                {providers.map(provider => (
                    <SocialAuthBtn
                        key={provider}
                        provider={provider}
                        isActive={activeProviders.indexOf(provider) >= 0}
                        toggleAuth={this.toggleAuth}
                    />
                ))}
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
    { addToken, removeToken }
)(SocialAuth)