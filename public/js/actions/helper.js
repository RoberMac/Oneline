import { Promise } from 'es6-promise';

import { Timeline } from '../utils/api';

export const determineFetchFrom = ({
    postsType,
    activeProviders,
    newPosts,
    allPosts,
    timePointer,
    timeRange
}) => {

    let fetchFrom, invalidProviders;

    switch (postsType) {
        case 'newPosts':
            const hasNewPostsInLocal = newPosts.unreadCount > 0;
            fetchFrom = hasNewPostsInLocal ? 'local' : 'remote';
            invalidProviders = hasNewPostsInLocal ? [] : activeProviders;
            break;
        case 'oldPosts':
            invalidProviders = activeProviders.filter(
                provider => timePointer - allPosts.minDate[provider] < timeRange
            );
            fetchFrom = invalidProviders.length <= 0 ? 'local' : 'remote';
            break;
    }

    return { fetchFrom, invalidProviders };
}

export const fetchFromLocal = ({ postsType, allPosts, timePointer, timeRange }) => {
    return new Promise((resolve, reject) => {
        const { newShowingPosts, newTimePointer } = postsType === 'newPosts'
            ? extractFreshPosts({ allPosts, timeRange })
        : extractOldPosts({ allPosts, timePointer, timeRange });

        resolve({
            postsType,
            showingPosts: newShowingPosts,
            allPosts,
            timePointer: newTimePointer
        })
    })
}

export const fetchFromRemote = ({
    postsType,
    isInitLoad,
    allPosts,
    timePointer,
    timeRange,
    invalidProviders
}) => {

    return new Promise((resolve, reject) => {
        const isFetchNewPosts = postsType === 'newPosts';

        Timeline
        .get({ id: isInitLoad ? null : getQueryIdStr({ isFetchNewPosts, invalidProviders, allPosts }) })
        .then(res => {
            const { maxId, maxDate } = isFetchNewPosts || isInitLoad ? res.body : allPosts;
            const { minId, minDate } = !isFetchNewPosts || isInitLoad ? res.body : allPosts;
            const newAllPosts = {
                posts: allPosts.posts.concat(res.body.data),
                maxId,
                maxDate,
                minId,
                minDate
            };
            const { newShowingPosts, newTimePointer } = isFetchNewPosts
                ? extractFreshPosts({ allPosts: newAllPosts, timeRange })
            : extractOldPosts({ allPosts: newAllPosts, timePointer, timeRange });

            resolve({
                postsType,
                showingPosts: newShowingPosts,
                allPosts: newAllPosts,
                timePointer: newTimePointer
            })
        })
        .catch(err => {
            console.error('FETCH_FAIL', err)
            reject(err)
        })
    })
}

/**
 * Helepr
 *
 */
// 提取最新 30 分鐘內的貼文
function extractFreshPosts({ allPosts, timeRange }) {
    const NOW = Date.now();

    // TODO: updateOldPostsCount

    return {
        newShowingPosts: {
            posts: allPosts.posts.filter(post => NOW - post.created_at < timeRange)
        },
        newTimePointer: NOW
    };
}
// 提取下一個（非空） 30 分鐘內的貼文
function extractOldPosts({ allPosts, timePointer, timeRange }) {
    let isEmpty = true;
    let newShowingsPosts = { posts: [] };
    let newTimePointer = timePointer;

    while (isEmpty){
        newShowingsPosts.posts = allPosts.posts.filter(posts => {
            var timeDiff = timePointer - posts.created_at;

            return 0 < timeDiff && timeDiff <= timeRange;;
        })

        newTimePointer -= timeRange

        if (newShowingsPosts.posts.length > 0){
            isEmpty = false
        }
    }

    // TODO: updateOldPostsCount

    return {
        newShowingPosts,
        newTimePointer
    };
}
// 向後端獲取貼文的查詢字段
function getQueryIdStr({ isFetchNewPosts, invalidProviders, allPosts }) {
    let [typeForLocal, typeForRemote] = isFetchNewPosts ? ['maxId', 'minId'] : ['minId', 'maxId'];
    let queryIdStr = '';

    invalidProviders.forEach((provider, index) => {
        const SUFFIX = index === invalidProviders.length - 1 ? '' : ',';

        queryIdStr += `${provider}_${typeForRemote}-${allPosts[typeForLocal][provider]}${SUFFIX}`;
    })

    return queryIdStr;
}
// function sortPosts(posts) {
//     return posts.sort((a, b) => a.created_at < b.created_at ? 1 : -1)
// }