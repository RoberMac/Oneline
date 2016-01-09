import superagent from 'superagent';
import { Promise } from 'es6-promise';

import store from '../../utils/store';

export default (activeProviders) => {
    return new Promise((resolve, reject) => {
        ensureUserProfileLoaded(activeProviders)

        if (activeProviders.indexOf('weibo') >= 0){
            ensureWeiboEmotionsStored()
            .then(() => {
                resolve()
            })
            .catch(err => __DEV__ && console.error(err))
        } else {
            resolve()
        }
    })
}

function ensureUserProfileLoaded(activeProviders) {
    activeProviders.forEach(provider => {
        window[`profile_${provider}`] = store.get(`profile_${provider}`)
    })
}

// Ensure weibo emotions data are stored in `localStorage`
// via https://github.com/RoberMac/angular-weibo-emotify/blob/master/dist/angular-weibo-emotify.js#L20
function ensureWeiboEmotionsStored() {
    const ls = window.localStorage;
    window.emotionsData = JSON.parse(ls.getItem('weiboEmotions'));

    return new Promise((resolve, reject) => {
        if (!window.emotionsData || window.emotionsData['_v'] !== '1.0'){
            superagent
            .get('/public/dist/emotions_v1.min.json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                const data = res.body;
                if (err || !res.ok){
                    reject(err)
                    return;
                }
                if (Object.prototype.toString.call(data) !== '[object Object]'){
                    reject('`emotionsData` is not a Object')
                    return;
                }
                if (data['_v'] !== '1.0'){
                    reject('`emotionsData` is not v1.0')
                    return;
                }

                window.emotionsData = data;
                ls.setItem('weiboEmotions', JSON.stringify(data))
                resolve()
            })
        } else {
            resolve()
        }
    })
}