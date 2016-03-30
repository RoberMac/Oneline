import React from 'react';
import { connect } from 'react-redux';

// Helpers
import { isSettingsPage, isHomePage, isPopupPage } from 'utils/detect';
const colorClass = pathname => {
    const match = pathname.match(/twitter|instagram|weibo/);
    return `color--${match ? match[0] : 'steel'}`;
};

// Components
import HistoryGoBtn from './HistoryGoBtn';
import HomeSidebarBtn from './HomeSidebarBtn';
import ReplicantBtn from './ReplicantBtn';
import GoToHomeBtn from './GoToHomeBtn';

const _LeftSidebar = ({ activeProviders, location: { pathname } }) => (
    isPopupPage(pathname)
        ? <HistoryGoBtn step={-1} className={`${colorClass(pathname)}`} />
    : isHomePage(pathname)
        ? <HomeSidebarBtn link="/settings" activeProviders={activeProviders} />
    : <ReplicantBtn />
);
const _RightSidebar = ({ activeProviders, location: { pathname } }) => {
    return (
        isPopupPage(pathname)
            ? <HistoryGoBtn
                step="1"
                className={`${colorClass(pathname)} rotate--180`}
            />
        : activeProviders.length <= 0
            ? <span />
        : isHomePage(pathname)
            ? <HomeSidebarBtn link="/home/menu" activeProviders={activeProviders} />
        : isSettingsPage(pathname)
            ? <GoToHomeBtn />
        : <span />
    );
};


// Exports
export const LeftSidebar = connect(
    state => ({ activeProviders: state.auth.activeProviders })
)(_LeftSidebar)
export const RightSidebar = connect(
    state => ({ activeProviders: state.auth.activeProviders })
)(_RightSidebar)