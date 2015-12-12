import update from 'react-addons-update'

import { FETCH_START, RECEIVE_POSTS, FETCH_FAIL }  from '../actions/timeline';

let initialState = {
    newPosts: {
        isFetching: false,
        isFetchFail: false
    },
    oldPosts: {
        isFetching: false,
        isFetchFail: false
    },
    isInitLoad: true,
    showingPosts: [],
    allPosts: [],
    maxId: {},
    minId: {},
    timePointer: Date.now(),
    timeRange: 1800000,
};

export default (state = initialState, action) => {
    switch (action.type){
        case FETCH_START:
            return update(state, {
                [action.postsType]: {
                    isFetching: { $set: true },
                    isFetchFail: { $set: false }
                }
            })
            break;
        case RECEIVE_POSTS:
            // TODO
            return update(state, {
                [action.postsType]: {
                    isFetching: { $set: true }
                },
                isInitLoad: { $set: false },
                allPosts: { $push: action.posts },
                maxId: { $set: action.maxId },
                minId: { $set: action.minId },
                timePointer: { $set: state.timePointer - state.timeRange }
            })
            break;
        case FETCH_FAIL:
            return update(state, {
                [action.postsType]: {
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
