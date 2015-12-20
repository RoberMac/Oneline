export const FETCH_START = 'FETCH_START'
const fetchStart = (payload) => ({ type: FETCH_START, payload });

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
const postsRecive = (payload) => ({ type: RECEIVE_POSTS, payload });

export const FETCH_FAIL = 'FETCH_FAIL'
const fetchFail = (payload) => ({ type: FETCH_FAIL, payload });

export const INIT_STATE = 'INIT_STATE'
export const initState = () => ({ type: INIT_STATE });


/**
 * Fetch Posts
 *
 */
import { determineFetchFrom, fetchFromLocal, fetchFromRemote } from './helper';

export const fetchPosts = ({ postsType, isAutoFetch }) => {
    return (dispatch, getState) => {
        const { auth, timeline } = getState();

        if (timeline[postsType].isFetching) return;

        return determineFetchFrom({ postsType, isAutoFetch, ...auth, ...timeline })
        .then(({ fetchFrom, invalidProviders }) => {
            console.info(`[${postsType}] fetchFrom: ${fetchFrom}`)
            switch (fetchFrom) {
                case 'local':
                    fetchFromLocal({ postsType, ...timeline })
                    .then( newState => dispatch(postsRecive(newState)) )
                    .catch(err => console.error(err) )
                    break;
                case 'remote':
                    dispatch(fetchStart({ postsType }))

                    fetchFromRemote({ postsType, isAutoFetch, invalidProviders, ...timeline })
                    .then( newState => dispatch(postsRecive(newState)) )
                    .catch(err => {
                        console.error(err)
                        dispatch(fetchFail({ postsType }))
                    })
                    break;
            }
        })
    };
}