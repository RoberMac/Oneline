/* eslint prefer-template: 0 */

import xssFilters from 'xss-filters';

// Helpers
import reduxStore from 'state/store';
import { UPDATE_BASE } from 'state/actions/base';

// State Handing
const _state = reduxStore.getState();
let SHARE_PAGE = _state.base.get('SHARE_PAGE');
let EMOTIONS = _state.base.get('EMOTIONS');
reduxStore.subscribe(() => {
    const { base, lastAction: { type } } = reduxStore.getState();

    if (type !== UPDATE_BASE) return;

    SHARE_PAGE = base.get('SHARE_PAGE');
    EMOTIONS = base.get('EMOTIONS');
});

// Constants
const USER_PREFIX = {
    twitter: SHARE_PAGE ? '//twitter.com/' : '/home/twitter/user/',
    instagram: SHARE_PAGE ? '//instagram.com/' : '/home/instagram/user/',
    weibo: SHARE_PAGE ? '//weibo.com/n/' : '/home/weibo/user/',
};
const TAG_PREFIX = {
    twitter: SHARE_PAGE ? '//twitter.com/search?q=%23' : '/home/twitter/tags/',
    instagram: SHARE_PAGE ? '//instagram.com/explore/tags/' : '/home/instagram/tags/',
    weibo: SHARE_PAGE ? 'http://huati.weibo.com/k/' : '/home/weibo/tags/',
    unsplash: SHARE_PAGE ? '//unsplash.com/search?utf8=✓&keyword=' : '/home/unsplash/tags/',
};
const TARGET_ATTR = SHARE_PAGE ? 'target="_blank"' : '';
const MATCH_ZERO_WIDTH_CHAR = /[\u200B-\u200F\u202C\uFEFF]/g;
const MATCH_MENTION = {
    twitter: /(|\s)*@([\w]+)/g,
    instagram: /(|\s)*@([\w\.]+)/g,
    weibo: /(|\s)*@([\u4e00-\u9fa5\w-]+)/g,
};
const MATCH_LINK = new RegExp([
    '(?:https?:\/\/)+',
    '(?![^\\s]*?")',
    '([\\w.,@?!^=%&amp;:\/~+#-]*[\\w@?!^=%&amp;\/~+#-])?',
].join(''), 'gi');
const MATCH_SUFFIX_LINK = new RegExp([
    '(?:https?:\/\/)+',
    '(?![^\\s]*?")',
    '([\\w.,@?!^=%&amp;:\/~+#-]*[\\w@?!^=%&amp;\/~+#-])?$',
].join(''), 'gi');
const MATCH_TAG = new RegExp([
    '(^|\\s)*',
    '[#＃]',
    '([',
    '^#\\s!?@$%^&*()+\\-=\\[\\]{};\':"|,.<>\/\\\\',
    '\u3002\uff1f\uff01\uff0c\u3001\uff1b', // 。？！，、；
    '\uff1a\u300c\u300d\u300e\u300f\u2018', // ：「」『』‘
    '\u2019\u201c\u201D\uff08\uff09\u3014', // ’“”（）〔
    '\u3015\u3010\u3011\u2014\u2026\u2013', // 〕【】—…–
    '\uff0e\u300a\u300B\u3008\u3009\uFF03', // ．《》〈〉＃
    ']+)',
].join(''), 'g');

// Implements
const linkify = (text, { provider }) => {
    if (!text) return '';

    let _text;
    // Linkify URL
    _text = text.replace(MATCH_LINK, url => {
        const wrap = document.createElement('div');
        const anch = document.createElement('a');
        anch.href = url;
        anch.target = '_blank';
        anch.innerHTML = url;
        wrap.appendChild(anch);
        return wrap.innerHTML;
    });

    if (!_text) return '';

    // Remove Zero-width characters
    _text = _text.replace(MATCH_ZERO_WIDTH_CHAR, '');

    // Linkify Mentions
    switch (provider) {
        case 'twitter':
        case 'instagram':
            _text = _text.replace(
                MATCH_MENTION[provider],
                `$1<a href="${USER_PREFIX[provider]}$2" ${TARGET_ATTR}>@$2</a>`
            );
            break;
        case 'weibo':
            _text = _text.replace(
                MATCH_MENTION[provider],
                '$1<a href="http://weibo.com/n/$2" target="_blank">@$2</a>'
            );
            break;
        default:
            break;
    }

    // Linkify Tags
    switch (provider) {
        case 'twitter':
        case 'instagram':
        case 'unsplash':
            _text = _text.replace(
                MATCH_TAG,
                `$1<a href="${TAG_PREFIX[provider]}$2" ${TARGET_ATTR}>#$2</a>`
            );
            break;
        case 'weibo':
            _text = _text.replace(/(^|\s)*#([^#]+)#/g, (str = '', $1 = '', $2 = '') => (
                $1
                + '<a href="http://huati.weibo.com/k/'
                + $2.replace(/\[([\u4e00-\u9fa5]*\])/g, '')
                + '" target="_blank">#' + $2 + '#</a>'
            ));
            break;
        default:
            break;
    }

    return _text;
};
const weiboEmotify = (text) => {
    if (!text) return '';
    if (!EMOTIONS.weibo) return text;

    const _text = text.replace(/\[[\u4e00-\u9fa5\w]+\]/g, str => {
        /**
         * Key Structure
         *
         * [key] -> key
         *
         */
        const key = str.replace(/[\[\]]/g, '');
        const _id = EMOTIONS.weibo[key];

        if (!_id) return str;

        /**
         * URL Structure
         *
         * 1) Prefix (Static): http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/
         * 2) ID
         * 3) Type: '+' -> '_thumb' | '-' -> '_org' | '@' -> ''
         * 4) Suffix: '?' -> '.png' | '.gif'
         *
         */
        const PREFIX = 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/';
        const ID = _id.replace(/\-|\+|\@/g, '/').replace('?', '');
        const TYPE = _id.indexOf('-') > 0 ? '_org' : _id.indexOf('+') > 0 ? '_thumb' : '';
        const SUFFIX = _id.indexOf('?') > 0 ? '.png' : '.gif';

        return `<img text="${str}" alt="${str}" src="${PREFIX}${ID}${TYPE}${SUFFIX}">`;
    });

    return _text || '';
};
const trimSuffixLink = (text) => {
    return text.replace(MATCH_SUFFIX_LINK, '');
};
const trimMediaLink = (text, { link }) => {
    return text.replace(link, '');
};
const sanitizer = (text) => {
    return xssFilters.inHTMLData(text);
};
const _highlight = (text, { provider, highlight }) => {
    if (!highlight) return text;

    const MATCH_HIGHLIGHT = new RegExp(`(${highlight})(?![^<]*>|[^<>]*<\/)`, 'gim');

    return text.replace(
        MATCH_HIGHLIGHT,
        `<mark class="highlight--${provider}">$1</mark>`
    );
};


// Export
export default {
    linkify,
    weiboEmotify,
    trimSuffixLink,
    trimMediaLink,
    sanitizer,
    highlight: _highlight,
};
