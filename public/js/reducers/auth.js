import update from 'react-addons-update'

import { UPDATE_TOKEN }  from '../actions/auth';
import { initAuthState } from '../store/initState';

const initState = initAuthState();

export default (state = initState, action) => {
    console.log()
    switch (action.type){
        case UPDATE_TOKEN:
            return update(state, {
                activeProviders: { $set: action.activeProviders },
                tokenList: { $set: action.tokenList }
            })
            break;
        default:
            return state;
    }
}
