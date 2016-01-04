import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Components
import Icon from '../Utils/Icon';
const sidebarBtnClass = classNames('sidebar__button', 'btn', 'animate--faster');

const LeftSidebar = ({ activeProviders, location }) => {
    const isPopup = !/settings$/.test(location.pathname);

    return isPopup
        ? <span />
    : (
        <Link to="/settings/replicant">
            <span className={sidebarBtnClass}>
                <Icon viewBox="0 0 200 200" name='replicant' />
            </span>
        </Link>
    );
};
const RightSidebar = ({ activeProviders, location }) => {
    const isPopup = !/settings$/.test(location.pathname);

    return activeProviders.length <= 0 || isPopup
        ? <span />
    : (
        <Link to='/home'>
            <span className={sidebarBtnClass}>
                <Icon viewBox="0 0 200 200" name='ok' />
            </span>
        </Link>
    );
}


// Export
export const SettingsLeftSidebar = connect(
    state => ({ activeProviders: state.auth.activeProviders })
)(LeftSidebar)

export const SettingsRightSidebar = connect(
    state => ({ activeProviders: state.auth.activeProviders })
)(RightSidebar)