import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Redirect } from 'react-router';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';

// Components
import { App } from './components/App';
import Home from './components/Home';
import Settings from './components/Settings';
import { HomeLeftSidebar, HomeRightSidebar } from './components/Home/Sidebar';
import { SettingsLeftSidebar, SettingsRightSidebar } from './components/Settings/Sidebar';
import '../css/main.css';

// Config
import configureStore from './store';
const store = configureStore()
const history = createHistory()
syncReduxAndRouter(history, store)

// Render
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>

                <IndexRoute
                    components={{
                        main: Home,
                        leftSidebar: HomeLeftSidebar,
                        rightSidebar: HomeRightSidebar
                    }}
                    onEnter={redirectIfNotAuth}
                />
                <Route
                    path="settings"
                    components={{
                        main: Settings,
                        leftSidebar: SettingsLeftSidebar,
                        rightSidebar: SettingsRightSidebar
                    }}
                >
                </Route>

                <Redirect from="*" to="settings" />

            </Route>
        </Router>
    </Provider>,
    document.querySelector('.app')
);

import { isValidToken } from './utils/tokenHelper';
function redirectIfNotAuth(nextState, replaceState){
    if (!isValidToken()){
        replaceState(null, '/settings')
    }
}