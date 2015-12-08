import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Redirect } from 'react-router';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';

// Components
import { App } from './components/App';
import { Home, HomeSidebar } from './components/Home';
import { Settings, SettingsSidebar } from './components/Settings';
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
                <IndexRoute components={{ main: Home, sidebar: HomeSidebar }}/>
                <Route path="settings" components={{ main: Settings, sidebar: SettingsSidebar }}/>
                <Redirect from="*" to="settings" />
            </Route>
        </Router>
    </Provider>,
    document.querySelector('.app')
);