angular.module('Oneline.controlCenterDirectives', [])
.directive('replicantDeckard', ['Replicant', 'store', function (Replicant, store){
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
                    var profile = store.get('profile_' + provider);

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
.directive('replicantRachael', ['Replicant', 'olTokenHelper', 'store', 
    function (Replicant, olTokenHelper, store){

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
                            store.set('profile_' + profile._provider, profile)
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
.directive('write', ['$filter', 'Action', 'olUI', 'olWrite', 'store',
    function ($filter, Action, olUI, olWrite, store){

    return {
        restrict: 'A',
        scope: false,
        controller: ['$scope', function ($scope){
            var _regex = {
                twitter: /(|\s)*@([\w]*)$/,
                instagram: /(|\s)*@([\w\.]*)$/,
                weibo: /(|\s)*@([\u4e00-\u9fa5\w-]*)$/
            };

            $scope.insertMention = function (mention, provider){
                olWrite.removeText(_regex[provider])
                olWrite.insertText(mention.trim() + ' ')
            }
        }],
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
            statusElem[0].focus()
            if (_action !== 'tweet'){
                var __sourceElem = document.querySelector('[data-id="' + _id + '"]'),
                    _sourceElem = angular.element(__sourceElem);

                switch (_action){
                    case 'reply':
                        if (_provider === 'twitter'){
                            statusElem.val(
                                olWrite.extractMentions(
                                    _sourceElem.find('p')[0].innerText, '@' + _info[2]
                                )
                            )
                        }
                        break;
                    case 'retweet':
                        __action = 'retweet'
                        if (_provider === 'weibo'){
                            __action = _type !== 'tweet' ?  'quote' : 'retweet'

                            statusElem.val(
                                _type === 'tweet'
                                    ? ''
                                : _type === 'retweet'
                                    ? '//@' + _info[2] + ': 转发微博'
                                : '//@' + _info[2] + ': ' + _sourceElem.find('p')[0].innerText
                            )
                            statusElem[0].setSelectionRange(0, 0)
                        }
                        // 允許直接提交 -> 「轉推」
                        statusElem.prop('required', false)
                        submitButton.prop('disabled', false)
                        break;
                }
            }
            /**
             * 初始化 Live Preview
             *
             */
            var _profile = store.get('profile_' + _provider) || {},
                _mentionsList = store.get('mentions_' + _provider),
                _regex = {
                    twitter: /(|\s)*@([\u4e00-\u9fa5\w-]*)$/, // 可匹配中文
                    instagram: /(|\s)*@([\w\.]*)$/,
                    weibo: /(|\s)*@([\u4e00-\u9fa5\w-]*)$/
                };

            scope.isShowMentions = false
            scope.mentionsList = _mentionsList
            scope.item = {
                user: {
                    name: _profile.displayName,
                    avatar: _profile.avatar,
                    screen_name: _profile.screen_name
                },
                media: [],
                text: statusElem.val().trim(),
                created_at: Date.now(),
                type: __action
            }

            __action === 'retweet'
                ? angular.extend(scope.item, olWrite.generateRetweetUser(_id, _type, _provider))
            : __action === 'quote'
                ? angular.extend(scope.item, olWrite.generateQuoteUser(_id, _type, _provider))
            : null

            olWrite.generateTemplate(_action === 'reply' ? 'tweet' : __action || _action, scope, _provider)

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

                        if (__action === 'quote' && _provider === 'twitter'){
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
                var _status = statusElem.val(),
                    status = _status.trim().length > 0 ? _status : _status.trim(),
                    statusLength = _provider === 'weibo' ? olWrite.weiboLength(status) : status.length;

                // 判斷是否呼出「提及」用戶列表
                var mention = status.match(_regex[_provider]);
                if (mention){
                    var filterMentionsList = $filter('limitTo')(
                            $filter('filter')(
                                _mentionsList,
                                _provider === 'twitter'
                                    ? { $: mention[2].trim() }
                                : mention[2].trim()
                            )
                    , 100);

                    if (filterMentionsList.length > 0){
                        scope.isShowMentions = true
                        scope.mentionsList = filterMentionsList
                    } else {
                        scope.isShowMentions = false
                    }
                } else if (scope.isShowMentions){
                    scope.isShowMentions = false
                }

                // 刷新預覽
                scope.item.text = status
                olWrite.refreshPreviewText(status, _provider)

                // retweet & quote 切換
                if (_action === 'retweet'){
                    // Retweet -> Quote
                    if (status.length > 0){
                        if (__action === 'retweet'){
                            angular.extend(scope.item, olWrite.generateQuoteUser(_id, _type, _provider))
                            olWrite.generateTemplate('quote', scope, _provider)
                        }
                        __action = 'quote'
                    }
                    // Quote -> Retweet
                    else {
                        if (__action === 'quote'){
                            angular.extend(scope.item, olWrite.generateRetweetUser(_id, _type, _provider))
                            olWrite.generateTemplate('retweet', scope, _provider)
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
                typeButton
                    ? typeButton.addClassTemporarily('actions__button--' + _action + '--active', 300)
                : null
            })
            .on('$destroy', function (){
                elem.off()
            });
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
                if (geoPickerBtn.hasClass('tips--active--peace')){

                    geoPickerBtn
                    .removeClass('tips--active--peace tips--inprocess')
                    .removeData('geo')

                } else {
                    geoPickerBtn.addClass('tips--inprocess')

                    $window.navigator.geolocation.getCurrentPosition(function (pos){

                        geoPickerBtn
                        .addClass('tips--active--peace')
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
.directive('mediaUpload', ['Media', function (Media){
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

                // 轉推」／「引用」切換時，清空之前上傳過的圖片數據
                if (!document.querySelector('.write__previews__item')){
                    uploadBtn.data('media_ids', [])
                }

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
                // 允許上傳重複圖片
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
                var image  = new Image();

                reader.onload = function (e) {
                    var previewURL = URL.createObjectURL(dataURLtoBlob(e.target.result));

                    image.src = previewURL
                    image.onload = function (){
                        var _ratio = (image.height / image.width).toFixed(5)

                        var _media = angular.element(
                            document.querySelector('.cancelMask__wrapper .timeline__media')
                        );

                        if (_media.length <= 0){
                            angular.element(document.querySelector('.cancelMask__wrapper .timeline__content'))
                            .append('<div class="timeline__media"></div>')

                            _media = angular.element(
                                document.querySelector('.cancelMask__wrapper .timeline__media')
                            );
                        }
                        _media
                        .append('<div class="timeline__media--large" data-mediaId="'
                            + fakeId
                            + '" data-ratio="'
                            + _ratio
                            + '"><img src="' + previewURL + '"></div>'
                        )
                    }

                    scope.item.media.push({
                        type: "photo",
                        image_url: previewURL,
                        fakeId: fakeId
                    })
                    scope.$apply()
                }

                reader.readAsDataURL(file)
            }
            function removeImagePreview (fakeId){
                var previewItem = angular.element(
                    document.querySelectorAll('[data-mediaId="' + fakeId + '"]')
                );

                scope.item.media = scope.item.media.filter(function (item){
                    return item.fakeId !== fakeId
                })
                scope.$apply()
            }
            function attachMediaId (fakeId, media_id){
                var previewItem = angular.element(
                    document.querySelectorAll('[data-mediaId="' + fakeId + '"]')
                );

                angular.element(previewItem[0])
                .css('padding-bottom', previewItem.attr('data-ratio') * 100 + '%')

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

                    previewItem.remove()

                    scope.item.media.splice(index, 1)
                    scope.$apply()
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
                sensitiveElem.hasClass('tips--active--peace')
                    ? sensitiveElem.removeClass('tips--active--peace').data('sensitive', false)
                : sensitiveElem.addClass('tips--active--peace').data('sensitive', true)
            })
            .on('$destroy', function (){
                sensitiveElem.off('click')
            })
        }
    }
})
.directive('weiboEmotions', ['olWrite', function (olWrite){
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'controlCenter/write/component/weiboEmotions.html',
        controller: ['$scope', function($scope){
            $scope.insertEmotion = function (emotion){
                emotion = '[' + emotion + ']'

                olWrite.insertText(emotion)
            }
        }],
        link: function (scope, elem, attrs){
            var emotionsElem = elem.find('button');
            var emotionsList = '笑cry|微笑|嘻嘻|哈哈|可爱|可怜|挖鼻|吃惊|害羞|挤眼|'
                                +'闭嘴|鄙视|爱你|泪|偷笑|亲亲|生病|太开心|白眼|右哼哼|'
                                +'左哼哼|嘘|衰|委屈|吐|哈欠|抱抱|怒|疑问|馋嘴|拜拜|思考|'
                                +'汗|困|睡|钱|失望|酷|色|哼|鼓掌|晕|悲伤|抓狂|黑线|阴险|怒骂|互粉|'
                                +'心|伤心|猪头|熊猫|兔子|ok|耶|good|NO|赞|来|'
                                +'弱|草泥马|给力|围观|威武|奥特曼|礼物|钟|话筒|蜡烛|蛋糕|'
                                + '带着微博去旅行|最右|泪流满面|江南style|去旅行|doge|喵喵';

            scope.isShowEmotions = false
            scope.emotionsList = emotionsList.split('|')

            emotionsElem
            .on('click', function (){
                emotionsElem.toggleClass('tips--active--peace')
                scope.$apply(function (){
                    scope.isShowEmotions = !scope.isShowEmotions
                })

                document.querySelector('textarea').focus()
            })
            .on('$destroy', function (){
                emotionsElem.off('click')
            })
        }
    }
}])
