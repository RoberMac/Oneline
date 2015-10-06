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

                Replicant.deckard()
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
                        olTokenHelper.replaceTokenList(data.tokenList)
                        scope.updateProviderList()
                    }

                    scope.setControlCenter('')
                    scope.toggleActive({
                        currentTarget: document.querySelector('.replicant-icon--rachael')
                    })
                }, function (err){
                    inputElem.addClassTemporarily('replicant--rachael--errCode', 500)
                })
            })
        }
    }
}])
.directive('read', ['Action', function(Action){
    return {
        restrict: 'A',
        controller: ['$scope', 'Action', function ($scope, Action){
            var _info       = $scope.controlCenter.split(':'),
                _id         = _info[1],
                _type       = _info[0].split('-')[1];

            Action.get({
                action: _type,
                provider: 'instagram',
                id: _id
            })
            .$promise
            .then(function (res){
                $scope.readType  = _type 
                $scope.readItems = res.data
            })
        }]
    }
}])
.directive('write', ['$window', 'Action', 'olUI',
    function ($window, Action, olUI){

    return {
        restrict: 'A',
        scope: false,
        link: function (scope, elem, attrs){
            var _info       = scope.controlCenter.split(':'),
                _id         = _info[1],
                _type       = _info[0].split('-')[1],
                __type      = '',
                _limitCount = _type === 'tweet' || _type === 'reply'
                                    ? 140
                                    : _type === 'retweet'
                                        ? 116
                                        : null

            var _window      = angular.element($window),
                _button      = elem.find('button'),
                submitButton = _button.eq(_button.length - 1),
                statusElem   = elem.find('textarea'),
                typeButton;

            /**
             * 初始化
             *
             */
            // 添加 `@username` 前綴
            if (_type === 'reply' || _type === 'retweet'){

                if (_type === 'reply'){
                    statusElem.val('@' + _info[2] + ' ')
                } else if (_type === 'retweet'){
                    // 允許直接提交 -> 「轉推」
                    statusElem.prop('required', false)
                    submitButton.prop('disabled', false)
                }
                // 預覽「源推」
                angular.element(document.querySelector('.cancelMask__wrapper'))
                .children()
                .append(
                    angular.element(document.querySelector('[data-id="' + _id + '"]'))
                    .clone()
                    .removeClass('divider--top divider--bottom')
                );
                // 取消（除「來源」外）「其他操作」按鈕 hover 態提醒
                angular.element(
                    document.querySelector('.cancelMask__wrapper').querySelectorAll('button.tips--deep')
                ).addClass('tips--frozen');

                angular.element(document.querySelector('.cancelMask__wrapper [data-source]'))
                .parent()
                .removeClass('tips--frozen');

                // 「回覆」／「轉推」提醒
                typeButton = angular.element(document.querySelector('.cancelMask__wrapper [data-' + _type + ']'));
                typeButton.parent().removeClass('tips--deep tips--frozen')
            }

            /**
             * 監聽事件
             *
             */
            var status = '';
            elem
            .on('submit', function (e){
                e.preventDefault()

                var params = {
                    status: status,
                    geo   : elem.find('geo-picker').data('geo'),
                    media_ids: elem.find('media-upload').data('media_ids')
                }

                if (_type === 'retweet' && status.length > 0){
                    __type = 'quote'

                    angular.extend(params, {
                        status: status + ' https://twitter.com/' + _info[2] + '/status/' + _id
                    })
                }

                statusElem.prop('disabled', true)
                submitButton.addClass('write__btn--send--sending')

                Action.update({
                    action: __type || _type,
                    provider: 'twitter',
                    id: _id || 0
                }, { params: params })
                .$promise
                .then(function (data){

                    if (_type === 'retweet'){
                        olUI.setActionState('retweet', _id, 'active')
                        olUI.actionData('retweet', _id, data.id_str)

                        // TODO
                        if (__type === 'quote'){
                            // 凍結
                            olUI.setActionState('retweet', _id, 'frozen')
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
                // 更新推文內容
                status = statusElem.val().trim()
                // 超字提醒
                var statusLength = status.length
                if (statusLength > _limitCount || statusLength === 0){
                    submitButton.prop('disabled', true)
                } else {
                    submitButton.prop('disabled', false)
                }
                // 更新剩餘字數
                submitButton.attr('data-count', statusLength > 0 ? statusLength : '')

                // 動畫
                submitButton.addClassTemporarily('write__btn--send--typing', 700)
                typeButton ? typeButton.addClassTemporarily('actions__button--' + _type + '--active', 300) : null
            })
            .on('$destroy', function (){
                elem.off()
                _window.off()
            });
            // 按 Esc 鍵取消操作
            _window.on('keydown', function (e){
                if (e.keyCode === 27){
                    scope.$apply(function (){
                        scope.setControlCenter('')
                    })
                }
            })
        }
    }
}])
.directive('geoPicker', ['$window', function ($window){
    return {
        restrict: 'E',
        templateUrl: 'controlCenter/write/component/geoPicker.html',
        link: function (scope, elem, attrs){
            var geoPickerBtn = elem.find('button');

            geoPickerBtn.on('click', function (){
                if (geoPickerBtn.hasClass('tips--active')){
                    elem.removeData('geo')

                    geoPickerBtn.removeClass('tips--active tips--inprocess')
                } else {
                    geoPickerBtn.addClass('tips--inprocess')

                    $window.navigator.geolocation.getCurrentPosition(function (pos){

                        elem.data('geo', {
                            lat: pos.coords.latitude,
                            long: pos.coords.longitude
                        })

                        geoPickerBtn.addClass('tips--active')
                        geoPickerBtn.removeClass('tips--inprocess')
                    }, function (err){
                        geoPickerBtn.removeClass('tips--inprocess')
                        geoPickerBtn.addClassTemporarily('tips--error', 500)
                    }, { maximumAge: 60000, timeout: 7000 })
                }
            })

            geoPickerBtn.on('$destroy', function (){
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
            var uploadBtn = elem.find('input');

            uploadBtn.on('change', function (){
                var fd   = new FormData(),
                    file = uploadBtn[0].files[0];

                // Preview
                var fakeId = Date.now()
                addImagePreview(file, fakeId)
                // Upload
                fd.append('twitterMedia', file)
                Media.upload({ provider: 'twitter' }, fd)
                .$promise
                .then(function (data){
                    var media_ids = elem.data('media_ids') || [],
                        media_id  = data.media_id;

                    media_ids.push(media_id)
                    elem.data('media_ids', media_ids)

                    attachMediaId(fakeId, media_id)
                })
                .catch(function (err){
                    removeImagePreview(fakeId)
                })
                uploadBtn[0].value = ''

            })

            uploadBtn.on('$destroy', function (){
                uploadBtn.off('change')
            })

            function addImagePreview (file, fakeId){
                var reader = new FileReader();

                reader.onload = function (e) {
                    var previews = angular.element(document.querySelectorAll('.write__previews')),
                        previewHTML = '<span class="write__previews__item tips--active tips--inprocess animate--faster" data-mediaId><img src="'
                                        + e.target.result
                                        + '"></span>'

                    previews.append(previewHTML)

                    var previewItems = document.querySelectorAll('.write__previews__item'),
                        previewItem  = angular.element(previewItems[previewItems.length - 1]);

                    previewItem.attr('data-mediaId', fakeId)
                }

                reader.readAsDataURL(file)

                if (document.querySelectorAll('.write__previews__item').length === 3){
                    elem.css('display', 'none')
                }
            }
            function removeImagePreview (fakeId){
                var previewItem = document.querySelector('[data-mediaId="' + fakeId + '"]');

                angular.element(previewItem).remove()
            }
            function attachMediaId (fakeId, media_id){
                var previewItem = angular.element(
                                    document.querySelector('[data-mediaId="' + fakeId + '"]')
                                );

                previewItem
                .removeClass('tips--inprocess')
                .attr('data-mediaId', media_id)
                .on('click', function (){
                    var media_ids = elem.data('media_ids') || [],
                        media_id  = previewItem.attr('data-mediaId'),
                        index     = media_ids.indexOf(media_id);

                    media_ids.splice(index, 1)
                    media_ids.length <= 0
                        ? elem.removeData('media_ids')
                        : elem.data('media_ids', media_ids)

                    previewItem.remove()

                    if (document.querySelectorAll('.write__previews__item').length < 4){
                        elem.attr('style', '')
                    }
                })
                .on('$destroy', function (){
                    previewItem.off('click')
                })
            }
        }
    }
}])