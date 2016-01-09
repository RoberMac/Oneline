import { combineReducers } from 'redux';

import auth from './auth';
import timeline from './timeline';


export default combineReducers({
    auth,
    timeline
})