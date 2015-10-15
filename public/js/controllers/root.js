angular.module('Oneline.rootControllers', [])
.controller('rootController', [
        '$rootScope', '$window', '$scope', '$timeout', '$state',
        'olTokenHelper', 'olUI', 'timelineCache',
    function ($rootScope, $window, $scope, $timeout, $state,
        olTokenHelper, olUI, timelineCache){


    /**
     * 初始化
     */
    $scope.providerList = olTokenHelper.getProviderList()
    $scope.isTimeline = false
    $scope.controlCenter = ''

    // 刷新「社交網站列表」
    $scope.updateProviderList = function (){
        var providerList = olTokenHelper.getProviderList();

        $timeout(function (){
            $scope.providerList = providerList
            olUI.updateSocialIcon(providerList)
        })
    }
    // 設置是否顯示「控制中心」
    $scope.setControlCenter = function (state, thenSwitchTo){
        $scope.controlCenter = state

        if (thenSwitchTo){
            $timeout(function (){
                $scope.setControlCenter(thenSwitchTo)
            }, 700)
        }

        $timeout(function (){
            var cancelMask = angular.element(document.querySelector('.cancelMask__wrapper')),
                controlCenter = angular.element(document.querySelector('.controlCenter')),
                type = state.match(/replicant|read|write|userProfile/);

            if (type){
                cancelMask.addClass('cancelMask__wrapper--' + type[0])
                controlCenter.addClass('controlCenter--' + type[0])
            } else {
                cancelMask.removeClass(typeStr('cancelMask__wrapper--'))
                controlCenter.removeClass(typeStr('controlCenter--'))
            }
        })

        function typeStr(prefix){
            var typeList = ['replicant', 'read', 'write', 'userProfile'];

            return typeList.map(function (i){return prefix + i }).join(' ')
        }
    }
    // Router
    $scope.goto = function (direction, e){
        var currentState = $state.current.name;
        // R -> L
        if (direction === 'left'){
            if ($scope.providerList <= 0) return;

            currentState === 'settings'
                ? $state.go('timeline')
            : $scope.providerList.indexOf('twitter') >= 0
                ? $scope.setControlCenter('write_twitter-tweet')
            : $scope.providerList.indexOf('weibo') >= 0
                ? $scope.setControlCenter('write_weibo-tweet')
            : null
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
            } else {
                $scope.isTimeline = true
            }
        }
    })
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams){
        // * -> /settings
        if (toState.name === 'settings'){
            if (!olTokenHelper.isValidToken()){
                olTokenHelper.clearInvalidToken()
            }
            $scope.isTimeline = false
        }

        document.title = '｜'
        timelineCache.removeAll()
        $scope.updateProviderList()
        $scope.setControlCenter('')
    })
}])