angular.module('Oneline.olControlCenterDirectives', [])
.directive('replicantDeckard', ['Replicant', function (Replicant){
    return {
        restrict: 'A',
        link: function (scope, elem, attrs){
            var fakeCode, countDown;

            elem.on('$destroy', function (){
                clearInterval(fakeCode)
                clearInterval(countDown)
            })

            getCode()

            function getCode(){
                fakeCode = setInterval(function (){
                    for (var rdmString = ''; rdmString.length < 7; rdmString += Math.random().toString(36).substr(2));
                    elem.html(rdmString.substr(0, 7))
                }, 100)

                var profileList = [];
                scope.providerList.forEach(function (provider){
                    var profile = JSON.parse(localStorage.getItem('profile_' + provider));

                    if (profile){
                        profileList.push(profile)
                    }
                })

                Replicant.deckard({ profileList: JSON.stringify(profileList) })
                .$promise
                .then(function (data){
                    var deadline = 60;

                    setTimeout(function (){
                        clearInterval(fakeCode)
                        elem.html(data.code)
                    }, 700)

                    countDown = setInterval(function (){
                        if (deadline < 0){
                            getCode()
                            elem.attr('data-countdown', '')
                            clearInterval(countDown)
                            return;
                        }
                        elem.attr('data-countdown', deadline--)
                    }, 1000)
                }, function (err){
                    clearInterval(fakeCode)
                })
            }
        }
    }
}])
.directive('replicantRachael', ['Replicant', 'olTokenHelper', function (Replicant, olTokenHelper){
    return {
        restrict: 'A',
        link: function (scope, elem, attrs){

            elem.on('submit', function (e){
                e.preventDefault()

                var inputElem = elem.children(),
                    code = inputElem.val();

                inputElem[0].blur()

                Replicant.rachael({ code: code })
                .$promise
                .then(function (data){

                    if (data.msg.length > 0){
                        data.msg.forEach(function (msg){
                            alert(msg)
                        })
                    } else {
                        // 處理 Token
                        olTokenHelper.replaceTokenList(data.tokenList)
                        scope.updateProviderList()
                        // 處理 Profile
                        data.profileList.forEach(function (profile){
                            localStorage.setItem('profile_' + profile._provider, JSON.stringify(profile))
                        })
                    }

                    scope.setControlCenter('')
                }, function (err){
                    inputElem.addClassTemporarily('replicant--rachael--errCode', 500)
                })
            })
        }
    }
}])
.directive('read', [function(){
    return {
        restrict: 'A',
        controller: ['$scope', 'Action', function ($scope, Action){
            var _info       = $scope.controlCenter.split(':'),
                _id         = _info[1],
                _provider   = _info[0].split('-')[0].split('_')[1],
                _action     = _info[0].split('-')[1];

            Action.get({
                action: _action,
                provider: _provider,
                id: _id
            })
            .$promise
            .then(function (res){
                $scope.readType  = _action 
                $scope.readItems = res.data
            })
            .catch(function (){
                angular
                .element(document.querySelector('.read .loadMore'))
                .addClass('loadMore--loading--fail')
            })
        }]
    }
}])
.directive('write', ['$compile', '$templateRequest', '$filter', 'Action', 'olUI',
    function ($compile, $templateRequest, $filter, Action, olUI){

    return {
        restrict: 'A',
        scope: false,
        link: function (scope, elem, attrs){
            var _info       = scope.controlCenter.split(':'),
                _id         = _info[1],
                _provider   = _info[0].split('-')[0].split('_')[1],
                _action     = _info[0].split('-')[1],
                __action    = '',
                _type       = _info[0].split('-')[2],
                _limitCount = _action === 'tweet' || _action === 'reply' || _provider === 'weibo'
                                    ? 140
                                : _action === 'retweet'
                                    ? 116
                                : null

            var _button      = elem.find('button'),
                submitButton = _button.eq(_button.length - 1),
                statusElem   = elem.find('textarea'),
                typeButton;

            /**
             * 初始化輸入框
             *
             */
            if (_action !== 'tweet'){
                var __sourceElem = document.querySelector('[data-id="' + _id + '"]'),
                    _sourceElem = angular.element(__sourceElem);

                statusElem[0].focus()
                // 添加 `@username` 前綴
                if (_provider === 'twitter' && _action === 'reply'){
                    statusElem.val(extractMentions(_sourceElem.find('p')[0].innerText, '@' + _info[2]))
                }
                // 允許直接提交 -> 「轉推」
                else if (_action === 'retweet'){
                    __action = 'retweet'

                    if (_provider === 'weibo'){
                        statusElem.val(
                            _type === 'tweet'
                                ? ''
                            : _type === 'retweet'
                                ? '//@' + _info[2] + ': 转发微博'
                            : '//@' + _info[2] + ': ' + _sourceElem.find('p')[0].innerText
                        )
                        statusElem[0].setSelectionRange(0, 0)
                    }

                    statusElem.prop('required', false)
                    submitButton.prop('disabled', false)
                }
            }
            /**
             * 初始化 Live Preview
             *
             */
            var _profile = JSON.parse(localStorage.getItem('profile_' + _provider)) || {},
                _mask    = angular.element(document.querySelector('.cancelMask__wrapper'));

            scope.item = {
                user: {
                    name: _profile.displayName,
                    avatar: _profile.avatar,
                    screen_name: _profile.screen_name
                },
                media: [],
                text: statusElem.val().trim(),
                created_at: Date.now()
            }
            if (_action === 'retweet'){
                generateRetweetUser()
            }
            generateTemplate(_action === 'reply' ? 'tweet' : _action)

            /**
             * 監聽事件
             *
             */
            elem
            .on('submit', function (e){
                e.preventDefault()

                var status = statusElem.val().trim();

                var params = {
                    status: status
                }
                // Init
                if (_provider === 'twitter'){
                    angular.extend(params, {
                        geo: elem.find('geo-picker').find('button').data('geo'),
                        media_ids: elem.find('media-upload').find('input').data('media_ids'),
                        sensitive: elem.find('toggle-sensitive').find('button').data('sensitive')
                    })

                    if (_action === 'retweet' && status.length > 0){
                        params.status = status + ' https://twitter.com/' + _info[2] + '/status/' + _id
                    }
                } else if (_provider === 'weibo'){
                    if (_action === 'tweet'){
                        angular.extend(params, {
                            geo: elem.find('geo-picker').data('geo')
                        })
                    }
                }
                // UI
                statusElem.prop('disabled', true)
                submitButton.addClass('write__btn--send--sending')
                // Fire
                Action.update({
                    action: __action || _action,
                    provider: _provider,
                    id: _id || 0
                }, { params: params })
                .$promise
                .then(function (data){

                    if (_action === 'retweet'){
                        olUI.setActionState('retweet', _id, 'active')
                        olUI.actionData('retweet', _id, data.id_str)

                        if (__action === 'quote'){
                            // 凍結
                            olUI.setActionState('retweet', _id, 'frozen')
                        } else {
                            var count = ~~olUI.actionData('retweet', _id, null, 'count') + 1;
                            olUI.actionData('retweet', _id, count, 'count')
                        }
                    }

                    scope.setControlCenter('')
                })
                .catch(function (){
                    submitButton.prop('disabled', false)
                    statusElem.addClassTemporarily('write__textarea--err', 500)
                })
                .finally(function (){
                    statusElem.prop('disabled', false)
                    submitButton.removeClass('write__btn--send--sending')
                })
            })
            .on('input', function (){
                var status = statusElem.val().trim(),
                    statusLength = _provider === 'weibo' ? weiboLength(status) : status.length;

                // 刷新預覽
                scope.item.text = status
                angular.element(_mask.find('p')[0]).html($filter('linkify')(status, _provider))
                // retweet & quote 切換
                if (_action === 'retweet'){
                    // Retweet -> Quote
                    if (status.length > 0){
                        if (__action === 'retweet'){
                            generateQuoteUser()
                            generateTemplate('quote')
                        }
                        __action = 'quote'
                    }
                    // Quote -> Retweet
                    else {
                        if (__action === 'quote'){
                            generateRetweetUser()
                            generateTemplate('retweet')
                        }
                        __action = 'retweet'
                    }
                }
                // 超字提醒
                if (statusLength > _limitCount 
                    || (statusLength === 0 && _action !== 'retweet')){
                    submitButton.prop('disabled', true)
                } else {
                    submitButton.prop('disabled', false)
                }
                // 更新剩餘字數
                submitButton.attr('data-count', statusLength > 0 ? statusLength : '')
                // 動畫
                submitButton.addClassTemporarily('write__btn--send--typing', 700)
                typeButton ? typeButton.addClassTemporarily('actions__button--' + _action + '--active', 300) : null
            })
            .on('$destroy', function (){
                elem.off()
            });

            /**
             * Helper
             *
             */
            function weiboLength (status){
                var _ascii_len = (status.match(/[\x00-\x7F]+/g) || []).join('').length;
                var _nonAscii_len = status.length - _ascii_len;

                return _nonAscii_len + Math.round(_ascii_len / 2);
            }
            function extractMentions (status, sourceUser){
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
            function extractSource (type){
                var index = _type === 'quote' ? 1 : 0;
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
            function generateTemplate(type){
                var _template = _provider + '/' + type + '.html';

                $templateRequest(_template)
                .then(function (html){
                    html = '<div class="timeline timeline--' + _provider + '">' + html + '</div>'

                    _mask.children()
                    .empty() // 清空
                    .append($compile(html)(scope)) // 插入
                })
            }
            function generateRetweetUser(){
                angular.extend(scope.item, {
                    text: extractSource('text'),
                    retweet: {
                        user: {
                            name: extractSource('name'),
                            avatar: extractSource('avatar'),
                            screen_name: extractSource('screen_name')
                        }
                    }
                })
            }
            function generateQuoteUser(){
                var obj = {
                    text: extractSource('text'),
                    created_at: extractSource('created_at'),
                    user: {
                        name: extractSource('name'),
                        avatar: extractSource('avatar'),
                        screen_name: extractSource('screen_name')
                    }
                }
                angular.extend(scope.item, _provider === 'twitter' ? { quote: obj } : { retweet: obj })
            }
        }
    }
}])
.directive('geoPicker', ['$window', function ($window){
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'controlCenter/write/component/geoPicker.html',
        link: function (scope, elem, attrs){
            var geoPickerBtn = elem.find('button');

            geoPickerBtn
            .on('click', function (){
                if (geoPickerBtn.hasClass('tips--active')){

                    geoPickerBtn
                    .removeClass('tips--active tips--inprocess')
                    .removeData('geo')

                } else {
                    geoPickerBtn.addClass('tips--inprocess')

                    $window.navigator.geolocation.getCurrentPosition(function (pos){

                        geoPickerBtn
                        .addClass('tips--active')
                        .removeClass('tips--inprocess')
                        .data('geo', {
                            lat: pos.coords.latitude,
                            long: pos.coords.longitude
                        })

                    }, function (err){

                        geoPickerBtn
                        .removeClass('tips--inprocess')
                        .addClassTemporarily('tips--error', 500)

                    }, { maximumAge: 60000, timeout: 7000 })
                }
            })
            .on('$destroy', function (){
                geoPickerBtn.off('click')
            })
        }
    }
}])
.directive('mediaUpload', ['$compile', 'Media', function ($compile, Media){
    return {
        restrict: 'E',
        templateUrl: 'controlCenter/write/component/mediaUpload.html',
        link: function (scope, elem, attrs){
            var _provider = attrs.provider,
                uploadBtn = elem.find('input');

            uploadBtn
            .on('change', function (){
                var fd   = new FormData(),
                    file = uploadBtn[0].files[0];

                // Preview
                var fakeId = Date.now()
                addImagePreview(file, fakeId)
                // Upload
                fd.append('twitterMedia', file)
                Media.upload({ provider: _provider }, fd)
                .$promise
                .then(function (data){
                    var media_ids = uploadBtn.data('media_ids') || [],
                        media_id  = data.media_id;

                    media_ids.push(media_id)
                    uploadBtn.data('media_ids', media_ids)

                    attachMediaId(fakeId, media_id)
                })
                .catch(function (err){
                    removeImagePreview(fakeId)
                })
                uploadBtn[0].value = ''

            })
            .on('$destroy', function (){
                uploadBtn.off('change')
            })


            /**
             * Helper
             *
             */
            function addImagePreview (file, fakeId){
                var reader = new FileReader();

                reader.onload = function (e) {
                    var previewURL = URL.createObjectURL(dataURLtoBlob(e.target.result));

                    // Twitter Preview
                    scope.item.media.push({
                        type: "photo",
                        image_url: previewURL,
                        fakeId: fakeId
                    })
                    $compile(angular.element(document.querySelector('.cancelMask__wrapper'))
                        .contents()
                    )(scope)
                }

                reader.readAsDataURL(file)
            }
            function removeImagePreview (fakeId){
                var previewItem = document.querySelector('[data-mediaId="' + fakeId + '"]');

                angular.element(previewItem).remove()

                // Twitter Preview
                scope.item.media = scope.item.media.filter(function (item){
                    return item.fakeId !== fakeId
                })
                $compile(angular.element(document.querySelector('.cancelMask__wrapper'))
                    .contents()
                )(scope)
            }
            function attachMediaId (fakeId, media_id){
                var previewItem = angular.element(
                                    document.querySelector('[data-mediaId="' + fakeId + '"]')
                                );

                previewItem
                .removeClass('tips--inprocess')
                .attr('data-mediaId', media_id)
                .on('click', function (){
                    var media_ids = uploadBtn.data('media_ids') || [],
                        media_id  = previewItem.attr('data-mediaId'),
                        index     = media_ids.indexOf(media_id);

                    media_ids.splice(index, 1)
                    media_ids.length <= 0
                        ? elem.removeData('media_ids')
                    : uploadBtn.data('media_ids', media_ids)

                    // Twitter Preview
                    scope.item.media.splice(index, 1)
                    $compile(angular.element(document.querySelector('.cancelMask__wrapper'))
                        .contents()
                    )(scope)
                })
                .on('$destroy', function (){
                    previewItem.off('click')
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
        }
    }
}])
.directive('toggleSensitive', function (){
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'controlCenter/write/component/toggleSensitive.html',
        link: function (scope, elem, attrs){
            var sensitiveElem = elem.find('button');

            sensitiveElem
            .on('click', function (){
                sensitiveElem.hasClass('tips--active')
                    ? sensitiveElem.removeClass('tips--active').data('sensitive', false)
                : sensitiveElem.addClass('tips--active').data('sensitive', true)
            })
            .on('$destroy', function (){
                sensitiveElem.off('click')
            })
        }
    }
})