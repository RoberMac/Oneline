import React from 'react';
import { connect } from 'react-redux';

// Components
import Timeline from './Timeline';
import { LeftSidebar, RightSidebar } from './Sidebar';

let _Home = () => (
    <Timeline />
);
let _Sidebar = ({ activeProviders }) => (
    <div>
        <LeftSidebar  activeProviders={activeProviders}/>
        <RightSidebar activeProviders={activeProviders} />
    </div>
);

// Export
export let Home = connect(
    state => ({
        providers: state.auth.providers,
        activeProviders: state.auth.activeProviders,
        timeline: state.timeline
    })
)(_Home)

export let HomeSidebar = connect(
    state => ({
        activeProviders: state.auth.activeProviders
    })
)(_Sidebar)