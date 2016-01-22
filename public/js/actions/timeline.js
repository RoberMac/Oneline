/**
 * Reset Timeline State
 *
 */
export const RESET_STATE = 'RESET_STATE';
export const resetState = () => ({ type: RESET_STATE });

/**
 * Fetch Posts
 *
 */
import { determineFetchFrom, fetchFromLocal, fetchFromRemote } from './helper';

export const FETCH_START = 'FETCH_START';
const fetchStart = (payload) => ({ type: FETCH_START, payload });

export const RECEIVE_POSTS = 'RECEIVE_POSTS';
const postsRecive = (payload) => ({ type: RECEIVE_POSTS, payload });

export const FETCH_FAIL = 'FETCH_FAIL';
const fetchFail = (payload) => ({ type: FETCH_FAIL, payload });

export const fetchPosts = ({ postsType, isAutoFetch }) => {
    return (dispatch, getState) => {
        const { auth, timeline } = getState();

        if (timeline[postsType].isFetching) return;

        return determineFetchFrom({ postsType, isAutoFetch, ...auth, ...timeline })
        .then(({ fetchFrom, invalidProviders }) => {
            __DEV__ && console.info(`[${postsType}: fetchFrom] ${fetchFrom}`)
            switch (fetchFrom) {
                case 'local':
                    fetchFromLocal({ postsType, ...timeline })
                    .then( newState => dispatch(postsRecive(newState)) )
                    .catch(err => {
                        throw err
                    })
                    break;
                case 'remote':
                    dispatch(fetchStart({ postsType }))

                    return fetchFromRemote({ postsType, isAutoFetch, invalidProviders, ...timeline })
                    .then( newState => dispatch(postsRecive(newState)) )
                    .catch(err => {
                        dispatch(fetchFail({ postsType }))
                        throw err
                    })
                    break;
            }
        })
    };
}

/**
 * Manipulate (Single) Post
 *
 */
import update from 'react-addons-update';

export const UPDATE_POST = 'UPDATE_POST';
export const updatePost = (newPost) => {
    const id = newPost.id_str;

    return (dispatch, getState) => {
        __DEV__ && console.time(`[updatePost: ${id}]`)

        const { showingPosts, allPosts } = getState().timeline;
        const newShowingPosts = showingPosts.map(updatePostIfFound);
        const newAllPosts = allPosts.posts.map(updatePostIfFound);

        dispatch({
            type: UPDATE_POST,
            payload: {
                showingPosts: newShowingPosts,
                allPosts: update(allPosts, {
                    posts: { $set: newAllPosts }
                })
            }
        })

        __DEV__ && console.timeEnd(`[updatePost: ${id}]`)
    };

    function updatePostIfFound(item) {
        const nestPostType = item.retweet && 'retweet' || item.quote && 'quote';
        const postId = item.id_str;
        const nestPostId = nestPostType && item[nestPostType].id_str;

        return (
            id === postId
                ? update(item, initUpdateCommands(newPost))
            : id === nestPostId
                ? update(item, {
                    [nestPostType]: initUpdateCommands(newPost)
                })
            : item
        );
    }
}
export const deletePost = ({ id }) => {
    return (dispatch, getState) => {
        __DEV__ && console.time(`[deletePost: ${id}]`)

        const { showingPosts, allPosts } = getState().timeline;
        const newShowingPosts = showingPosts.filter(deletePostIfFound);
        const newAllPosts = allPosts.posts.filter(deletePostIfFound);

        dispatch({
            type: UPDATE_POST,
            payload: {
                showingPosts: newShowingPosts,
                allPosts: update(allPosts, {
                    posts: { $set: newAllPosts }
                })
            }
        })

        __DEV__ && console.timeEnd(`[deletePost: ${id}]`)
    };

    function deletePostIfFound(item) {
        const postId = item.id_str;

        return postId !== id;
    }
}

function initUpdateCommands (obj){
    let cmds = {};

    Object.keys(obj).forEach(i => {
        cmds[i] = { $set: obj[i] }
    });

    return cmds;
}