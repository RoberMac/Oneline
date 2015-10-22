angular.module('Oneline.utilsServices', [])
.service('writeHelper', ['$compile', '$templateRequest', '$timeout', '$filter', 'weiboEmotify',
    function($compile, $templateRequest, $timeout, $filter, weiboEmotify){

    this.weiboLength = function (status){
        var _ascii_len = (status.match(/[\x00-\x7F]+/g) || []).join('').length;
        var _nonAscii_len = status.length - _ascii_len;

        return _nonAscii_len + Math.round(_ascii_len / 2);
    }
    this.extractMentions = function (status, sourceUser){
        var _mentions = [sourceUser],
            _str = ' ';

        // Extract
        _mentions = _mentions.concat(status.match(/(|\s)*@([\w]+)/g) || [])
        // Trim
        _mentions = _mentions.map(function (item){
            return item.trim()
        })
        // Remove Duplicates
        _mentions = _mentions.filter(function(item, pos) {
            return _mentions.indexOf(item) == pos;
        })
        // Concat
        _mentions.forEach(function (item){
            _str = _str + item + ' '
        })

        return _str;
    }
    this.generateTemplate = function (type, scope, _provider){
        var _template = _provider + '/' + type + '.html',
            _mask = angular.element(document.querySelector('.cancelMask__wrapper'));

        $templateRequest(_template)
        .then(function (html){
            html = '<div class="timeline timeline--' + _provider + '">' + html + '</div>'

            _mask.children()
            .empty() // 清空
            .append($compile(html)(scope)) // 插入
        })
        $timeout(function (){
            _mask.find('button').css('pointer-events', 'none')
        })
        this.refreshPreviewText(scope.item.text, _provider)
    }
    this.generateRetweetUser = function(_id, _type, _provider){
        return {
            text: extractSource('text', _id, _type, _provider),
            retweet: {
                user: {
                    name: extractSource('name', _id, _type, _provider),
                    avatar: extractSource('avatar', _id, _type, _provider),
                    screen_name: extractSource('screen_name', _id, _type, _provider)
                }
            },
            media: [],
            type: 'retweet'
        }
    }
    this.generateQuoteUser = function (_id, _type, _provider){
        var obj = {
            text: extractSource('text', _id, _type, _provider),
            created_at: extractSource('created_at', _id, _type, _provider),
            user: {
                name: extractSource('name', _id, _type, _provider),
                avatar: extractSource('avatar', _id, _type, _provider),
                screen_name: extractSource('screen_name', _id, _type, _provider)
            }
        }

        return _provider === 'twitter'
                    ? { quote: obj, type: 'quote' } 
                : { retweet: obj, type: 'quote' }
    }
    this.refreshPreviewText = function (status, _provider){
        var _mask = angular.element(document.querySelector('.cancelMask__wrapper'));

        status = $filter('linkify')(status, _provider) || ''

        $timeout(function (){
            if (_provider === 'twitter'){
                angular.element(_mask.find('p')[0]).html(status)
            } else {
                weiboEmotify.then(function (emotify){
                    angular.element(_mask.find('p')[0]).html(emotify(status) || '')
                })
            }
        })
    }

    function extractSource (type, _id, _type, _provider){
        var __sourceElem = document.querySelector('[data-id="' + _id + '"]'),
            index = _type === 'quote' ? 1 : 0,
            link_prefix = _provider === 'twitter'
                                ? '//twitter.com/'
                            : _provider === 'weibo'
                                ? '//weibo.com/n/'
                            : null;

        switch (type){
            case 'text':
                return __sourceElem.querySelectorAll('p')[index]
                        .innerText
                break;
            case 'name':
                return __sourceElem.querySelectorAll('.timeline__profile__fullname strong')[index]
                        .innerText
                break;
            case 'avatar':
                return __sourceElem.querySelectorAll('.timeline__profile__avatar')[index]
                        .getAttribute('src')
                break;
            case 'screen_name':
                return __sourceElem.querySelectorAll('.timeline__profile__fullname a')[index]
                        .getAttribute('href').replace(link_prefix, '')
                break;
            case 'created_at':
                return __sourceElem.querySelectorAll('[relative-date]')[index]
                        .getAttribute('relative-date')
                break;
        }
    }
}])