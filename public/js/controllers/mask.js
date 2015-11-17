angular.module('Oneline.maskControllers', [])
.controller('maskCtrl', ['$scope', '$state', '$stateParams', 'Action', 'store', 'olMask',
    function ($scope, $state, $stateParams, Action, store, olMask){

    var _provider = $stateParams.provider,
        _action = $stateParams.action,
        __action = _provider === 'twitter' 
                        ? _action === 'user'
                            ? 'user'
                        : 'search' 
                    : _action,
        _id = $stateParams.id,
        __id = _provider === 'twitter'
                    ?  _action === 'tags'
                        ? '#' + _id
                    : _action === 'location'
                        ? 'place:' + _id
                    : _id
                : _id,
        _x = $stateParams.x;

    if ($scope.providerList.indexOf(_provider) < 0){
        $state.go('settings')
    }

    // Init
    var isReadCtrlCenter = $scope.controlCenter.indexOf('read') >= 0;

    if (isReadCtrlCenter){
        var readBtn = angular.element(document.querySelector('[data-btn="' + _id + '"]'));

        if (readBtn.hasClass('tips--frozen')) return;

        setup()
    } else {
        $scope.setControlCenter('fullmask')
        .then(function (){
            setup()
        })
    }

    function setup(){
        $scope.loadState = 'initLoad'
        $scope.mask = {}

        if (_action !== 'user'){
            angular.extend($scope.mask, {
                type: _action,
                title: _x,
                q: _id
            })
        }

        $scope.loadMaskTimeline = function (){
            if ($scope.loadState === 'loading') return;

            var _loadAction = _action === 'user' ? 'user_timeline' : __action,
                timeline = document.querySelectorAll('.mask .timeline'),
                min_timeline = angular.element(timeline[timeline.length - 1]),
                _min_id  = _provider === 'weibo' && _action === 'location'
                                ? min_timeline.attr('data-created')
                            : min_timeline.attr('data-id');

            $scope.loadState = 'loading'

            olMask.loadOldPosts(_loadAction, _provider, __id, _min_id)
            .then(function (data){
                $scope.mask.timeline = $scope.mask.timeline.concat(data)

                $scope.loadState = 'loadFin'
            })
            .catch(function (err){
                $scope.loadState = 'loadFail'
            })
        }
        $scope.isAuthUser = function (provider, uid){
            return store.get('profile_' + provider).uid === uid;
        }

        // Show
        var _url = 'mask/' + (_action === 'user' ? 'user' : 'search') + '/' + _provider + '.html';
        olMask.append(_url, $scope)

        // Fire
        isReadCtrlCenter ? readBtn.addClass('timeline__media--loading') : null

        Action.get({
            action: __action,
            provider: _provider,
            id: __id
        })
        .$promise
        .then(function (res){
            angular.extend(
                $scope.mask,
                _action === 'user'
                    ? res.data
                : { timeline: res.data }
            )
            $scope.loadState = 'loadFin'
            isReadCtrlCenter ? readBtn.addClass('timeline__media--active') : null
        })
        .catch(function (){
            angular.extend($scope.mask, {
                avatar: '/public/img/src/locked.svg',
                protected: true
            })
            $scope.loadState = 'loadFail'
            isReadCtrlCenter ? readBtn.addClass('tips--frozen') : null
        })
        .finally(function (){
            isReadCtrlCenter ? readBtn.removeClass('timeline__media--loading') : null
        })
    }

}])