import store from 'utils/store';
import { getActiveProviders } from 'utils/tokenHelper';

export const initAuthState = () => {
    return {
        providers: ['twitter', 'instagram', 'weibo', 'unsplash'],
        activeProviders: getActiveProviders()
    };
}

export const initTimelineState = () => {
    const timePointer = Date.now();
    const timeRange = 1800000;

    return {
        newPosts: {
            isFetching: false,
            isFetchFail: false,
            unreadCount: 0,
            fetchFrom: 'remote',
        },
        oldPosts: {
            isFetching: false,
            isFetchFail: false,
            unreadCount: 0,
            fetchFrom: 'remote',
        },
        isInitLoad: true,
        showingPosts: [],
        allPosts: {
            posts: [],
            maxId: {},
            maxDate: {},
            minId: {},
            minDate: {}
        },
        timePointer,
        timeRange
    };
}

export const initBaseState = () => {
    return {
        SHARE_PAGE: !!window.__share_data__,
        BLOCKED: !!window.__is_blocked__,
        SAFARI: /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent),
        EMOTIONS: {
            weibo: store.get('weiboEmotions')
        },
        MENTIONS: {
            // twitter,
            // instagram,
            // weibo
        },
        PROFILE: {
            // twitter,
            // instagram,
            // weibo
        }
    };
}