import update from 'react-addons-update'

import { REQUEST_TIMELINE, RECEIVE_TIMELINE, ERROR_TIMELINE }  from '../actions/timeline';

let initialState = {
    isFetching: false,
    isError: false,
    items: []
};

export default (state = initialState, action) => {
    switch (action.type){
        case REQUEST_TIMELINE:
            return update(state, {
                // TODO
            })
            break;
        case RECEIVE_TIMELINE:
            // TODO
            break;
        case ERROR_TIMELINE:
            // TODO
            break;
        default: 
            return state;
            break;
    }
}
