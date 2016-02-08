import store from 'utils/store';
import metaData from 'utils/metaData';
import { _fetch } from 'utils/api';

export default (activeProviders) => {
    return new Promise((resolve, reject) => {
        ensureUserProfileLoaded(activeProviders)

        if (activeProviders.indexOf('weibo') >= 0){
            ensureWeiboEmotionsStored()
            .then(() => resolve())
        } else {
            resolve()
        }
    })
}

function ensureUserProfileLoaded(activeProviders) {
    activeProviders.forEach(provider => {
        metaData.set(`profile_${provider}`, store.get(`profile_${provider}`))
    })
}

// Ensure weibo emotions data are stored in `localStorage`
// via https://github.com/RoberMac/angular-weibo-emotify/blob/master/dist/angular-weibo-emotify.js#L20
function ensureWeiboEmotionsStored() {
    const weiboEmotions = metaData.get('weiboEmotions');

    return new Promise((resolve, reject) => {
        if (!weiboEmotions || weiboEmotions['_v'] !== '2.0'){
            _fetch({
                method: 'GET',
                url: '/public/dist/emotions_v2.min.json'
            })
            .then(data => {
                if (Object.prototype.toString.call(data) !== '[object Object]'){
                    reject('`weiboEmotions` is not a Object')
                    return;
                }
                if (data['_v'] !== '2.0'){
                    reject('`weiboEmotions` is not v2.0')
                    return;
                }

                metaData.set('weiboEmotions', data);
                window.localStorage.setItem('weiboEmotions', JSON.stringify(data))
                resolve()
            })
            .catch(err => reject(err))
        } else {
            resolve()
        }
    })
}