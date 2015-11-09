angular.module('Oneline.textDirectives', [])
.filter('olLinkify', function () {

  function linkify(_str, type) {
    if (!_str){
        return;
    }

    var _text = _str.replace(/(?:https?\:\/\/)+(?![^\s]*?")([\w.,@?!^=%&amp;:\/~+#-]*[\w@?!^=%&amp;\/~+#-])?/ig, function(url) {
        var wrap = document.createElement('div');
        var anch = document.createElement('a');
        anch.href = url;
        anch.target = "_blank";
        anch.innerHTML = url;
        wrap.appendChild(anch);
        return wrap.innerHTML;
    });

    // bugfix
    if (!_text){
        return '';
    }

    // Twitter
    if (type === 'twitter'){
        _text = _text.replace(/(|\s)*@([\w]+)/g, '$1<a href="/twitter/user/$2">@$2</a>');
        _text = _text.replace(/(^|\s)*[#＃]([^#＃\s!@$%^&*()+\-=\[\]{};':"\\|,.<>\/?\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u300c\u300d\u300e\u300f\u2018\u2019\u201c\u201D\uff08\uff09\u3014\u3015\u3010\u3011\u2014\u2026\u2013\uff0e\u300a\u300B\u3008\u3009]+)/g, '$1<a href="/twitter/tags/$2">#$2</a>');
    }


    // Instagram
    if (type === 'instagram'){
        _text = _text.replace(/(|\s)*@([\w\.]+)/g, '$1<a href="/instagram/user/$2">@$2</a>');
        _text = _text.replace(/(^|\s)*[#＃]([^#＃\s!@$%^&*()+\-=\[\]{};':"\\|,.<>\/?\u3002\uff1f\uff01\uff0c\u3001\uff1b\uff1a\u300c\u300d\u300e\u300f\u2018\u2019\u201c\u201D\uff08\uff09\u3014\u3015\u3010\u3011\u2014\u2026\u2013\uff0e\u300a\u300B\u3008\u3009]+)/g, '$1<a href="/instagram/tags/$2">#$2</a>');
    }

    // Weibo
    if (type === 'weibo'){
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

    return linkify;
})
.directive('olLinkify', ['$filter', '$timeout', function ($filter, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var type = attrs.olLinkify || 'normal';

            $timeout(function () {
                element.html($filter('olLinkify')(element.html(), type));
            });
        }
    }
}])
.directive('trimMediaLink', ['$timeout', function ($timeout){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            $timeout(function () {
                element.html(element.html().replace(attrs.trimMediaLink, ''));
            })

        }
    }
}])
.directive('trimSuffixLink', ['$timeout', function ($timeout){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (attrs.trimSuffixLink === 'true'){
                var suffixLink = /(?:https?\:\/\/)+(?![^\s]*?")([\w.,@?!^=%&amp;:\/~+#-]*[\w@?!^=%&amp;\/~+#-])?$/ig

                $timeout(function () {
                    element.html(element.html().replace(suffixLink, ''));
                })
            }
        }
    }
}])
.filter('html', ['$sce', function($sce) {
    return function(str) {
        return $sce.trustAsHtml(str);
    };
}])