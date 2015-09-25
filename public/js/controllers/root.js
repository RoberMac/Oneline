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
    $scope.goto = function (state, e){
        if (state === 'timeline' && $scope.providerList <= 0) return;

        var target = e.target
        if (target.tagName.toLowerCase() === 'img' 
            && angular.element(target).parent().find('img').length > 1) return;

        $state.go(state)
    }

    /**
     * Control Center
     *
     */
    $scope.toggleControlCenter = function (type){
        $scope.controlCenter = $scope.controlCenter === type ? '' : type
    }
    $scope.toggleActive = function (e){
        var elem = angular.element(e.currentTarget);
        elem.toggleClass('tips--active')
    }


    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams){
        window.timelineCache = timelineCache
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