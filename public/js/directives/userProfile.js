angular.module('Oneline.userProfileDirectives', [])
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