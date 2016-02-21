import update from 'react-addons-update'

import { UPDATE_BASE }  from '../actions/base';
import { initBaseState } from '../store/initState';

const initState = initBaseState();
const convertPayload = (payload) => {
    let newPayload = {};

    Object.keys(payload).forEach(key => {
        newPayload[key] = { $set: payload[key] }
    });

    return newPayload;
};

export default (state = initState, action) => {
    switch (action.type){
        case UPDATE_BASE:
            return update(state, convertPayload(action.payload))
            break;
        default:
            return state;
    }
}
