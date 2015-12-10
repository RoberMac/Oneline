import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';

// Config
import routes from './routes';
import configureStore from './store';
const store = configureStore();
const history = createHistory();
syncReduxAndRouter(history, store)

// Render
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            {routes}
        </Router>
    </Provider>,
    document.querySelector('.app')
);