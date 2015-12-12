import { Timeline } from '../utils/api';


export const FETCH_START = 'FETCH_START'
const fetchStart = (postsType) => ({ type: FETCH_START, postsType });

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
const postsRecive = (posts) => ({ type: RECEIVE_POSTS, posts });

export const FETCH_FAIL = 'FETCH_FAIL'
const fetchFail = (postsType) => ({ type: RECEIVE_POSTS, postsType });


export const fetchPosts = ({ postsType }) => {
    return (dispatch, getState) => {
        dispatch(fetchStart(postsType))

        Timeline
        .get()
        .then(res => {
            // posts, min_ids, max_ids
            dispatch(postsRecive(postsType))
        })
        .catch(err => {
            dispatch(fetchFail(postsType))
        })
    };
}