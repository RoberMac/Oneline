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

                olMask.switch(scope)                
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
/**
 * 查看用戶信息
 *
 */
.directive('userProfile', ['Action', 'store', 'olMask',
    function(Action, store, olMask){

    return {
        restrict: 'A',
        link: function (scope, elem, attrs){
            elem
            .on('click', function (){
                var _provider = attrs.userProfile.split(':')[0],
                    _from     = attrs.userProfile.split(':')[1],
                    _profile  = scope._profile || store.get('profile_' + _provider);


                // Init
                if (_from === 'controlCenter' && elem.hasClass('tips--frozen')) return;
                if (_from === 'timeline'){
                    olMask.switch(scope)
                    .then(function (){
                        setup()
                    })
                } else {
                    setup()
                }

                function setup(){
                    scope.loadState = 'initLoad'
                    scope.user = {
                        screen_name: _profile.screen_name,
                        avatar: _profile.avatar,
                        name: _profile.name,
                        uid: _profile.uid
                    }
                    scope.loadUserTimeline = function (){
                        if (scope.loadState === 'loading') return;

                        var timeline = document.querySelectorAll('.profile .timeline'),
                            _min_id  = angular.element(timeline[timeline.length - 1]).attr('data-id');

                        scope.loadState = 'loading'

                        olMask.loadOldPosts('user_timeline', _provider, _profile.uid, _min_id)
                        .then(function (data){
                            scope.user.timeline = scope.user.timeline.concat(data)

                            scope.loadState = 'loadFin'
                        })
                        .catch(function (err){
                            scope.loadState = 'loadFail'
                        })
                    }

                    // Show Profile
                    olMask.append('mask/user/' + _provider + '.html', scope)
                    // Fire
                    _from === 'controlCenter' ? elem.addClass('timeline__media--loading') : null

                    Action.get({
                        action: _provider !== 'weibo' || !scope._profile ? 'user' : 'user_in_tweet',
                        provider: _provider,
                        id: _provider !== 'weibo' || !scope._profile ? _profile.uid : scope._id_str
                    })
                    .$promise
                    .then(function (res){
                        angular.extend(scope.user, res.data)

                        scope.loadState = 'loadFin'
                        _from === 'controlCenter' ? elem.addClass('timeline__media--active') : null
                    })
                    .catch(function (){
                        scope.user.protected = true
                        scope.loadState = 'loadFail'
                         _from === 'controlCenter' ? elem.addClass('tips--frozen') : null
                    })
                    .finally(function (){
                         _from === 'controlCenter' ? elem.removeClass('timeline__media--loading') : null
                    })
                }
            })
            .on('$destroy', function (){
                elem.off('click')
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
 * 搜索「貼文」（地理位置、Tags 等）
 *
 */
.directive('search', ['Action', 'olMask', 
    function (Action, olMask){

    return {
        restrict: 'A',
        link: function (scope, elem, attrs){
            elem
            .on('click', function (){
                var _info = attrs.search.split('---'),
                    _provider = _info[0],
                    _type = _info[1],
                    _q = _info[2],
                    _title = _info[3],
                    _action = _provider === 'twitter' ? 'search' : _type + '_timeline';

                // Init
                olMask.switch(scope)
                .then(function (){
                    setup()
                })

                function setup(){
                    scope.loadState = 'initLoad'
                    scope.search = {
                        type: _type,
                        title: _title,
                        q: _q
                    }

                    scope.loadMore = function (){
                        if (scope.loadState === 'loading') return;

                        var timeline = document.querySelectorAll('.profile .timeline'),
                            min_timeline = angular.element(timeline[timeline.length - 1]),
                            _min_id  = _provider === 'weibo'
                                            ? min_timeline.attr('data-created')
                                        : min_timeline.attr('data-id');

                        scope.loadState = 'loading'

                        olMask.loadOldPosts(_action, _provider, _q, _min_id)
                        .then(function (data){
                            scope.search.timeline = scope.search.timeline.concat(data)

                            scope.loadState = 'loadFin'
                        })
                        .catch(function (err){
                            scope.loadState = 'loadFail'
                        })
                    }
                    // Show Profile
                    olMask.append('mask/search/' + _provider + '.html', scope)
                    // Fire
                    Action.get({
                        action: _action,
                        provider: _provider,
                        id: _q
                    })
                    .$promise
                    .then(function (res){
                        scope.search.timeline = res.data

                        scope.loadState = 'loadFin'
                    })
                    .catch(function (){
                        scope.loadState = 'loadFail'
                    })
                }
            })
            .on('$destroy', function (){
                elem.off('click')
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