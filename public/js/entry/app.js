import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

// Styles
import './common.css';

// Polyfill
import 'es6-promise';
import 'isomorphic-fetch';

// Config
import routes from '../routes';
import store from '../store';
import history from '../utils/history';

// Render
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            {routes}
        </Router>
    </Provider>,
    document.querySelector('.root')
);