import update from 'react-addons-update'

import { TOGGLE_AUTH }  from '../actions/auth';

let initialState = {
    providers: ['twitter', 'instagram', 'weibo'],
    activeProviders: ['twitter', 'weibo']
};

export default (state = initialState, action) => {
    switch (action.type){
        case TOGGLE_AUTH:
            return update(state, {
                // TODO
            })
            break;
        default: 
            return state;
            break;
    }
}
