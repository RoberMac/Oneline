import update from 'react-addons-update'

import { FETCH_TIMELINE }  from '../actions/timeline';

let initialState = [];

export default (state = initialState, action) => {
    switch (action.type){
        case FETCH_TIMELINE:
            return update(state, {
                // TODO
            })
            break;
        default: 
            return state;
            break;
    }
}
