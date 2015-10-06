angular.module('Oneline.rootControllers', [])
.controller('rootController', [
        '$rootScope', '$scope', '$timeout', '$state',
        'olTokenHelper', 'olUI', 'timelineCache',
    function ($rootScope, $scope, $timeout, $state,
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
    $scope.setControlCenter = function (value){
        $scope.controlCenter = value
    }
    // Router
    $scope.goto = function (direction, e){
        var currentState = $state.current.name;
        // R -> L
        if (direction === 'left'){
            if ($scope.providerList <= 0) return;

            currentState === 'settings'
                ? $state.go('timeline')
                : $scope.setControlCenter('write_twitter-tweet')
        }
        // L -> R
        else {
            currentState === 'timeline'
                ? $scope.controlCenter.indexOf('write') >= 0
                    ? $scope.setControlCenter('')
                    : $state.go('settings')
                : null
        }
    }

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams){
        // * -> /
        if (toState.name === 'timeline'){
            if (!olTokenHelper.isValidToken()){
                $state.go('settings')
            } else {
                $scope.isTimeline = true
            }
        }
        // * -> /settings
        else if (toState.name === 'settings'){
            if (!olTokenHelper.isValidToken()){
                olTokenHelper.clearToken()
            }
            $scope.isTimeline = false
        }

        document.title = '｜'
        timelineCache.removeAll()
        $scope.updateProviderList()
        $scope.controlCenter = ''
    })
}])