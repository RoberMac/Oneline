import React from 'react';
import { Router, Route, IndexRoute, Redirect } from 'react-router';

import redirectIfNot from './redirectIfNot';

// Components
import App from '../components/App';

import Home from '../components/Home';
import { HomeLeftSidebar, HomeRightSidebar } from '../components/Home/Sidebar';
const HomeComponents = {
    main: Home,
    leftSidebar: HomeLeftSidebar,
    rightSidebar: HomeRightSidebar
};

import Settings from '../components/Settings';
import { SettingsLeftSidebar, SettingsRightSidebar } from '../components/Settings/Sidebar';
const SettingsComponents = {
    main: Settings,
    leftSidebar: SettingsLeftSidebar,
    rightSidebar: SettingsRightSidebar
};

import Popup from '../components/Popup';
import { Deckard, Rachael } from '../components/Popup/Replicant';


// Export
export default (
    <Route path="/" component={App}>

        <IndexRoute components={HomeComponents} onEnter={redirectIfNot.Auth} />
        <Route path="settings" components={SettingsComponents}>
            <Route path="replicant" component={Popup}>
                <Route path="deckard" component={Deckard} />
                <Route path="rachael" component={Rachael} />
                <Redirect from="*" to="deckard"/>
            </Route>
        </Route>
        <Redirect from="*" to="settings" />

    </Route>
);
