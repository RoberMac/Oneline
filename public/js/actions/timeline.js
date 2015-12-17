export const FETCH_START = 'FETCH_START'
const fetchStart = (payload) => ({ type: FETCH_START, payload });

export const RECEIVE_POSTS = 'RECEIVE_POSTS'
const postsRecive = (payload) => ({ type: RECEIVE_POSTS, payload });

export const FETCH_FAIL = 'FETCH_FAIL'
const fetchFail = (payload) => ({ type: FETCH_FAIL, payload });

/**
 * Fetch Posts
 *
 */
import { Timeline } from '../utils/api';
import { determineFetchFrom, initShowingPosts, initAllPosts } from './helper';

export const fetchPosts = ({ postsType }) => {
    return (dispatch, getState) => {
        const { auth, timeline } = getState();
        const { activeProviders } = auth;
        const { showingPosts, allPosts, timePointer, timeRange } = timeline;

        if (timeline[postsType].isFetching) return;

        const { fetchFrom, invalidProviders } = determineFetchFrom({ postsType, activeProviders, showingPosts, allPosts })
        if (fetchFrom === 'local'){
            dispatch(postsRecive({
                postsType,
                showingPosts: initShowingPosts({ postsType, allPosts }),
                allPosts: timeline.allPosts
            }))
        } else if (fetchFrom === 'remote'){
            dispatch(fetchStart({ postsType }))

            Timeline
            .get({})
            .then(res => {
                let { data, maxId, maxDate, minId, minDate } = res.body;

                const newAllPosts = {
                    posts: allPosts.posts.concat(data),
                    maxId: postsType === 'newPosts' ? maxId : allPosts.maxId,
                    maxDate: postsType === 'newPosts' ? maxDate : allPosts.maxDate,
                    minId: postsType === 'newPosts' ? minId : allPosts.minId,
                    minDate: postsType === 'newPosts' ? minDate : allPosts.minDate
                };

                dispatch(postsRecive({
                    postsType,
                    showingPosts: newAllPosts,
                    allPosts: newAllPosts,
                }))
            })
            .catch(err => {
                console.error('FETCH_FAIL', err)
                dispatch(fetchFail({ postsType }))
            })
        }
    };
}