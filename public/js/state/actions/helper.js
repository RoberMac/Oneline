// Helpers
import store from 'utils/store';
import { Timeline } from 'utils/api';
import { isTwitter as _isTwitter, isWeibo as _isWeibo } from 'utils/detect';
import reduxStore from 'state/store';
import { updateBase } from 'state/actions/base';
const arrayUnique = {
    // via http://jszen.com/best-way-to-get-unique-values-of-an-array-in-javascript.7.html
    literal: (a) => {
        var n = {},r=[];
        for(var i = 0; i < a.length; i++) 
        {
            if (!n[a[i]]) 
            {
                n[a[i]] = true; 
                r.push(a[i]); 
            }
        }
        return r;
    },
    object: (a) => {
        var flags = [], output = [], l = a.length, i;
        for (i = 0; i < l; i++) {
            if(flags[a[i].s]) continue;

            flags[a[i].s] = true;

            output.push(a[i]);
        }
        return output;
    }
};

// Exports
export const determineFetchFrom = ({
    postsType,
    isAutoFetch,

    activeProviders,

    newPosts,
    allPosts,
    timePointer,
    timeRange
}) => {

    return new Promise((resolve, reject) => {
        let fetchFrom, invalidProviders;

        switch (postsType) {
            case 'newPosts':
                const hasNewPostsInLocal = newPosts.get('unreadCount') > 0;
                const isFetchFromLocal = hasNewPostsInLocal && !isAutoFetch;

                fetchFrom = isFetchFromLocal ? 'local' : 'remote';
                invalidProviders = isFetchFromLocal ? [] : activeProviders;
                break;
            case 'oldPosts':
                invalidProviders = activeProviders.filter(provider => {
                    const minDate = allPosts.getIn(['minDate', provider]);
                    return timePointer - minDate < timeRange;
                });
                fetchFrom = invalidProviders.length <= 0 ? 'local' : 'remote';
                break;
        }

        resolve({ fetchFrom, invalidProviders });
    })
}

export const fetchFromLocal = ({ postsType, showingPosts, allPosts, timePointer, timeRange }) => {
    return new Promise((resolve, reject) => {
        const isFetchNewPosts = postsType === 'newPosts';
        const { newUnreadCount, newShowingPosts, newTimePointer } = (
            isFetchNewPosts
                ? extractFreshPosts({ allPosts, timeRange })
            : extractOldPosts({ showingPosts, allPosts, timePointer, timeRange })
        );

        resolve({
            postsType,
            unreadCount: newUnreadCount,
            showingPosts: newShowingPosts,
            allPosts,
            timePointer: newTimePointer
        })

        isFetchNewPosts ? setTitleUnreadCount(newUnreadCount) : null
    })
}

export const fetchFromRemote = ({
    postsType,
    isAutoFetch,

    invalidProviders,

    newPosts,
    isInitLoad,
    showingPosts,
    allPosts,
    timePointer,
    timeRange
}) => {

    return new Promise((resolve, reject) => {
        const _posts = allPosts.get('posts');
        const _maxId = allPosts.get('maxId');
        const _maxDate = allPosts.get('maxDate');
        const _minId = allPosts.get('minId');
        const _minDate = allPosts.get('minDate');
        const unreadCount = newPosts.get('unreadCount');
        const isFetchNewPosts = postsType === 'newPosts';

        Timeline
        .get({ id: isInitLoad ? null : getQueryIdStr({ isFetchNewPosts, invalidProviders, allPosts }) })
        .then(res => {
            const newRemotePosts = res.data;

            // Reject for Wrong Response
            if (!newRemotePosts) {
                reject(new Error('[FetchFail]: WTF Responses?'))
                return;
            } else if (newRemotePosts && newRemotePosts.length <= 0) {
                if (!isFetchNewPosts){
                    reject(new Error('[FetchFail]: No More Posts'))
                } else {
                    resolve({ postsType, unreadCount, showingPosts, allPosts, timePointer })
                }
                return;
            }

            // Init Response Data
            const { maxId, maxDate } = isFetchNewPosts || isInitLoad ? res : {};
            const { minId, minDate } = !isFetchNewPosts || isInitLoad ? res : {};
            const newAllPosts = allPosts.merge({
                posts: _posts.concat(newRemotePosts),
                maxId: maxId ? _maxId.merge(maxId) : _maxId,
                maxDate: maxDate ? _maxDate.merge(maxDate) : _maxDate,
                minId: minId ? _minId.merge(minId) : _minId,
                minDate: minDate ? _minDate.merge(minDate) : _minDate
            });

            // Store and dispatch
            if (isAutoFetch){
                const newUnreadCount = unreadCount + newRemotePosts.length;
                resolve({
                    postsType,
                    unreadCount: newUnreadCount,
                    showingPosts,
                    allPosts: newAllPosts,
                    timePointer
                })

                setTitleUnreadCount(newUnreadCount)
            } else {
                const { newUnreadCount, newShowingPosts, newTimePointer } = isFetchNewPosts
                    ? extractFreshPosts({ allPosts: newAllPosts, timeRange })
                : extractOldPosts({ showingPosts, allPosts: newAllPosts, timePointer, timeRange });

                resolve({
                    postsType,
                    unreadCount: newUnreadCount,
                    showingPosts: newShowingPosts,
                    allPosts: newAllPosts,
                    timePointer: newTimePointer
                })

                isFetchNewPosts ? setTitleUnreadCount(newUnreadCount) : null
            }

            // Always record mentions in posts
            recordMentions({ providers: invalidProviders, posts: newRemotePosts })
        })
        .catch(err => {
            reject(err)
        })
    })
}


// 提取最新 30 分鐘內的貼文
function extractFreshPosts({ allPosts, timeRange }) {
    const NOW = Date.now();

    return {
        newUnreadCount: 0,
        newShowingPosts: allPosts.get('posts').filter(post => NOW - post.created_at < timeRange),
        newTimePointer: NOW - timeRange,
    };
}
// 提取下一個（非空） 30 分鐘內的貼文
function extractOldPosts({ showingPosts, allPosts, timePointer, timeRange }) {
    const posts = allPosts.get('posts');
    let isEmpty = true;
    let newShowingPosts = [];
    let newTimePointer = timePointer;

    while (isEmpty){
        newShowingPosts = posts.filter(post => {
            const timeDiff = newTimePointer - post.created_at;

            return 0 < timeDiff && timeDiff <= timeRange;
        });

        newTimePointer -= timeRange;

        if (newShowingPosts.length > 0){
            isEmpty = false;
        }
    }

    newShowingPosts = (
        showingPosts
        .concat(newShowingPosts)
        .sort((a, b) => a.created_at < b.created_at ? 1 : -1)
    );
    newTimePointer = newShowingPosts.last().created_at;

    return {
        newUnreadCount: 0,
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
        const postId = allPosts.getIn([typeForLocal, provider]);

        if (!postId) return;

        queryIdStr += `${provider}_${typeForRemote}-${postId}${SUFFIX}`;
    });

    return queryIdStr;
}
// 標題未讀數提醒
function setTitleUnreadCount(count) {
    const N_MAP = {
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹'
    };
    let count_str = '';

    if (count > 0 && count % 1 === 0){
        let _count = (~~count).toString().split('');

        _count.forEach(function (numStr){
            count_str += N_MAP[numStr]
        })
    }

    document.title = '｜'+ count_str;
}
// 紀錄時間線上出現的「提及」用戶
function recordMentions({ providers, posts }) {
    __DEV__ && console.time('[recordMentions]')

    const MAX_COUNT_L1 = 2000;
    const MAX_COUNT_L2 = 3000;
    const mentionRegex = {
        twitter: /(|\s)*@([\w]+)/g,
        weibo: /(|\s)*@([\u4e00-\u9fa5\w-]+)/g
    };

    // Init
    let mentionsList = {};
    providers.forEach(provider => {
        mentionsList[provider] = store.get(`mentions_${provider}`) || []
    });
    // Extract
    posts.forEach(({ provider, text, user }) => {
        const isTwitter = _isTwitter(provider);
        const isWeibo = _isWeibo(provider);

        if (!isTwitter && !isWeibo) return;

        // Extract from post's text
        let textMentions = text.match(mentionRegex[provider]); // TODO: Extract `quote` posts
        if (textMentions){
            // Trim
            textMentions = textMentions.map(i => i.trim())

            if (isTwitter) {
                textMentions = textMentions.map( i => ({ 's': i }) )
            };

            // Limit max count (Level 1: remove twitter text mentions)
            if (mentionsList[provider].length >= MAX_COUNT_L1){
                let _len = textMentions.length;

                if (isTwitter){
                    mentionsList[provider] = mentionsList[provider].filter(item => {
                        if (!item.hasOwnProperty('u') && _len > 0) {
                            _len --
                            return false;
                        } else {
                            return true;
                        }
                    })
                } else {
                    mentionsList[provider].splice(0, _len) 
                }
            }

            mentionsList[provider] = mentionsList[provider].concat(textMentions)
        }

        // Extract from post's author
        let authorMention = user;
        mentionsList[provider].push(
            isTwitter
                ? { 's': `@${authorMention.screen_name}`, 'u': authorMention.name }
            : isWeibo
                ? `@${authorMention.screen_name}`
            : null
        )
    })

    // Store
    let MENTIONS = {};
    providers.forEach(provider => {
        // Remove Dups
        mentionsList[provider] = arrayUnique[_isTwitter(provider) ? 'object' : 'literal'](mentionsList[provider]);

        // Limit max count (Level 2: remove old items)
        if (mentionsList[provider].length >= MAX_COUNT_L2){
            let _len = mentionsList[provider].length - MAX_COUNT_L2;
            mentionsList[provider].splice(0, _len) 
        }

        store.set('mentions_' + provider, mentionsList[provider])
        MENTIONS[provider] = mentionsList[provider]
    })
    reduxStore.dispatch(updateBase({ MENTIONS }));

    __DEV__ && console.timeEnd('[recordMentions]')
}