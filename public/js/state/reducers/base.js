import { UPDATE_BASE } from '../actions/base';
import { initBaseState } from '../store/initState';

const initState = initBaseState();

export default (state = initState, action) => {
    let payload;
    let keys;

    switch (action.type) {
        case UPDATE_BASE:
            payload = action.payload;
            keys = Object.keys(payload);

            return state.withMutations(map => {
                keys.forEach(key => map.set(key, payload[key]));
            });
        default:
            return state;
    }
};
