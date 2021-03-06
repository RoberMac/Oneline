import { Map } from 'immutable';

import store from 'utils/store';
import { getActiveProviders } from 'utils/tokenHelper';

export const initAuthState = () => {
    return Map({
        providers: ['twitter', 'weibo', 'unsplash', 'instagram'],
        activeProviders: getActiveProviders(),
    });
};
export const initTimelineState = () => {
    const timePointer = Date.now();
    const timeRange = 1800000;

    return Map({
        newPosts: Map({
            isFetching: false,
            isFetchFail: false,
            unreadCount: 0,
            fetchFrom: 'remote',
        }),
        oldPosts: Map({
            isFetching: false,
            isFetchFail: false,
            unreadCount: 0,
            fetchFrom: 'remote',
        }),
        isInitLoad: true,
        showingPosts: [], // <- mutable
        allPosts: Map({
            posts: [],
            maxId: {},
            maxDate: {},
            minId: {},
            minDate: {},
        }),
        timePointer,
        timeRange,
    });
};
export const initBaseState = () => {
    return Map({
        SHARE_PAGE: !!window.__share_data__,
        BLOCKED: !!window.__is_blocked__,
        SAFARI: /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent),
        EMOTIONS: {
            weibo: store.get('weiboEmotions'),
        },
        MENTIONS: {
            // twitter,
            // weibo
        },
        PROFILE: {
            // twitter,
            // weibo
        },
    });
};
