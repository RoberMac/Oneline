angular.module('Oneline.maskDirectives', [])
/**
 * 查看用戶信息
 *
 */
.directive('userProfile', ['$timeout', '$compile', '$templateRequest', 'Action', 'store',
    function($timeout, $compile, $templateRequest, Action, store){

    return {
        restrict: 'A',
        scope: {
            profile: '=userProfile'
        },
        link: function (scope, elem, attrs){
            elem.on('click', function (){
                var _provider = attrs.provider,
                    _profile  = scope.profile || store.get('profile_' + _provider),
                    _from     = attrs.from,
                    _uid      = _profile.uid;

                // Init
                if (_from === 'controlCenter' && elem.hasClass('tips--frozen')) return;

                scope.user = {
                    screen_name: _profile.screen_name,
                    avatar: _profile.avatar,
                    name: _profile.name,
                    uid: _uid
                }

                // Show Profile
                $timeout(function (){
                    var _mask = angular.element(document.querySelector('.cancelMask__wrapper'));

                    $templateRequest('mask/user/' + _provider + '.html')
                    .then(function (html){
                        _mask.children()
                        .empty()
                        .append($compile(html)(scope))
                    })
                })
                // Fire
                _from === 'controlCenter' ? elem.addClass('timeline__media--loading') : null

                Action.get({
                    action: 'user',
                    provider: _provider,
                    id: _uid
                })
                .$promise
                .then(function (res){
                    angular.extend(scope.user, res.data)
                    _from === 'controlCenter' ? elem.addClass('timeline__media--active') : null
                })
                .catch(function (){
                    scope.user.protected = true
                     _from === 'controlCenter' ? elem.addClass('tips--frozen') : null
                })
                .finally(function (){
                     _from === 'controlCenter' ? elem.removeClass('timeline__media--loading') : null
                })
            })

            elem.on('$destroy', function (){
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
 * 查看「提及」& 「私信」
 *
 */
.directive('mentions', ['$timeout', 'olNotification', function ($timeout, olNotification){

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'mask/notification/mentions/twitter.html',
        controller: ['$scope', '$element',function ($scope, $element){
            var _provider = $element.attr('provider'),
                _notifications;

            // Init
            $scope.notifications = []
            _notifications = olNotification.initLoad(_provider, 'mentions');

            if (_notifications && _notifications.length > 0){
                $timeout(function (){
                    $scope.notifications = _notifications

                    angular.element(document.querySelectorAll('[js-load-mentions]'))
                    .removeClass('loadMore__btn--loading')
                    .parent().removeClass('loadMore--initLoad')
                }, 700)
            } else {
                olNotification.load()
                .then(function (data){
                    $scope.notifications = data
                })
            }

            $scope.loadMentions = function (type){
                var loadMoreBtn = angular.element(
                        document.querySelector('[js-load-mentions="' + type + '"]')
                    );

                if (loadMoreBtn.hasClass('loadMore__btn--loading')) return;

                olNotification.load(type, loadMoreBtn)
                .then(function (data){
                    $scope.notifications = data
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
                _uid = store.get('profile_' + _provider).uid,
                _notifications;

            // Init
            $scope.notifications = []
            $scope.senderList = []
            $scope._uid = _uid

            _notifications = olNotification.initLoad(_provider, 'direct');

            if (_notifications && _notifications.length > 0){
                $timeout(function (){
                    updateDirect(_notifications)

                    angular.element(document.querySelectorAll('[js-load-direct]'))
                    .removeClass('loadMore__btn--loading')
                    .parent().removeClass('loadMore--initLoad')
                }, 700)
            } else {
                olNotification.load()
                .then(function (data){
                    updateDirect(data)
                })
            }

            $scope.loadDirect = function (type){
                var loadMoreBtn = angular.element(
                        document.querySelector('[js-load-direct="' + type + '"]')
                    );

                if (loadMoreBtn.hasClass('loadMore__btn--loading')) return;

                olNotification.load(type, loadMoreBtn)
                .then(function (data){
                    updateDirect(data)
                })
            }

            $scope.showDirect = function (senderId){
                var senderBtn = angular.element(
                    document.querySelector('[js-direct-sender="' + senderId + '"]')
                );

                // Enter
                $scope.notifications = $filter('filter')(_notifications, function (value, index, array){
                    return value.sender.uid === senderId || 
                            (value.sender.uid === _uid && value.recipient.uid === senderId)
                })
                // UI
                senderBtn.parent().children().removeClass('tips--active--peace')
                senderBtn.addClass('tips--active--peace')
            }

            function updateDirect(data){
                _notifications = data
                $scope.senderList = olNotification.extractSenders(data, _uid)
            }
        }]
    }
}])