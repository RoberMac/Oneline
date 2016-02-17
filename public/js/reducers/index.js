import { combineReducers } from 'redux';

import base from './base';
import auth from './auth';
import timeline from './timeline';

export default combineReducers({
    base,
    auth,
    timeline,
    lastAction: (state = null, action) => {
        return { type: action.type };
    }
})