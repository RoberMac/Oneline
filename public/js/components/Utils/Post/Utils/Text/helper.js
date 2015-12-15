// via https://github.com/RoberMac/angular-linkify/blob/master/angular-linkify.js#L5
const _linkify = (text, provider) => {
    if (!text) return;

    var _text = text.replace(/(?:https?\:\/\/)+(?![^\s]*?")([\w.,@?!^=%&amp;:\/~+#-]*[\w@?!^=%&amp;\/~+#-])?/ig, function(url) {
        var wrap = document.createElement('div');
        var anch = document.createElement('a');
        anch.href = url;
        anch.target = "_blank";
        anch.innerHTML = url;
        wrap.appendChild(anch);
        return wrap.innerHTML;
    });

    // bugfix
    if (!_text) return '';

    // Twitter
    if (provider === 'twitter'){
        _text = _text.replace(/(|\s)*@([\w]+)/g, '$1<a href="/twitter/user/$2">@$2</a>');
        _text = _text.replace(/(^|\s)*[#＃]([^#＃\s!@$%^&*()+\-=\[\]{};':"\\|,.<>\/?\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u300c\u300d\u300e\u300f\u2018\u2019\u201c\u201D\uff08\uff09\u3014\u3015\u3010\u3011\u2014\u2026\u2013\uff0e\u300a\u300B\u3008\u3009]+)/g, '$1<a href="/twitter/tags/$2">#$2</a>');
    }
    // Instagram
    if (provider === 'instagram'){
        _text = _text.replace(/(|\s)*@([\w\.]+)/g, '$1<a href="/instagram/user/$2">@$2</a>');
        _text = _text.replace(/(^|\s)*[#＃]([^#＃\s!@$%^&*()+\-=\[\]{};':"\\|,.<>\/?\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u300c\u300d\u300e\u300f\u2018\u2019\u201c\u201D\uff08\uff09\u3014\u3015\u3010\u3011\u2014\u2026\u2013\uff0e\u300a\u300B\u3008\u3009]+)/g, '$1<a href="/instagram/tags/$2">#$2</a>');
    }
    // Weibo
    if (provider === 'weibo'){
        _text = _text.replace(/(|\s)*@([\u4e00-\u9fa5\w-]+)/g, '$1<a href="/weibo/user/$2">@$2</a>');
        _text = _text.replace(/(^|\s)*#([^#]+)#/g, function (str, $1, $2){
            str = str || '';
            $1  = $1 || '';
            $2  = $2 || '';

            return $1 + '<a href="http://huati.weibo.com/k/' + $2.replace(/\[([\u4e00-\u9fa5]*\])/g, '') + '" target="_blank">#' + $2 + '#</a>';
        });
    }

    return _text;
}


// Export
export const linkify = (text, { provider }) => {
    return _linkify(text, provider);
}
export const weiboEmotify = text => {
    return text;
}
export const trimSuffixLink = text => {
    const suffixLink = /(?:https?\:\/\/)+(?![^\s]*?")([\w.,@?!^=%&amp;:\/~+#-]*[\w@?!^=%&amp;\/~+#-])?$/ig
    return text.replace(suffixLink, '');
}
export const trimMediaLink = text => {
    return text;
}