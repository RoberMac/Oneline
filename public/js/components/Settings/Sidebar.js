import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

// Components
import { Icon } from '../Utils/Icon';
import { Empty } from '../Utils/Empty';
const LeftSidebar = ({ activeProviders }) => {
    const type = activeProviders.length <= 0 ? 'rachael' : 'deckard';
    return (
        <Link to={`/settings/replicant/${type}`}>
            <span className="menu__button btn animate--faster">
                <Icon viewBox="0 0 200 200" name={type} />
            </span>
        </Link>
    );
};
const RightSidebar = ({ activeProviders }) => {
    return activeProviders.length <= 0
        ? <Empty />
    : (
        <Link to="/">
            <span className="menu__button btn animate--faster">
                <Icon viewBox="0 0 200 200" name="ok" />
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