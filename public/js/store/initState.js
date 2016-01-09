import { getActiveProviders } from '../utils/tokenHelper';


export const initAuthState = () => {
    return {
        providers: ['twitter', 'instagram', 'weibo'],
        activeProviders: getActiveProviders(),
        tokenList: localStorage.getItem('tokenList')
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