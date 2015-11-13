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
 * 查看「提及」&「私信」
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
                    $scope.loadMentions()
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

            $scope.loadMentions = function (){
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
.directive('direct', ['$timeout', '$filter', 'olNotification',
    function ($timeout, $filter, olNotification){

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'mask/notification/direct/twitter.html',
        controller: ['$scope', '$element', 'store', function ($scope, $element, store){
            var _provider = $element.attr('provider'),
                _authUid = store.get('profile_' + _provider).uid,
                _notifications, _conversation, _currentSender, _senderList;

            // Init
            $scope.notifications = []
            $scope.senderList = []
            $scope._authUid = _authUid
            $scope.loadState = 'initLoad'

            _notifications = olNotification.initLoad(_provider, 'direct');
            // 從本地獲取
            if (_notifications && _notifications.length > 0){
                $timeout(function (){
                    $scope.updateDirect(_notifications)
                    $scope.loadDirect()
                }, 700)
            }
            // 初次獲取
            else {
                olNotification.load(true)
                .then(function (data){
                    $scope.updateDirect(data)
                })
                .catch(function (err){
                    $scope.loadState = 'loadFail'
                })
            }

            $scope.loadDirect = function (){
                if ($scope.loadState === 'loading') return;

                $scope.loadState = 'loading'

                olNotification.load(false)
                .then(function (data){
                    $scope.updateDirect(data)
                })
                .catch(function (err){
                    $scope.loadState = 'loadFail'
                })
            }

            $scope.showDirect = function (sender, isUpdateDirect){
                // 刷新
                if (isUpdateDirect){
                    showDirect(sender.uid)
                    $scope.senderList = [sender]
                }
                // 顯示／隱藏
                else if (_currentSender && _currentSender.uid === sender.uid){
                    // 當前用戶插到最前
                    _senderList = _senderList.filter(function (_sender){
                       return _sender.uid !== sender.uid
                    })
                    _senderList.unshift(sender)

                    if ($scope.senderList.length === _senderList.length){
                        $scope.senderList = [sender]
                    } else {
                        $scope.senderList = _senderList
                    }
                }
                // 切換
                else {
                    $scope.notifications = []
                    $timeout(function (){
                        showDirect(sender.uid)
                    }, 350)

                    $scope.senderList = [sender]
                }

                _currentSender = sender
            }

            $scope.updateDirect = function(_notifications){
                var cache = olNotification.extractDirect(_authUid, _notifications)

                if (cache[0].length > 0 && Object.keys(cache[1]).length > 0){
                    _senderList = cache[0]
                    _conversation = cache[1]
                    $scope.showDirect(_currentSender || _senderList[0], true)
                }

                $scope.loadState = 'loadFin'
            }
            function showDirect(senderId){
                $scope.notifications = _conversation[senderId]

                $timeout(function (){
                    // Scroll to Bottom
                    var msgElem = document.querySelector('.direct__container');
                    msgElem.scrollTop = msgElem.scrollHeight
                })
            }
        }]
    }
}])
.directive('writeDirect', ['store', 'olWriteMini', function (store, olWriteMini){
    return {
        restrict: 'A',
        require: '^direct',
        templateUrl: 'mask/component/write-mini.html',
        link: function (scope, elem, attrs){
            // Init
            olWriteMini.init(
                elem.find('input'), // statusElem
                elem.find('button') // submitButton
            )
            // Event
            elem
            .on('submit', function (e){
                e.preventDefault()

                var _provider = 'twitter';

                olWriteMini.submit('twitter', 'direct', elem.attr('write-direct'))
                .then(function (data){
                    // Store
                    var _notifications = store.get('notification_d_' + _provider).notifications;
                    _notifications = _notifications.concat(data.data)
                    store.set('notification_d_' + _provider, {
                        notifications: _notifications,
                        max_id: data.max_id
                    })
                    // Refresh
                    scope.updateDirect(_notifications)
                })
            })
            .on('input', function (){
                olWriteMini.input()
            })
            .on('$destroy', function (){
                elem.off()
            })
        }
    }
}])