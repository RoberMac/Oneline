angular.module('Oneline.maskDirectives', [])
/**
 * 菜單
 *
 */
.directive('showMenu', ['olMask', function (olMask){
    return {
        restrict: 'A',
        link: function (scope, elem, attrs){
            elem
            .on('click', function (){
                var _provider = attrs.showMenu;

                scope.setControlCenter('fullmask')              
                .then(function (){
                    olMask.append('mask/menu/' + _provider + '.html', scope)
                })
            })
            .on('$destroy', function (){
                elem.off()
            })
        }
    }
}])
.directive('userProfile', ['store', '$state', function (store, $state){
    return {
        restrict: 'A',
        link: function (scope, elem, attrs){
            elem.on('click', function (){
                var _provider = attrs.userProfile;

                $state.go('timeline.action', {
                    provider: _provider,
                    action: 'user',
                    id: store.get('profile_' + _provider).uid
                })
            })
        }
    }
}])
.directive('toggleFollowing', ['Action', function (Action){
    return {
        restrict: 'A',
        link: function (scope, elem, attrs){
            elem.on('click', function (){
                var followed_by = angular.element(document.querySelectorAll('.profile__count__column')[1]),
                    _info       = attrs.toggleFollowing.split(':'),
                    _provider   = _info[0],
                    _uid        = _info[1],
                    isFollowing = elem.hasClass('icon--' + _provider);

                elem.addClass('tips--inprocess')
                Action[isFollowing ? 'destroy' : 'create']({
                    action: 'follow',
                    provider: _provider,
                    id: _uid
                })
                .$promise
                .then(function (data){
                    elem.toggleClass('tips--active icon--' + _provider)

                    var count = ~~followed_by.attr('data-count') + (isFollowing ? -1 : 1);
                    followed_by.attr('data-count', count)
                })
                .catch(function (err){
                    elem.addClassTemporarily('tips--error', 500)
                })
                .finally(function (){
                    elem.removeClass('tips--inprocess')
                })
            })
        }
    }
}])
/**
 * 查看「提及」& 「私信」
 *
 */
.directive('mentions', ['$timeout', 'olNotification', function ($timeout, olNotification){

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'mask/notification/mentions/twitter.html',
        controller: ['$scope', '$element', function ($scope, $element){
            var _provider = $element.attr('provider'),
                _notifications;

            // Init
            $scope.notifications = []
            $scope.loadState = 'initLoad'
            _notifications = olNotification.initLoad(_provider, 'mentions');

            if (_notifications && _notifications.length > 0){
                $timeout(function (){
                    $scope.notifications = _notifications
                    $scope.loadState = 'loadFin'
                }, 700)
            } else {
                olNotification.load(true)
                .then(function (data){
                    $scope.notifications = data
                    $scope.loadState = 'loadFin'
                })
                .catch(function (err){
                    $scope.loadState = 'loadFail'
                })
            }

            $scope.loadMentions = function (type){
                if ($scope.loadState === 'loading') return;

                $scope.loadState = 'loading'
                olNotification.load(false)
                .then(function (data){
                    $scope.notifications = data
                    $scope.loadState = 'loadFin'
                })
                .catch(function (err){
                    $scope.loadState = 'loadFail'
                })
            }
        }]
    }
}])
/**
 * 查看「私信」
 *
 */
.directive('direct', ['$timeout', '$filter', 'olNotification',
    function ($timeout, $filter, olNotification){

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'mask/notification/direct/twitter.html',
        controller: ['$scope', '$element', 'store', function ($scope, $element, store){
            var _provider = $element.attr('provider'),
                _authUid = store.get('profile_' + _provider).uid,
                _notifications, _conversation, _currentSender;

            // Init
            $scope.notifications = []
            $scope.senderList = []
            $scope._authUid = _authUid
            $scope.loadState = 'initLoad'

            _notifications = olNotification.initLoad(_provider, 'direct');

            if (_notifications && _notifications.length > 0){
                $timeout(function (){
                    updateDirect()
                }, 700)
            } else {
                olNotification.load(true)
                .then(function (data){
                    updateDirect()
                })
                .catch(function (err){
                    $scope.loadState = 'loadFail'
                })
            }

            $scope.loadDirect = function (type){
                if ($scope.loadState === 'loading') return;

                $scope.loadState = 'loading'

                olNotification.load(false)
                .then(function (data){
                    updateDirect()
                })
                .catch(function (err){
                    $scope.loadState = 'loadFail'
                })
            }

            $scope.showDirect = function (senderId){
                // 顯示與當前用戶的談話
                if (_currentSender === senderId){
                    showDirect(senderId)
                } else {
                    $scope.notifications = []
                    $timeout(function (){
                        showDirect(senderId)
                    }, 350)
                }
                // 更新 `_currentSender`
                _currentSender = senderId
            }

            function updateDirect(){
                var cache = olNotification.extractDirect(_authUid)

                if (cache[0].length > 0 && Object.keys(cache[1]).length > 0){
                    $scope.senderList = cache[0]
                    _conversation = cache[1]
                    $scope.showDirect(_currentSender || $scope.senderList[0].uid)
                }

                $scope.loadState = 'loadFin'
            }
            function showDirect(senderId){
                $scope.notifications = _conversation[senderId]

                $timeout(function (){
                    var senderBtn = angular.element(
                        document.querySelector('[js-direct-sender="' + senderId + '"]')
                    );

                    // UI
                    senderBtn.parent().children().removeClass('tips--active--peace')
                    senderBtn.addClass('tips--active--peace')
                    // Scroll to Bottom
                    var msgElem = document.querySelector('.mask__notification');
                    msgElem.scrollTop = msgElem.scrollHeight
                })
            }
        }]
    }
}])