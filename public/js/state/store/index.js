import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from '../reducers';

// middlewares
const middlewares = [thunkMiddleware];
if (__DEV__) {
    const createLogger = require('redux-logger');
    const logger = createLogger({ duration: true });
    middlewares.push(logger);
}

// configureStore
const store = applyMiddleware(...middlewares)(createStore)(rootReducer)
if (module.hot) { // via https://github.com/reactjs/redux/blob/master/examples/async/store/configureStore.js#L13
    module.hot.accept('../reducers', () => {
        const nextReducer = require('../reducers')
        store.replaceReducer(nextReducer)
    })
}

export default store;
