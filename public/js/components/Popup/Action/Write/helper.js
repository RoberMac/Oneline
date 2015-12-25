import { Promise } from 'es6-promise';
import assign from 'object.assign';

import store from '../../../../utils/store';
import { Action } from '../../../../utils/api'

export const extractMentions = ({ status, provider }) => {
    const mentionsList = store.get(`mentions_${provider}`) || [];
    const mentionRegex = {
        twitter: /(|\s)*@([\u4e00-\u9fa5\w-]*)$/, // 可匹配中文
        instagram: /(|\s)*@([\w\.]*)$/,
        weibo: /(|\s)*@([\u4e00-\u9fa5\w-]*)$/
    };
    const filterTwitterUser = (item) => {
        return Object.keys(item).some(key => item[key].indexOf(mentionUser) >= 0)
    };
    const filterWeiboUser = (item) => {

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
        assign(params, { geo, sensitive, media_ids: media })

        if (action === 'retweet' && status.length > 0){
            params.status = `${status} https://twitter.com/${_info[2]}/status/${id}`
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