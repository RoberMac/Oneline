import { Promise } from 'es6-promise';
import assign from 'object.assign';

import store from '../../../../utils/store';
import { updatePost } from '../../../../actions/timeline';
import reduxStore from '../../../../store';
import { Action, Media } from '../../../../utils/api';

/**
 * Mention
 *
 */
export const extractMentions = ({ status, provider }) => {
    const mentionRegex = {
        twitter: /(|\s)*@([\u4e00-\u9fa5\w-]*)$/, // 可匹配中文
        weibo: /(|\s)*@([\u4e00-\u9fa5\w-]*)$/
    };
    let mentionUser = status.match(mentionRegex[provider]);
    if (mentionUser){
        mentionUser = mentionUser[2].trim().toLowerCase();
        return (
            window[`mentions_${provider}`]
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
    // Init
    let params = { status };
    if (isTwitter){
        const media_ids = media.length > 0 ? media.map(({ id }) => id) : undefined;
        assign(params, { geo, sensitive, media_ids })

        if (action === 'quote'){
            params.status = `${status} https://twitter.com/${post.user.screen_name}/status/${id}`
        }
    }
    else if (isWeibo){
        if (action === 'tweet'){
            assign(params, { geo })
        }
    }
    // Fire
    return new Promise((resolve, reject) => {
        Action
        .update({ action, provider, id }, { params })
        .then(res => {
            if (action === 'retweet' || action === 'quote') {
                reduxStore.dispatch(updatePost({
                    id_str: id,
                    retweeted: true,
                    retweet_count: post.retweet_count + 1,
                    retweeted_id_str: res.body.id_str
                }))
            }
            resolve()
        })
        .catch(err => reject(err))
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
        const reader = new FileReader();
        const image  = new Image();

        reader.onload = (e) => {
            const previewURL = URL.createObjectURL(dataURLtoBlob(e.target.result));
            image.src = previewURL
            image.onload = () => {
                const ratio = (image.height / image.width).toFixed(5);
                resolve({ previewURL, ratio })
            };
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
/**
 * Live Preview
 *
 */
export const initLivePreview = ({ type, provider, status, media, livePreviewPost, post }) => {
    if (type === 'reply') return {};

    const { created_at, user } = livePreviewPost;
    let newLivePreviewPost = {};

    // Common
    assign(newLivePreviewPost, {
        provider,
        type,
        created_at: created_at || Date.now(),
        text: status,
        user: user || window[`profile_${provider}`],
        media: initLivePreviewMedia({ media, provider })
    });
    // Retweet / Quote
    switch (type){
        case 'retweet':
        case 'quote':
            assign(newLivePreviewPost, {
                [type]: post
            });
            break;
    }

    return newLivePreviewPost;
}
function initLivePreviewMedia ({ media, provider }) {
    return media.map(({ url, ratio }) => ({ type: 'photo', image_url: url, ratio }));
    // TODO: Support Weibo
}

