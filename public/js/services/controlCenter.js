angular.module('Oneline.controlCenterServices', [])
.service('olWrite', ['$compile', '$templateRequest', '$timeout', '$filter', 'weiboEmotify',
    function($compile, $templateRequest, $timeout, $filter, weiboEmotify){

    this.weiboLength = function (status){
        var _ascii_len = (status.match(/[\x00-\x7F]+/g) || []).join('').length;
        var _nonAscii_len = status.length - _ascii_len;

        return _nonAscii_len + Math.round(_ascii_len / 2);
    }
    this.extractMentions = function (status, sourceUser){
        var _mentions = [sourceUser],
            _str = '';

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
    this.insertText = function (text){
        var statusElem = document.querySelector('textarea'),
            _start = statusElem.selectionStart,
            _end = statusElem.selectionEnd,
            _after = _start + text.length;

        if (_start || _start == '0') {
            statusElem.value = statusElem.value.substring(0, _start)
                + text
                + statusElem.value.substring(_end, statusElem.value.length);
        } else {
            statusElem.value += text;
        }

        angular.element(statusElem).parent().triggerHandler('input')
        statusElem.setSelectionRange(_after, _after)
        statusElem.focus()
    }
    this.removeText = function (regex){
        var statusElem = document.querySelector('textarea');

        statusElem.value = statusElem.value.replace(regex, ' ')

        if (statusElem.value.length === 1){
            statusElem.value = ''
        }
    }
    this.isLeftPopup = function (){
        var statusElem = document.querySelector('textarea'),
            mirror = document.querySelector('.write__textarea span'),
            _start = statusElem.selectionStart,
            _width = statusElem.offsetWidth - 10;

        mirror.innerHTML = statusElem.value.substr(0, _start).replace(/\n$/,"\n\001")

        var _rects = mirror.getClientRects(),
            _lastRect = _rects[_rects.length - 1],
            _left = _lastRect.width;

        return _left > _width / 2;
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