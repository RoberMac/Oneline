import store from 'utils/store';
import { _fetch } from 'utils/api';
import reduxStore from 'state/store';
import { updateBase } from 'state/actions/base';

const EMOTIONS = reduxStore.getState().base.get('EMOTIONS');

const ensureUserProfileLoaded = activeProviders => {
    const PROFILE = {};

    activeProviders.forEach(provider => {
        PROFILE[provider] = store.get(`profile_${provider}`);
    });

    reduxStore.dispatch(updateBase({ PROFILE }));
};

// Ensure weibo emotions data are stored in `localStorage`
// via https://github.com/RoberMac/angular-weibo-emotify/blob/master/dist/angular-weibo-emotify.js#L20
const ensureWeiboEmotionsStored = () => {
    const weiboEmotions = EMOTIONS.weibo;

    return new Promise((resolve, reject) => {
        if (!weiboEmotions || weiboEmotions._v !== '2.0') {
            _fetch({
                method: 'GET',
                url: '/public/emotions/v2.min.json',
            })
            .then(data => {
                if (Object.prototype.toString.call(data) !== '[object Object]') {
                    reject('`weiboEmotions` is not a Object');
                    return;
                }
                if (data._v !== '2.0') {
                    reject('`weiboEmotions` is not v2.0');
                    return;
                }

                reduxStore.dispatch(updateBase({ EMOTIONS: { weibo: data } }));
                window.localStorage.setItem('weiboEmotions', JSON.stringify(data));
                resolve();
            })
            .catch(err => reject(err));
        } else {
            resolve();
        }
    });
};

export default (activeProviders) => new Promise(resolve => {
    ensureUserProfileLoaded(activeProviders);

    if (~activeProviders.indexOf('weibo')) {
        ensureWeiboEmotionsStored().then(() => resolve());
    } else {
        resolve();
    }
});
