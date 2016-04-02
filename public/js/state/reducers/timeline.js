import Immutable from 'immutable';

import {
    FETCH_START, RECEIVE_POSTS, FETCH_FAIL,
    UPDATE_POST, UPDATE_SHOWINGS_POSTS, RESET_STATE
} from '../actions/timeline';
import { initTimelineState } from '../store/initState';

const initState = () => Immutable.fromJS(initTimelineState());

export default (state = initState(), action) => {
    switch (action.type){
        case FETCH_START:
            return state.mergeDeep({
                [action.payload.postsType]: {
                    isFetching: true,
                    isFetchFail: false
                }
            });
            break;
        case RECEIVE_POSTS:
            return state.mergeDeep({
                [action.payload.postsType]: {
                    isFetching: false,
                    unreadCount: action.payload.unreadCount
                },
                isInitLoad: false,
                showingPosts: action.payload.showingPosts,
                allPosts: action.payload.allPosts,
                timePointer: action.payload.timePointer
            });
            break;
        case FETCH_FAIL:
            return state.mergeDeep({
                [action.payload.postsType]: {
                    isFetching: false,
                    isFetchFail: true
                }
            });
            break;
        case UPDATE_POST:
            return state.merge({
                showingPosts: action.payload.showingPosts,
                allPosts: action.payload.allPosts
            });
            break;
        case UPDATE_SHOWINGS_POSTS:
            return state.merge('showingPosts', action.payload.showingPosts);
        case RESET_STATE:
            return initState();            
            break;
        default:
            return state;
    }
}
