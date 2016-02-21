import update from 'react-addons-update'

import { UPDATE_TOKEN }  from '../actions/auth';
import { initAuthState } from '../store/initState';

const initState = initAuthState();

export default (state = initState, action) => {
    switch (action.type){
        case UPDATE_TOKEN:
            return update(state, {
                activeProviders: { $set: action.activeProviders }
            })
            break;
        default:
            return state;
    }
}
