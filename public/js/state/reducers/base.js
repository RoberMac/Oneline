import Immutable from 'immutable';

import { UPDATE_BASE }  from '../actions/base';
import { initBaseState } from '../store/initState';

const initState = Immutable.Map(initBaseState());

export default (state = initState, action) => {
    switch (action.type){
        case UPDATE_BASE:
            return state.merge(action.payload);
            break;
        default:
            return state;
    }
}
