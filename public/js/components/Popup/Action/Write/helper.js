import store from '../../../../utils/store';

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
        mentionUser = mentionUser[2].trim();
        return mentionsList
                .filter(provider === 'twitter'
                    ? item => Object.keys(item).some(key => item[key].indexOf(mentionUser) >= 0)
                    : item => item.indexOf(mentionUser) >= 0
                )
                .slice(0, 100);
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