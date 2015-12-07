import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';

// Components
import App from './containers/App';
import Home from './components/Home';
import Settings from './components/Settings';
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
                <IndexRoute component={Home}/>
                <Route path="settings" component={Settings}/>
            </Route>
        </Router>
    </Provider>,
    document.querySelector('.app')
);