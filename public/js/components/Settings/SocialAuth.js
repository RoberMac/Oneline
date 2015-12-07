import React from 'react';

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
    toggleAuth (provider){
        // TODO
        console.log(provider)
    }
    render() {
        return (
            <div className="social-wrapper animate--faster">
                {this.props.providers.map(provider => (
                    <SocialAuthBtn
                        key={provider}
                        provider={provider}
                        isActive={false}
                        toggleAuth={ provider => this.toggleAuth(provider) }
                    />
                ))}
            </div>
        );
    }
}
