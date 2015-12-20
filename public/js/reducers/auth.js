import update from 'react-addons-update'

import { UPDATE_TOKEN }  from '../actions/auth';
import { initAuthState } from '../store/initState';

export default (state, action) => {
    switch (action.type){
        case UPDATE_TOKEN:
            return update(state, {
                activeProviders: { $set: action.activeProviders },
                tokenList: { $set: action.tokenList }
            })
            break;
        default: 
            return initAuthState();
            break;
    }
}
