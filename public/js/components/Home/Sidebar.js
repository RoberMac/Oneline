import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Components
import Icon from 'components/Utils/Icon';
const sidebarBtnClass = classNames('sidebar__button', 'btn', 'animate--faster');

const ShowMenuBtn = ({ firstProvider }) => (
    <Link to={`/home/${firstProvider}`}>
        <span className={`${sidebarBtnClass} color--${firstProvider}`} type="button">
            <svg viewBox="0 0 200 200">
                <g fill-rule="evenodd">
                    <circle fill="#F1F1F1" cx="100" cy="100" r="100"/>
                    <circle cx="100" cy="100" r="15"/>
                    <path 
                        fill={firstProvider !== 'instagram' ? null : '#FFF'}
                        d="M96.63 30.143c1.862-3.393 4.88-3.392 6.74 0l10.26 18.714c1.862 3.393.232 6.143-3.634 6.143H90.004c-3.868 0-5.495-2.75-3.635-6.143l10.26-18.714z"
                    />
                    <rect
                        fill={firstProvider !== 'weibo' ? null : '#FFF'}
                        x="86" y="145" width="28" height="28" rx="7"
                    />
                </g>
            </svg>
        </span>
    </Link>
);
const BackToSettingsBtn = ({ activeProviders }) => (
    <Link to="/settings">
        <span className={sidebarBtnClass}>
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
const LeftSidebar = ({ activeProviders }) => {
    const isPopup = !/home$/.test(location.pathname);

    return isPopup ? <span /> : <BackToSettingsBtn activeProviders={activeProviders} />;
};
const RightSidebar = ({ activeProviders }) => {
    const isPopup = !/home$/.test(location.pathname);
    let firstProvider = (
        activeProviders.indexOf('twitter') >= 0
            ? 'twitter'
        : activeProviders.indexOf('weibo') >= 0
            ? 'weibo'
        : 'instagram'
    );

    return isPopup ? <span /> : <ShowMenuBtn firstProvider={firstProvider}/>;
}


// Export
export const HomeLeftSidebar = connect(
    state => ({ activeProviders: state.auth.activeProviders })
)(LeftSidebar)

export const HomeRightSidebar = connect(
    state => ({ activeProviders: state.auth.activeProviders })
)(RightSidebar)