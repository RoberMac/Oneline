import store from 'utils/store';

// Init
const _metaData = {
    weiboEmotions: store.get('weiboEmotions'),
    // profile_twitter: store.get('profile_twitter'),
    // profile_instagram: store.get('profile_instagram'),
    // profile_weibo: store.get('profile_weibo'),
    sharePage: !!window.__share_data__,
    isBlocked: window.__is_blocked__,
    isSafari: /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent)
};

export default {
    get: (key) => {
        __DEV__ && console.log(`[metaData:GET] ${key}`)
        return _metaData[key];
    },
    set: (key, value) => {
        __DEV__ && console.log(`[metaData:SET] ${key}`)
        _metaData[key] = value
    }
}