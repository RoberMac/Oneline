import update from 'react-addons-update';

import {
    FETCH_START, RECEIVE_POSTS, FETCH_FAIL,
    UPDATE_POST, UPDATE_SHOWINGS_POSTS, RESET_STATE
}  from '../actions/timeline';
import { initTimelineState } from '../store/initState';

const initState = initTimelineState();

export default (state = initState, action) => {
    switch (action.type){
        case FETCH_START:
            return update(state, {
                [action.payload.postsType]: {
                    isFetching: { $set: true },
                    isFetchFail: { $set: false }
                }
            })
            break;
        case RECEIVE_POSTS:
            return update(state, {
                [action.payload.postsType]: {
                    isFetching: { $set: false },
                    unreadCount: { $set: action.payload.unreadCount }
                },
                isInitLoad: { $set: false },
                showingPosts: { $set: action.payload.showingPosts },
                allPosts: { $set: action.payload.allPosts },
                timePointer: { $set: action.payload.timePointer }
            })
            break;
        case FETCH_FAIL:
            return update(state, {
                [action.payload.postsType]: {
                    isFetching: { $set: false },
                    isFetchFail: { $set: true }
                }
            })
            break;
        case UPDATE_POST:
            return update(state, {
                showingPosts: { $set: action.payload.showingPosts },
                allPosts: { $set: action.payload.allPosts }
            })
            break;
        case UPDATE_SHOWINGS_POSTS:
            return update(state, {
                showingPosts: { $set: action.payload.showingPosts }
            })
        case RESET_STATE:
            return initTimelineState();            
            break;
        default:
            return state;
    }
}
