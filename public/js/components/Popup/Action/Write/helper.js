import { Promise } from 'es6-promise';
import assign from 'object.assign';

import store from '../../../../utils/store';
import { Action, Media } from '../../../../utils/api'

export const extractMentions = ({ status, provider }) => {
    const mentionsList = store.get(`mentions_${provider}`) || [];
    const mentionRegex = {
        twitter: /(|\s)*@([\u4e00-\u9fa5\w-]*)$/, // 可匹配中文
        instagram: /(|\s)*@([\w\.]*)$/,
        weibo: /(|\s)*@([\u4e00-\u9fa5\w-]*)$/
    };

    let mentionUser = status.match(mentionRegex[provider]);
    if (mentionUser){
        mentionUser = mentionUser[2].trim().toLowerCase();
        return (
            mentionsList
            .filter(provider === 'twitter'
                ? item => Object.keys(item).some(key => item[key].toLowerCase().indexOf(mentionUser) >= 0)
                : item => item.toLowerCase().indexOf(mentionUser) >= 0
            )
            .slice(0, 100)
        );
    } else {
        return [];
    }
};
/**
 * UI
 *
 */
export const isLeftPopup = () => {
    let statusElem = document.querySelector('textarea');
    let mirror = document.querySelector('.write__textarea span');
    let _start = statusElem.selectionStart;
    let _width = statusElem.offsetWidth - 10;

    mirror.innerHTML = statusElem.value.substr(0, _start).replace(/\n$/, '\n\u0001')

    let _rects = mirror.getClientRects();
    let _lastRect = _rects[_rects.length - 1];
    let _left = _lastRect.width;

    return _left > _width / 2;
}
export const getCountInfo = ({ actionType, provider, status }) => {
    const limitCount = actionType === 'retweet' && provider === 'twitter' ? 116 : 140;

    let count, isOverLimitCount;
    // Count
    if (provider === 'weibo'){
        let asciiLength = (status.match(/[\x00-\x7F]+/g) || []).join('').length;
        let nonAsciiLength = status.length - asciiLength;

        count = nonAsciiLength + Math.round(asciiLength / 2);
    } else {
        count = status.length;
    }
    // isOverLimitCount
    isOverLimitCount = count > limitCount ? true : false;

    return { count, isOverLimitCount }
}
/**
 * Status
 *
 */
export const removeText = (regex) => {
    const statusElem = document.querySelector('textarea');
    let _start = statusElem.selectionStart;

    const _start_str = statusElem.value.slice(0, _start);
    const _end_str = statusElem.value.slice(_start);

    statusElem.value = _start_str.replace(regex, '') + _end_str

    _start -= 1
    statusElem.setSelectionRange(_start, _start)

    if (statusElem.value.length === 1){
        statusElem.value = ''
    }
}
export const insertText = (text) => {
    const statusElem = document.querySelector('textarea');
    const _start = statusElem.selectionStart;
    const _end = statusElem.selectionEnd;
    const _after = _start + text.length;

    if (_start || _start == '0') {
        statusElem.value = statusElem.value.substring(0, _start)
            + text
            + statusElem.value.substring(_end, statusElem.value.length);
    } else {
        statusElem.value += text;
    }

    statusElem.setSelectionRange(_after, _after)
}
export const submitWrite = ({
    action,
    provider,
    id,
    post,

    status,
    mentions,
    geo,
    media,
    sensitive
}) => {

    const isTwitter = provider === 'twitter';
    const isWeibo   = provider === 'weibo';
    let params = {
        status: status
    };
    // Init
    if (isTwitter){
        assign(params, { geo, sensitive, media_ids: media.ids.length > 0 ? media.ids : undefined })

        if (action === 'quote'){
            params.status = `${status} https://twitter.com/${post.user.screen_name}/status/${id}`
        }
    }
    else if (isWeibo){
        if (action === 'tweet'){
            assign(params, { geo })
        }
    }

    return new Promise((resolve, reject) => {
        Action
        .update({ action, provider, id }, { params: params })
        .then(res => {

            // TODO
            // if (_action === 'retweet'){
            //     olUI.setActionState('retweet', _id, 'active')
            //     olUI.actionData('retweet', _id, data.id_str)

            //     if (__action === 'quote' && isTwitter){
            //         // 凍結
            //         olUI.setActionState('retweet', _id, 'frozen')
            //     } else {
            //         var count = ~~olUI.actionData('retweet', _id, null, 'count') + 1;
            //         olUI.actionData('retweet', _id, count, 'count')
            //     }
            // }
            resolve()
        })
        .catch(err => {
            reject(err)
        })
    })
}
export const draft = {
    get: ({ action, provider }) => store.get(`${action}_${provider}`),
    set: ({ action, provider, status }) => {
        if (action !== 'tweet') return;

        store.set(`${action}_${provider}`, status)
    },
    remove: ({ action, provider }) => store.remove(`${action}_${provider}`)
}
export const initStatus = ({ action, provider, id, post }) => {
    const statusElem = document.querySelector('textarea');

    switch (action){
        case 'tweet':
            statusElem.value = draft.get({ action, provider }) || '';
            break;
        case 'reply':
            if (provider === 'twitter'){
                statusElem.value = (
                    [`@${post.user.screen_name}`] // Post Author
                    .concat(post.text.match(/(|\s)*@([\w]+)/g) || []) // Extract from post's text
                    .map(v => v.trim()) // Trim
                    .filter((v, i, a) => a.indexOf(v) == i) // Remove Dups
                    .join(' ') // Concat
                ) + ' ';
            }
            break;
        case 'retweet':
            if (provider === 'weibo' && (post.retweet || post.quote)){
                statusElem.value = `//@${post.user.screen_name}: ${post.text}`;
                statusElem.setSelectionRange(0, 0)
            }
            break;
    }
}
/**
 * Media
 *
 */
export const uploadMedia = ({ provider, file }) => {
    return new Promise((resolve, reject) => {
        // https://blog.gaya.ninja/articles/uploading-files-superagent-in-browser/
        let fd = new FormData();
        fd.append('twitterMedia', file)

        //TODO: 轉推」／「引用」切換時，清空之前上傳過的圖片數據

        Media.upload({ provider }, fd)
        .then(res => {
            const id = res.body.media_id;

            resolve(id)
        })
        .catch(err => {
            reject(err)
        })

    })
}
export const addImagePreview = ({ file }) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        // let image  = new Image();

        reader.onload = function (e) {
            const previewURL = URL.createObjectURL(dataURLtoBlob(e.target.result));
            resolve(previewURL)
        }

        reader.readAsDataURL(file)
    })
}
// via https://github.com/ebidel/filer.js/blob/master/src/filer.js#L137
function dataURLtoBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);

        return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}