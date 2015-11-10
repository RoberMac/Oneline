angular.module('Oneline.rootControllers', [])
.controller('rootController', [
        '$q', '$rootScope', '$window', '$scope', '$timeout', '$state',
        'olTokenHelper', 'olUI', 'timelineCache',
    function ($q, $rootScope, $window, $scope, $timeout, $state,
        olTokenHelper, olUI, timelineCache){


    /**
     * 初始化
     */
    $scope.providerList = olTokenHelper.getProviderList()
    $scope.controlCenter = ''

    // 刷新「社交網站列表」
    $scope.updateProviderList = function (){
        var providerList = olTokenHelper.getProviderList();

        $timeout(function (){
            $scope.providerList = providerList
        })
    }
    // 設置是否顯示「控制中心」
    $scope.setControlCenter = function (state, thenSwitchTo){
        var defer = $q.defer()

        if (state === '' && $state.current.name === 'timeline.action'){
            $state.go('timeline')
        }

        $scope.controlCenter = state

        if (thenSwitchTo){
            $timeout(function (){
                $scope.setControlCenter(thenSwitchTo)
                defer.resolve()
            }, 700)
        } else {
            defer.resolve()
        }

        $timeout(function (){
            var cancelMask = angular.element(document.querySelector('.cancelMask__wrapper')),
                controlCenter = angular.element(document.querySelector('.controlCenter')),
                type = state.match(/replicant|read|write|notification/);

            if (type){
                cancelMask.addClass('cancelMask__wrapper--' + type[0])
                controlCenter.addClass('controlCenter--' + type[0])
            } else {
                cancelMask.removeClass(typeStr('cancelMask__wrapper--'))
                controlCenter.removeClass(typeStr('controlCenter--'))
            }
        })

        function typeStr(prefix){
            var typeList = ['replicant', 'read', 'write', 'notification'];

            return typeList.map(function (i){return prefix + i }).join(' ')
        }

        return defer.promise;
    }
    // Router
    $scope.goto = function (direction, e){
        var currentState = $state.current.name;
        // R -> L
        if (direction === 'left'){
            if ($scope.providerList <= 0) return;

            currentState === 'settings'
                ? $state.go('timeline')
            : angular.element(document.querySelector('[js-show-menu]')).triggerHandler('click')
        }
        // L -> R
        else {
            currentState === 'timeline'
                ? !!$scope.controlCenter
                    ? $scope.setControlCenter('')
                    : $state.go('settings')
                : null
        }
    }
    // 按 Esc 鍵取消操作
    angular.element($window).on('keydown', function (e){
        if (e.keyCode === 27){
            $scope.$apply(function (){
                $scope.setControlCenter('')
            })
        }
    })

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams){
        // * -> /
        if (toState.name === 'timeline'){
            if (!olTokenHelper.isValidToken()){
                event.preventDefault()
                $state.go('settings')
            }
        }
    })
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams){
        // * -> /settings
        if (toState.name === 'settings'){
            if (!olTokenHelper.isValidToken()){
                olTokenHelper.clearInvalidToken()
            }

            document.title = '｜'
            timelineCache.removeAll()
            $scope.updateProviderList()
            $scope.setControlCenter('')
        }
    })
}])