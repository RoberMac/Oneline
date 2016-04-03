import {
    FETCH_START, RECEIVE_POSTS, FETCH_FAIL,
    UPDATE_POST, UPDATE_SHOWINGS_POSTS, RESET_STATE
} from '../actions/timeline';
import { initTimelineState } from '../store/initState';

const initState = initTimelineState()

export default (state = initState, action) => {
    const { postsType, unreadCount, showingPosts, allPosts, timePointer } = action.payload || {};

    switch (action.type){
        case FETCH_START:
            return (
                state
                .setIn([postsType, 'isFetching'], true)
                .setIn([postsType, 'isFetchFail'], false)
            );
            break;
        case RECEIVE_POSTS:
            return state.withMutations(map => {
                map
                .setIn([postsType, 'isFetching'], false)
                .setIn([postsType, 'unreadCount'], unreadCount)
                .set('isInitLoad', false)
                .set('showingPosts', showingPosts)
                .set('allPosts', allPosts)
                .set('timePointer', timePointer)
            });
            break;
        case FETCH_FAIL:
            return (
                state
                .setIn([postsType, 'isFetching'], false)
                .setIn([postsType, 'isFetchFail'], true)
            );
            break;
        case UPDATE_POST:
            return (
                state
                .set('showingPosts', showingPosts)
                .set('allPosts', allPosts)
            );
            break;
        case UPDATE_SHOWINGS_POSTS:
            return state.set('showingPosts', showingPosts);
            break;
        case RESET_STATE:
            return initTimelineState();            
            break;
        default:
            return state;
    }
}
