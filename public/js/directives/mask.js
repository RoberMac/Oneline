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
 * 查看「提及」
 *
 */
.directive('mentions', ['Action', function (Action){
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'mask/notification/mentions/twitter.html',
        link: function (scope, elem, attrs){
            var loadMoreBtn = angular.element(
                    document.querySelector('.maskTimeline--notification .loadMore--loading')
                ), _min_id, _max_id, _isFirstLoad = true;

            // Init
            scope.notifications = []
            // Fire
            loadMentions()
            // Event
            loadMoreBtn
            .on('click', function (){
                if (loadMoreBtn.hasClass('loadMoreBtn--loading')) return;

                loadMentions(_max_id)
            })

            function loadMentions(max_id){
                loadMoreBtn.addClass('loadMore--loading')

                Action.get({
                    action: 'mentions',
                    provider: attrs.provider,
                    id: max_id || 0
                })
                .$promise
                .then(function (res){
                    res = res.data;

                    if (!_isFirstLoad){
                        res.data.splice(0, 1)
                    } else {
                        _isFirstLoad = false
                    }

                    scope.notifications = scope.notifications.concat(res.data)
                    _min_id = res.max_id
                    _max_id = res.min_id

                    loadMoreBtn.removeClass('loadMore--initLoad loadMore--loading')
                })
                .catch(function (err){
                    loadMoreBtn.addClass('loadMore--loading--fail')
                })
            }
        }
    }
}])
/**
 * 查看「私信」
 *
 */
.directive('direct', ['Action', function (Action){
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'mask/notification/mentions/twitter.html',
        link: function (scope, elem, attrs){
            scope.notifications = []
            Action.get({
                action: 'direct',
                provider: attrs.provider,
                id: '0'
            })
            .$promise
            .then(function (res){
                scope.notifications = res.data.data
            })
            .catch(function (err){
            })
        }
    }
}])