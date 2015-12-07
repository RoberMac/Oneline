import update from 'react-addons-update'

import { TOGGLE_AUTH, TOGGLE_REPLICANT }  from '../constants/ActionTypes';
import initialState from '../store/initialState.json';

export default (state = initialState, action) => {
    switch (action.type){
        case TOGGLE_AUTH:
            return update(state, {
                // TODO
            })
            break;
        case TOGGLE_REPLICANT:
            return update(state, {
                // TODO
            })
            break;
        default: 
            return state;
            break;
    }
}
