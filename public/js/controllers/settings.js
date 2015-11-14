angular.module('Oneline.settingsControllers', [])
.controller('settingsCtrl', ['$scope', '$window', 
    'olTokenHelper', 'Auth',
    function($scope, $window, 
        olTokenHelper, Auth){


    /**
     * 跨標籤頁通信
     *     監聽新標籤頁的 localStorage 存儲
     *
     */
    var _window = angular.element($window)
    _window
    .on('storage', function (e){
        if (e.key !== 'addToken') return;

        olTokenHelper.addToken()
        $scope.updateProviderList()
    })
    $scope.$on('$destroy', function (){
        _window.off('storage')
    })
    // 添加／刪除「社交網站」授權
    $scope.toggleAuth = function (provider){
        if ($scope.providerList.indexOf(provider) < 0){
            $window.open('/auth/' + provider, '_blank')
        } else {
            // 刪除後端授權信息
            Auth.revoke({provider: provider})
            .$promise
            .finally(function (){
                // 刪除前端授權信息
                olTokenHelper.removeToken(provider)
                $scope.updateProviderList()
            })
        }
    }
}])