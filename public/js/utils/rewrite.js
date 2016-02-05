import update from 'react-addons-update';

import metaData from 'utils/metaData';

export const rewriteMediaLink = ({ type, provider, data }) => {
    __DEV__ && console.time('[rewriteMediaLink]')

    if (provider === 'weibo' || !metaData.get('isBlocked')) return data;

    const _HOST = __DEV__ ? 'http://127.0.0.1:8080' : window.location.origin;
    const PREFIX = `${_HOST}/media`;
    const REWRITER = {
        twitter: str => {
            return str.replace(
                /(https?:\/\/[\w|\-]+?\.twimg\.com[^"]*?)/g,
                `${PREFIX}?src=$1`
            );
        },
        instagram: str => {
            return str.replace(
                // via http://rubular.com/r/bA7feGqWSK
                /(https?:\/\/[\w|\-]+?\.(akamaihd|fbcdn|cdninstagram|instagram)\.(net|com)[^"]*?\.(gif|png|jpg|jpeg|mp4|webp))/g,
                `${PREFIX}?src=$1`
            );
        },
        weibo: str => {
            return str.replace(
                /(https?:\/\/[\w|\-]+?\.sinaimg.cn[^"]*?\.(gif|png|jpg|jpeg|mp4|webp))/g,
                `${PREFIX}?src=$1`
            );
        }
    }

    let rewritedData;
    switch (type) {
        case 'sharers':
        case 'post':
            rewritedData = JSON.parse(REWRITER[provider](JSON.stringify(data)))
            break;
        default:
            __DEV__ && console.error(`invalid type: ${type}`)
            throw `invalid type: ${type}`;
            break;
    }

    __DEV__ && console.timeEnd('[rewriteMediaLink]')

    return rewritedData;
};