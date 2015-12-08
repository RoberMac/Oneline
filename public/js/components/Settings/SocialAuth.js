import React from 'react';

// Utils
import { addToken } from '../../utils/tokenHelper';

// Components
import { Icon } from '../Utils/Icon';

let SocialAuthBtn = props => {
    let { provider, isActive, toggleAuth } = props;
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

export default class SocialAuth extends React.Component {
    // 授權／吊銷授權
    toggleAuth (provider){
        if (this.props.activeProviders.indexOf(provider) < 0){
            window.open('/auth/' + provider, '_blank')
        } else {
            // TODO
            console.log(`try to revoke ${provider}`)
        }
    }
    handleStorageChange (e){
        if (e.key !== 'addToken') return;

        addToken()
        // TODO: update activeProviders
        // $scope.updateProviderList()
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
                        toggleAuth={this.toggleAuth.bind(this)}
                    />
                ))}
            </div>
        );
    }
}
