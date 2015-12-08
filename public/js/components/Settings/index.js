import React from 'react';
import { connect } from 'react-redux';

// Components
import SocialAuth from './SocialAuth';
import { LeftSidebar, RightSidebar } from './Sidebar';

let _Settings = ({ providers, activeProviders }) => (
    <SocialAuth providers={providers} activeProviders={activeProviders} />
);
let _Sidebar = ({ activeProviders }) => (
    <div>
        <LeftSidebar  activeProviders={activeProviders}/>
        <RightSidebar activeProviders={activeProviders}/>
    </div>
);

// Export
export let Settings = connect(
    state => ({
        providers: state.auth.providers,
        activeProviders: state.auth.activeProviders
    })
)(_Settings)

export let SettingsSidebar = connect(
    state => ({
        activeProviders: state.auth.activeProviders
    })
)(_Sidebar)