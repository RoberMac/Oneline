import { UPDATE_BASE }  from '../actions/base';
import { initBaseState } from '../store/initState';

const initState = initBaseState();

export default (state = initState, action) => {
    switch (action.type){
        case UPDATE_BASE:
            const { payload } = action;
            const keys = Object.keys(payload);

            return state.withMutations(map => {
                keys.forEach(key => map.set(key, payload[key]))
            });
            break;
        default:
            return state;
    }
}
