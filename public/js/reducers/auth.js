import update from 'react-addons-update'

import { ADD_TOKEN, REMOVE_TOKEN, REPLACE_TOKEN_LIST }  from '../actions/auth';
import { getActiveProviders } from '../utils/tokenHelper';

let initialState = {
    providers: ['twitter', 'instagram', 'weibo'],
    activeProviders: getActiveProviders(),
    tokenList: localStorage.getItem('tokenList')
};


export default (state = initialState, action) => {
    switch (action.type){
        case ADD_TOKEN:
        case REMOVE_TOKEN:
        case REPLACE_TOKEN_LIST:
            return update(state, {
                activeProviders: { $set: action.activeProviders },
                tokenList: { $set: action.tokenList }
            })
            break;
        default: 
            return state;
            break;
    }
}
