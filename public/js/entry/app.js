import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

// Styles
import './common.css';

// Polyfill
require('es6-promise').polyfill();
require('isomorphic-fetch');

// Config
import routes from '../routes';
import store from 'state/store';

// Render
ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            {routes}
        </Router>
    </Provider>,
    document.querySelector('.root')
);
