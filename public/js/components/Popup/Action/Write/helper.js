/* eslint no-control-regex: 0 */
import assign from 'object.assign';

import store from 'utils/store';
import { Action, Media } from 'utils/api';
import { isTwitter as _isTwitter, isWeibo as _isWeibo } from 'utils/detect';
import reduxStore from 'state/store';
import { updatePost } from 'state/actions/timeline';
import { UPDATE_BASE } from 'state/actions/base';

/**
 * Mention
 *
 */
const MENTIONS_REGEX = {
    twitter: /(|\s)*@([\u4e00-\u9fa5\w-]*)$/, // 可匹配中文
    weibo: /(|\s)*@([\u4e00-\u9fa5\w-]*)$/,
};
// State Handing
let MENTIONS = reduxStore.getState().base.get('MENTIONS');
reduxStore.subscribe(() => {
    const { base, lastAction: { type } } = reduxStore.getState();

    if (type !== UPDATE_BASE) return;

    MENTIONS = base.get('MENTIONS');
});
export const extractMentions = ({ status, provider }) => {
    const isTwitter = _isTwitter(provider);
    let mentionUser = status.match(MENTIONS_REGEX[provider]);

    if (mentionUser) {
        mentionUser = mentionUser[2].trim().toLowerCase();
        return (
            MENTIONS[provider]
            .filter(isTwitter
                ? item => (
                    Object.keys(item)
                    .some(key => item[key].toLowerCase().indexOf(mentionUser) >= 0)
                )
                : item => item.toLowerCase().indexOf(mentionUser) >= 0
            )
            .slice(0, 100)
        );
    }

    return [];
};
/**
 * UI
 *
 */
export const isLeftPopup = () => {
    const statusElem = document.querySelector('textarea');
    const mirror = document.querySelector('.write__textarea span');
    const _start = statusElem.selectionStart;
    const _width = statusElem.offsetWidth - 10;

    mirror.innerHTML = statusElem.value.substr(0, _start).replace(/\n$/, '\n\u0001');

    const _rects = mirror.getClientRects();
    const _lastRect = _rects[_rects.length - 1];
    const _left = _lastRect.width;

    return _left > _width / 2;
};
export const getCountInfo = ({ action, provider, status = '' }) => {
    // Count
    let count;
    if (_isWeibo(provider)) {
        const asciiLength = (status.match(/[\x00-\x7F]+/g) || []).length;
        const nonAsciiLength = status.length - asciiLength;

        count = nonAsciiLength + Math.round(asciiLength / 2);
    } else {
        count = status.length;
    }
    // isOverLimitCount
    const limitCount = action === 'quote' && _isTwitter(provider) ? 116 : 140;
    const isOverLimitCount = count > limitCount;

    return { count, isOverLimitCount };
};
/**
 * Status
 *
 */
export const removeText = (regex) => {
    const statusElem = document.querySelector('textarea');
    let _start = statusElem.selectionStart;

    const _start_str = statusElem.value.slice(0, _start);
    const _end_str = statusElem.value.slice(_start);

    statusElem.value = _start_str.replace(regex, '') + _end_str;

    _start -= 1;
    statusElem.setSelectionRange(_start, _start);

    if (statusElem.value.length === 1) {
        statusElem.value = '';
    }
};
export const insertText = (text) => {
    const statusElem = document.querySelector('textarea');
    const _start = statusElem.selectionStart;
    const _end = statusElem.selectionEnd;
    const _after = _start + text.length;

    if (_start || _start === '0') {
        statusElem.value = (
            statusElem.value.substring(0, _start)
            + text
            + statusElem.value.substring(_end, statusElem.value.length)
        );
    } else {
        statusElem.value += text;
    }

    statusElem.setSelectionRange(_after, _after);
};
export const submitWrite = (props) => {
    const { action, provider, id } = props;
    const { status, geo, media, sensitive } = props;
    const post = props.location.state;
    const isTwitter = _isTwitter(provider);
    const isWeibo = _isWeibo(provider);
    // Init
    const params = { status };
    if (isTwitter) {
        const media_ids = media.length > 0 ? media.map(i => i.id) : undefined;
        assign(params, { geo, sensitive, media_ids });

        if (action === 'quote') {
            params.status = `${status} https://twitter.com/${post.user.screen_name}/status/${id}`;
        }
    } else if (isWeibo) {
        if (action === 'tweet') {
            assign(params, { geo });
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
                    retweeted_id_str: res.id_str,
                }));
            }
            resolve();
        })
        .catch(err => reject(err));
    });
};
export const draft = {
    get: ({ action, provider }) => store.get(`${action}_${provider}`),
    set: ({ action, provider, status }) => {
        if (action !== 'tweet') return;

        store.set(`${action}_${provider}`, status);
    },
    remove: ({ action, provider }) => store.remove(`${action}_${provider}`),
};
export const initStatus = ({ action, provider, location }) => {
    const post = location.state;
    const statusElem = document.querySelector('textarea');

    switch (action) {
        case 'tweet':
            statusElem.value = draft.get({ action, provider }) || '';
            break;
        case 'reply':
            if (_isTwitter(provider)) {
                statusElem.value = `${(
                    [`@${post.user.screen_name}`] // Post Author
                    .concat(post.text.match(/(|\s)*@([\w]+)/g) || []) // Extract from post's text
                    .map(v => v.trim()) // Trim
                    .filter((v, i, a) => a.indexOf(v) === i) // Remove Dups
                    .join(' ') // Concat
                )} `;
            }
            break;
        case 'retweet':
            if (_isWeibo(provider) && (post.retweet || post.quote)) {
                statusElem.value = `//@${post.user.screen_name}: ${post.text}`;
                statusElem.setSelectionRange(0, 0);
            }
            break;
        default:
            break;
    }
};
/**
 * Media
 *
 */
// via https://github.com/ebidel/filer.js/blob/master/src/filer.js#L137
function dataURLtoBlob(dataURL) {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
        const parts = dataURL.split(',');
        const contentType = parts[0].split(':')[1];
        const raw = decodeURIComponent(parts[1]);

        return new Blob([raw], { type: contentType });
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}
export const uploadMedia = ({ provider, file }) => new Promise((resolve, reject) => {
    // https://blog.gaya.ninja/articles/uploading-files-superagent-in-browser/
    const fd = new FormData();
    fd.append('twitterMedia', file);

    Media.upload({ provider }, fd)
    .then(res => {
        const id = res.media_id;
        resolve(id);
    })
    .catch(err => {
        reject(err);
    });
});
export const addImagePreview = ({ file }) => new Promise((resolve) => {
    const reader = new FileReader();
    const image = new Image();

    reader.onload = (e) => {
        const previewURL = URL.createObjectURL(dataURLtoBlob(e.target.result));
        image.src = previewURL;
        image.onload = () => {
            const ratio = (image.height / image.width).toFixed(5);
            resolve({ previewURL, ratio });
        };
    };

    reader.readAsDataURL(file);
});
/**
 * Live Preview
 *
 */
const initLivePreviewMedia = ({ media }) => (
    media.map(({ url, ratio }) => ({ type: 'photo', image_url: url, ratio }))
);
export const initLivePreview = ({ type, provider, status, media, livePreviewPost, post }) => {
    if (type === 'reply') return {};

    const newLivePreviewPost = {};

    // Common (Outside Post)
    const { created_at, user } = livePreviewPost; // Restore from previous `livePreviewPost`
    assign(newLivePreviewPost, {
        provider,
        type,
        created_at: created_at || Date.now(),
        text: status,
        user: user || reduxStore.getState().base.get('PROFILE')[provider],
        media: initLivePreviewMedia({ media }),
    });
    // Retweet / Quote (Inside Post)
    switch (type) {
        case 'retweet':
        case 'quote':
            assign(newLivePreviewPost, {
                [type]: _isWeibo(provider) && post[type] || post,
            });
            break;
        default:
            break;
    }

    return newLivePreviewPost;
};
