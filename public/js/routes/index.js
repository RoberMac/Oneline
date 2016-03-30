import React from 'react';
import { Router, Route, IndexRoute, Redirect } from 'react-router';

import redirectIfNot from './redirectIfNot';

/**
 * Components
 *
 */
import App from 'components/App';
// Home & Settings
import Home from 'components/Home';
import Settings from 'components/Settings';
import { LeftSidebar, RightSidebar } from 'components/Utils/SideBar'
const HomeComponents = { main: Home, leftSidebar: LeftSidebar, rightSidebar: RightSidebar };
const SettingsComponents = { main: Settings, leftSidebar: LeftSidebar, rightSidebar: RightSidebar };
// Popup
import Popup from 'components/Popup';
import { SettingsMenu, HomeMenu, ProviderMenu } from 'components/Popup/Menu';
import { Deckard, Rachael } from 'components/Popup/Replicant';
import { Action } from 'components/Popup/Action';

/**
 * Export
 *
 */
export default (
    <Route path="/" component={App}>

        <IndexRoute onEnter={redirectIfNot.Home} />

        <Route path="home" components={HomeComponents} onEnter={redirectIfNot.Auth}>
            <Route path="menu" component={Popup}>
                <IndexRoute component={HomeMenu} />
            </Route>
            <Route path=":provider" component={Popup} onEnter={redirectIfNot.VaildProvider}>
                <IndexRoute component={ProviderMenu} />
                <Route path=":action(/:id)" component={Action} onEnter={redirectIfNot.VaildAction} />
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
