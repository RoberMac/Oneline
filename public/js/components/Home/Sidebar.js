import React from 'react';
import { Link } from 'react-router';


// Components
import { Icon } from '../Utils/Icon';

let GotoSettingsBtn = ({ activeProviders = [] }) => (
    <Link to="/settings">
        <span className="menu__button btn animate--faster">
            <svg viewBox="0 0 200 200">
                <g fill="none">
                    <circle fill="#F1F1F1" cx="100" cy="100" r="100"/>
                    <circle
                        fill={activeProviders.indexOf('twitter') >= 0 ? '#2AA9E0' : '#FFF'}
                        cx="100" cy="42.5" r="15"
                    />
                    <circle
                        fill={activeProviders.indexOf('instagram') >= 0 ? '#3F5D87' : '#FFF'}
                        cx="100" cy="100" r="15"
                    />
                    <circle
                        fill={activeProviders.indexOf('weibo') >= 0 ? '#E6162D' : '#FFF'}
                        cx="100" cy="157.5" r="15"
                    />
                </g>
            </svg>
        </span>
    </Link>
);
let ShowMenuBtn = ({ firstProvider }) => (
    <button className={`menu__button animate--faster icon--${firstProvider}`} type="button">
        <svg viewBox="0 0 200 200">
            <g fill-rule="evenodd">
                <circle fill="#F1F1F1" cx="100" cy="100" r="100"/>
                <circle cx="100" cy="100" r="15"/>
                <path 
                    fill={firstProvider !== 'instagram' ? null : '#FFF'}
                    d="M96.63 30.143c1.862-3.393 4.88-3.392 6.74 0l10.26 18.714c1.862 3.393.232 6.143-3.634 6.143H90.004c-3.868 0-5.495-2.75-3.635-6.143l10.26-18.714z"
                />
                <rect
                    fill={firstProvider === 'twitter' ? '#2AA9E0' : '#FFF'}
                    x="86" y="145" width="28" height="28" rx="7"
                />
            </g>
        </svg>
    </button>
);
let HidePopupBtn= (hidePopup) => (
    <button class="menu__button animate--faster" type="button" onClick="hidePopup">
        <Icon viewBox="0 0 200 200" name="cancel" />
    </button>
);

// Export
export class LeftSidebar extends React.Component {
    render() {
        const {activeProviders} = this.props;
        const leftClass = 'menu menu--timeline menu--left menu--timeline--left vertically_center animate--faster';

        return (
            <div className={leftClass}>
                <GotoSettingsBtn activeProviders={activeProviders} />
            </div>
        );
    }
}

export class RightSidebar extends React.Component {
    render() {
        const { activeProviders } = this.props;
        const rightClass = 'menu menu--timeline menu--right menu--timeline--right vertically_center animate--faster';
        let firstProvider = activeProviders.indexOf('twitter') >= 0
                                ? 'twitter'
                            : activeProviders.indexOf('weibo') >= 0
                                ? 'weibo'
                            : 'instagram';

        return (
            <div className={rightClass}>
                <ShowMenuBtn firstProvider={firstProvider}/>
            </div>
        );
    }
}