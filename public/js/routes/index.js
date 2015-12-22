import React from 'react';
import { Router, Route, IndexRoute, Redirect } from 'react-router';

import redirectIfNot from './redirectIfNot';

/**
 * Components
 *
 */
import App from '../components/App';
// Home
import Home from '../components/Home';
import { HomeLeftSidebar, HomeRightSidebar } from '../components/Home/Sidebar';
const HomeComponents = {
    main: Home,
    leftSidebar: HomeLeftSidebar,
    rightSidebar: HomeRightSidebar
};
// Settings
import Settings from '../components/Settings';
import { SettingsLeftSidebar, SettingsRightSidebar } from '../components/Settings/Sidebar';
const SettingsComponents = {
    main: Settings,
    leftSidebar: SettingsLeftSidebar,
    rightSidebar: SettingsRightSidebar
};
// Popup
import Popup from '../components/Popup';
import { Deckard, Rachael } from '../components/Popup/Replicant';
import { SettingsMenu, HomeMenu } from '../components/Popup/Menu';


/**
 * Export
 *
 */
export default (
    <Route path="/" component={App}>

        <IndexRoute onEnter={redirectIfNot.Home} />

        <Route path="home" components={HomeComponents} onEnter={redirectIfNot.Auth}>
            <Route path=":provider" component={Popup} onEnter={redirectIfNot.VaildProvider}>
                <IndexRoute component={HomeMenu} />
                <Route path=":action(/:id)" component={Rachael} onEnter={redirectIfNot.VaildAction} />
            </Route>
        </Route>

        <Route path="settings" components={SettingsComponents}>
            <Route path="replicant" component={Popup}>
                <IndexRoute component={SettingsMenu} />
                <Route path="deckard" component={Deckard} />
                <Route path="rachael" component={Rachael} />
                <Redirect from="*" to="deckard"/>
            </Route>
        </Route>

        <Redirect from="*" to="settings" />

    </Route>
);
