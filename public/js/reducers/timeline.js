import update from 'react-addons-update'

import { FETCH_START, RECEIVE_POSTS, FETCH_FAIL }  from '../actions/timeline';

let initialState = {
    newPosts: {
        isFetching: false,
        isFetchFail: false,
        unreadCount: 0
    },
    oldPosts: {
        isFetching: false,
        isFetchFail: false,
        unreadCount: 0
    },
    isInitLoad: true,
    showingPosts: {
        posts: [],
        maxId: {},
        maxDate: {},
        minId: {},
        minDate: {}
    },
    allPosts: {
        posts: [],
        maxId: {},
        maxDate: {},
        minId: {},
        minDate: {}
    },
    timePointer: Date.now(), // !
    timeRange: 1800000,
};

export default (state = initialState, action) => {
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
                [action.payload.postsType]: { isFetching: { $set: false } },
                isInitLoad: { $set: false },
                showingPosts: { $set: action.payload.showingPosts },
                allPosts: { $set: action.payload.allPosts },
                timePointer: { $set: state.timePointer - state.timeRange }
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
        default: 
            return state;
            break;
    }
}
