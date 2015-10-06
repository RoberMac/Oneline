angular.module('Oneline.timelineControllers', [])
.controller('timelineCtrl', ['$scope', '$q', 
    'Timeline', 'olUI', 'olTimelineHelper', 'olActionsHelper', 'timelineCache',
    function($scope, $q, 
        Timeline, olUI, olTimelineHelper, olActionsHelper, timelineCache){


    /**
     * 初始化時間線
     */
    $scope.timelineData = []
    olTimelineHelper.initTimelineSettings()
    olTimelineHelper.initLoad($scope.providerList)
    .then(function (){
        $scope.timelineData = olTimelineHelper.extractOldPosts($scope.providerList)

        registerAutoRefresh()

        // 結束加載動畫
        olUI.setLoading('done', 1)
        olUI.setLoading('done', -1)
    })
    .catch(function (err){
        olTimelineHelper.handleError(err)
    })


    /**
     * 時間線操作
     *
     *  `scope.loadMore` 加載「新貼文」／「舊貼文」
     */
    $scope.loadMore = function (step){
        if (olUI.isLoading(step)) return;

        $q(function (resolve, reject){
            olUI.setLoading('start', step)

            // 加載「新貼文」
            if (step > 0){
                olUI.setPostsCount('newPosts', '')

                var newPostsFromCache = timelineCache.get('newPosts') || []

                // 從本地獲取
                if (newPostsFromCache.length > 0){
                    resolve([newPostsFromCache, 'newPosts'])
                }
                // 從後端獲取
                else {
                    olTimelineHelper.loadNewPosts($scope.providerList)
                    .then(function (){
                        resolve([timelineCache.get('newPosts') || [], 'newPosts'])
                    }, function (err){
                        reject(err)
                    })
                }
            } 
            // 加載「舊貼文」
            else {
                olTimelineHelper.checkOldPosts($scope.providerList)
                .then(function (invalidList){
                    if (invalidList.length > 0){
                        return olTimelineHelper.loadOldPosts(invalidList, $scope.providerList)
                    }
                })
                .then(function (){
                    var extractOldPosts = olTimelineHelper.extractOldPosts($scope.providerList)

                    resolve([$scope.timelineData.concat(extractOldPosts)])
                })
                .catch(function (err){
                    reject(err)
                })
            }
        })
        .then(function (data){
            if (data[1] === 'newPosts'){
                var allPosts = $scope.timelineData.concat(data[0]);

                $scope.timelineData = olTimelineHelper.removeOldPosts(allPosts, $scope.providerList)
                timelineCache.put('newPosts', [])
            } else {
                $scope.timelineData = data[0]
            }

            olUI.setDivider(step)
            olUI.setLoading('done', step)
        })
        .catch(function (err){
            olTimelineHelper.handleError(err, step)
        })
    }


    /**
     * 其他操作
     *
     *
     */
    $scope.toggleAction = function (action, item){
        var provider = item.provider,
            id       = item.id_str;

        // 過濾重複（或凍結的）請求
        if (olUI.isActionWait(action, id) || olUI.isActionFrozen(action, id)) return;

        var isActive = olUI.isActionActive(action, id);

        // 處理「轉推」與「回覆」
        if (provider === 'twitter' 
            && (
                (action === 'retweet' && !isActive) || action === 'reply')
            )
        {

            $scope.setControlCenter('write_twitter-'+ action + ':' + id + ':' + item.user.screen_name)
            return;
        }
        // 更改樣式
        olUI.setActionState(action, id, 'wait')
        olUI.setActionState(action, id, isActive ? 'inactive' : 'active')
        // 發送請求
        olActionsHelper.toggleAction(action, provider, id, isActive)
        .catch(function (err){
            olUI.setActionState(action, id, isActive ? 'active' : 'inactive')
        })
        .finally(function (){
            olUI.setActionState(action, id, 'done')
        })
    }

    // 定時獲取「新貼文」
    function registerAutoRefresh(){
        $scope.autoRefresh = setInterval(function (){
            olUI.setLoading('start', 1)

            olTimelineHelper.loadNewPosts($scope.providerList)
            .then(function (){
                var newPostsLength = (timelineCache.get('newPosts') || []).length
                // 設置提醒
                olUI.setLoading('done', 1)
                olUI.setPostsCount('newPosts', newPostsLength)
            })
            .finally(function (){
                olUI.setLoading('done', 1)
            })
        }, 1000 * 60 * 3)

        $scope.$on('$destroy', function (){
            clearInterval($scope.autoRefresh)
        })
    }
}])