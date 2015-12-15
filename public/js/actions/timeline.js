import { Timeline } from '../utils/api';


export const FETCH_START = 'FETCH_START'
const fetchStart = (payload) => ({ type: FETCH_START, payload });

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
const postsRecive = (payload) => ({ type: RECEIVE_POSTS, payload });

export const FETCH_FAIL = 'FETCH_FAIL'
const fetchFail = (payload) => ({ type: FETCH_FAIL, payload });


export const fetchPosts = ({ postsType }) => {
    return (dispatch, getState) => {
        dispatch(fetchStart({ postsType }))

        Timeline
        .get({})
        .then(res => {
            const { data, max_id, min_id } = res.body;
            dispatch(postsRecive({
                postsType,
                showingPosts: data,
                allPosts: data,
                max_id,
                min_id
            }))
        })
        .catch(err => {
            console.error('FETCH_FAIL', err)
            dispatch(fetchFail({ postsType }))
        })
    };
}