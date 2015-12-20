import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Components
import Icon from '../Utils/Icon';
const sidebarBtnClass = classNames('menu__button', 'btn', 'animate--faster');

const LeftSidebar = ({ activeProviders, location }) => {
    const isPopup = !/settings$/.test(location.pathname);
    const type = activeProviders.length <= 0 ? 'rachael' : 'deckard';

    return isPopup
        ? null
    : (
        <Link to={`/settings/replicant/${type}`}>
            <span className={sidebarBtnClass}>
                <Icon viewBox="0 0 200 200" name={type} />
            </span>
        </Link>
    );
};
const RightSidebar = ({ activeProviders, location }) => {
    const isPopup = !/settings$/.test(location.pathname);

    return activeProviders.length <= 0 || isPopup
        ? null
    : (
        <Link to='/'>
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