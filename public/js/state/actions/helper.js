/* eslint no-console: 0, no-use-before-define: [2, { "functions": false }] */

import assign from 'object.assign';

// Helpers
import Jump from 'utils/jump';
import { TIMELINE_SCROLL, MIN_EXTRACT_COUNT, MAX_SHOWING_COUNT } from 'utils/constants';
import store from 'utils/store';
import { Timeline } from 'utils/api';
import { isTwitter as _isTwitter, isWeibo as _isWeibo } from 'utils/detect';
import { selectExpirationDate } from 'utils/select';
import reduxStore from 'state/store';
import { updateBase } from 'state/actions/base';
const arrayUnique = {
    // via http://jszen.com/best-way-to-get-unique-values-of-an-array-in-javascript.7.html
    literal: (a) => {
        const n = {};
        const r = [];
        for (let i = 0; i < a.length; i++) {
            if (!n[a[i]]) {
                n[a[i]] = true;
                r.push(a[i]);
            }
        }
        return r;
    },
    object: (a) => {
        const flags = [];
        const output = [];
        const l = a.length;
        for (let i = 0; i < l; i++) {
            if (flags[a[i].s]) continue;

            flags[a[i].s] = true;

            output.push(a[i]);
        }
        return output;
    },
};

// Exports
export const determineFetchFrom = ({
    postsType,
    isAutoFetch,

    activeProviders,

    newPosts,
    allPosts,
    timePointer,
    timeRange,
}) => {
    return new Promise(resolve => {
        let fetchFrom;
        let invalidProviders;
        let hasNewPostsInLocal;
        let isFetchFromLocal;

        switch (postsType) {
            case 'newPosts':
                hasNewPostsInLocal = newPosts.get('unreadCount') > 0;
                isFetchFromLocal = hasNewPostsInLocal && !isAutoFetch;

                fetchFrom = isFetchFromLocal ? 'local' : 'remote';
                invalidProviders = isFetchFromLocal ? [] : activeProviders;
                break;
            case 'oldPosts':
                invalidProviders = activeProviders.filter(provider => {
                    if (provider === 'unsplash') return false;

                    const minDate = allPosts.get('minDate')[provider];
                    return timePointer - minDate < timeRange;
                });
                fetchFrom = invalidProviders.length <= 0 ? 'local' : 'remote';
                break;
            default:
                break;
        }

        resolve({ fetchFrom, invalidProviders });
    });
};

export const fetchFromLocal = ({ postsType, showingPosts, allPosts, timePointer, timeRange }) => {
    return new Promise(resolve => {
        const isFetchNewPosts = postsType === 'newPosts';
        const promiseFetch = (
            isFetchNewPosts
                ? extractFreshPosts({ allPosts, timeRange })
            : extractOldPosts({ showingPosts, allPosts, timePointer, timeRange })
        );

        promiseFetch
        .then(({ newShowingPosts, newTimePointer }) => {
            resolve({
                postsType,
                unreadCount: 0,
                showingPosts: newShowingPosts,
                allPosts,
                timePointer: newTimePointer,
            });

            isFetchNewPosts && setTitleUnreadCount(0);
        });
    });
};

export const fetchFromRemote = ({
    postsType,
    isAutoFetch,

    invalidProviders,

    newPosts,
    isInitLoad,
    showingPosts,
    allPosts,
    timePointer,
    timeRange,
}) => {
    return new Promise((resolve, reject) => {
        const unreadCount = newPosts.get('unreadCount');
        const isFetchNewPosts = postsType === 'newPosts';

        Timeline
        .get({
            id: isInitLoad ? null : getQueryIdStr({ isFetchNewPosts, invalidProviders, allPosts }),
        })
        .then(res => {
            const newRemotePosts = res.data;

            // Reject for Wrong Response
            if (!newRemotePosts) {
                reject(new Error('[FetchFail]: WTF Responses?'));
                return;
            } else if (newRemotePosts && !isFetchNewPosts && newRemotePosts.length <= 0) {
                reject(new Error('[FetchFail]: No More Posts'));
                return;
            }

            // Init Response Data
            const newAllPosts = allPosts.withMutations(map => {
                const expirationDate = selectExpirationDate();
                const { maxId, maxDate } = isFetchNewPosts || isInitLoad ? res : {};
                const { minId, minDate } = !isFetchNewPosts || isInitLoad ? res : {};

                map.set('posts', (
                    allPosts
                    .get('posts')
                    .concat(newRemotePosts)
                    .filter(i => i.created_at > expirationDate)
                    .sort((a, b) => a.created_at < b.created_at ? 1 : -1)
                ));

                maxId && map.set('maxId', assign(allPosts.get('maxId'), maxId));
                maxDate && map.set('maxDate', assign(allPosts.get('maxDate'), maxDate));
                minId && map.set('minId', assign(allPosts.get('minId'), minId));
                minDate && map.set('minDate', assign(allPosts.get('minDate'), minDate));
            });

            // Store and dispatch
            if (isAutoFetch) {
                const newUnreadCount = unreadCount + newRemotePosts.length;
                resolve({
                    postsType,
                    unreadCount: newUnreadCount,
                    showingPosts,
                    allPosts: newAllPosts,
                    timePointer,
                });

                setTitleUnreadCount(newUnreadCount);
            } else {
                const promiseFetch = (
                    isFetchNewPosts
                        ? extractFreshPosts({ allPosts: newAllPosts, timeRange })
                    : extractOldPosts({
                        showingPosts,
                        allPosts: newAllPosts,
                        timePointer,
                        timeRange,
                    })
                );

                promiseFetch
                .then(({ newShowingPosts, newTimePointer }) => {
                    resolve({
                        postsType,
                        unreadCount: 0,
                        showingPosts: newShowingPosts,
                        allPosts: newAllPosts,
                        timePointer: newTimePointer,
                    });

                    isFetchNewPosts && setTitleUnreadCount(0);
                });
            }

            // Always record mentions in posts
            recordMentions({ providers: invalidProviders, posts: newRemotePosts });
        })
        .catch(err => {
            reject(err);
        });
    });
};


function extractFreshPosts({ allPosts, timeRange }) {
    return new Promise(resolve => {
        const { newShowingPosts, newTimePointer } = extractPosts({
            allPosts,
            timePointer: Date.now(),
            timeRange,
        });

        resolve({ newShowingPosts, newTimePointer });
    });
}
function extractOldPosts({ showingPosts, allPosts, timePointer, timeRange }) {
    return new Promise(resolve => {
        const { newShowingPosts, newTimePointer } = extractPosts({
            allPosts,
            timePointer,
            timeRange,
        });

        newShowingPosts.unshift(showingPosts.pop());

        new Jump()
        .jump(TIMELINE_SCROLL.target, {
            container: TIMELINE_SCROLL.container,
            duration: TIMELINE_SCROLL.duration,
            callback: () => resolve({ newShowingPosts, newTimePointer }),
        });
    });
}
function extractPosts({ allPosts, timePointer, timeRange }) {
    const posts = allPosts.get('posts');
    const expirationDate = selectExpirationDate();

    let isEmpty = true;
    let newShowingPosts = [];
    let _timePointer = timePointer;
    const extractCurRangePosts = post => {
        const timeDiff = _timePointer - post.created_at;
        return timeDiff > 0 && timeDiff <= timeRange;
    };

    while (isEmpty) {
        newShowingPosts = newShowingPosts.concat(posts.filter(extractCurRangePosts));

        _timePointer -= timeRange;

        if (newShowingPosts.length >= MIN_EXTRACT_COUNT || _timePointer < expirationDate) {
            isEmpty = false;
        }
    }

    newShowingPosts = (
        newShowingPosts
        .slice(0, MAX_SHOWING_COUNT - 1)
        .sort((a, b) => a.created_at < b.created_at ? 1 : -1)
    );

    return {
        newShowingPosts,
        newTimePointer: newShowingPosts[newShowingPosts.length - 1].created_at,
    };
}
function getQueryIdStr({ isFetchNewPosts, invalidProviders, allPosts }) {
    const [typeForLocal, typeForRemote] = isFetchNewPosts ? ['maxId', 'minId'] : ['minId', 'maxId'];
    let queryIdStr = '';

    invalidProviders.forEach((provider, index) => {
        const SUFFIX = index === invalidProviders.length - 1 ? '' : ',';
        const postId = allPosts.get(typeForLocal)[provider];

        if (!postId) return;

        queryIdStr += `${provider}_${typeForRemote}-${postId}${SUFFIX}`;
    });

    return queryIdStr;
}
function setTitleUnreadCount(count) {
    const N_MAP = [
        '⁰',
        '¹',
        '²',
        '³',
        '⁴',
        '⁵',
        '⁶',
        '⁷',
        '⁸',
        '⁹',
    ];
    let count_str = '';

    if (count > 0 && count % 1 === 0) {
        const _count = (~~count).toString().split('');

        _count.forEach(numStr => {
            count_str += N_MAP[numStr];
        });
    }

    document.title = `｜${count_str}`;
}
function recordMentions({ providers, posts }) {
    __DEV__ && console.time('[recordMentions]');

    const MAX_COUNT_L1 = 2000;
    const MAX_COUNT_L2 = 3000;
    const mentionRegex = {
        twitter: /(|\s)*@([\w]+)/g,
        weibo: /(|\s)*@([\u4e00-\u9fa5\w-]+)/g,
    };

    // Init
    const mentionsList = {};
    providers.forEach(provider => {
        mentionsList[provider] = store.get(`mentions_${provider}`) || [];
    });
    // Extract
    posts.forEach(({ provider, text, user }) => {
        const isTwitter = _isTwitter(provider);
        const isWeibo = _isWeibo(provider);

        if (!isTwitter && !isWeibo) return;

        // Extract from post's text
        let textMentions = text.match(mentionRegex[provider]); // TODO: Extract `quote` posts
        if (textMentions) {
            // Trim
            textMentions = textMentions.map(i => i.trim());

            if (isTwitter) {
                textMentions = textMentions.map(i => ({ s: i }));
            }

            // Limit max count (Level 1: remove twitter text mentions)
            if (mentionsList[provider].length >= MAX_COUNT_L1) {
                let _len = textMentions.length;

                if (isTwitter) {
                    mentionsList[provider] = mentionsList[provider].filter(item => {
                        if (!item.hasOwnProperty('u') && _len > 0) {
                            _len --;
                            return false;
                        }
                        return true;
                    });
                } else {
                    mentionsList[provider].splice(0, _len);
                }
            }

            mentionsList[provider] = mentionsList[provider].concat(textMentions);
        }

        // Extract from post's author
        const authorMention = user;
        mentionsList[provider].push(
            isTwitter
                ? { s: `@${authorMention.screen_name}`, u: authorMention.name }
            : isWeibo
                ? `@${authorMention.screen_name}`
            : null
        );
    });

    // Store
    const MENTIONS = {};
    providers.forEach(provider => {
        // Remove Dups
        mentionsList[provider] = (
            arrayUnique[_isTwitter(provider)
                ? 'object'
            : 'literal'](mentionsList[provider])
        );

        // Limit max count (Level 2: remove old items)
        if (mentionsList[provider].length >= MAX_COUNT_L2) {
            const _len = mentionsList[provider].length - MAX_COUNT_L2;
            mentionsList[provider].splice(0, _len);
        }

        store.set(`mentions_${provider}`, mentionsList[provider]);
        MENTIONS[provider] = mentionsList[provider];
    });
    reduxStore.dispatch(updateBase({ MENTIONS }));

    __DEV__ && console.timeEnd('[recordMentions]');
}
