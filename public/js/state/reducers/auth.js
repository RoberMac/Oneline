import { UPDATE_TOKEN } from '../actions/auth';
import { initAuthState } from '../store/initState';

const initState = initAuthState();

export default (state = initState, action) => {
    switch (action.type) {
        case UPDATE_TOKEN:
            return state.set('activeProviders', action.payload.activeProviders);
        default:
            return state;
    }
};
