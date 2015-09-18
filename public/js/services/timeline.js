angular.module('Oneline.timelineServices', [])
.service('olTimelineHelper', ['$q', '$state', 'Timeline', 'timelineCache', 'olUI', 'olTokenHelper',
    function($q, $state, Timeline, timelineCache, olUI, olTokenHelper){

    var time_pointer   = Date.now();
    var retrieve_count = 90;
    var TIME_RANGE     = 1800000;

    /**
     * 初始化相關
     *
     */
    this.initLoad = function (providerList){
        var defer = $q.defer();
        var _this = this;

        Timeline
        .initLoad()
        .$promise
        .then(function (posts){
            if (!posts || (posts.data && posts.data.length < 1)){
                defer.reject({ status: 304 })
                return;
            }
            // 保存貼文與 min_id & min_date
            _this.storePosts('oldPosts', posts, providerList)
            // 保存 max_id & max_date
            var fakeNewPosts = {
                data    : [],
                max_id  : posts.max_id,
                max_date: posts.max_date
            }
            _this.storePosts('newPosts', fakeNewPosts, providerList)

            // 獲取 30 分鐘內貼文
            return _this
            .checkOldPosts(providerList)
            .then(function (invalidList){
                if (invalidList.length > 0){
                    return _this.loadOldPosts(invalidList, providerList)
                } else {
                    defer.resolve()
                }
            })
        })
        .then(function (){
            defer.resolve()
        })
        .catch(function (err){
            defer.reject(err)
        })

        return defer.promise;
    }
    this.initTimelineSettings = function (){
        time_pointer = Date.now()
        retrieve_count = 50
        // 清空 `timelineCache`
        timelineCache.removeAll()
    }
    /**
     * 「新／舊帖文」相關
     *
     */
    // 獲取最「新／舊貼文」的 max_id / min_id
    this.getId = function (typeOfPosts, providerList){
        var id_str1, id_str2,
            posts = timelineCache.get(typeOfPosts);

        var str = ''

        if (typeOfPosts === 'oldPosts'){
            id_str1 = '_maxId-'
            id_str2 = '_min_id'
        } else {
            id_str1 = '_minId-'
            id_str2 = '_max_id'
        }

        providerList.forEach(function (provider, index){
            var oldPosts = timelineCache.get('oldPosts'),
                id_s = provider
                    + id_str1
                    + timelineCache.get(provider + id_str2)
                    + (index === providerList.length - 1 ? '' : ',')

            str += id_s
        })

        return str
    }
    // 保存「新／舊貼文」
    this.storePosts = function (typeOfPosts, posts, providerList){
        var type_str, id_str, id_date,
            cache = timelineCache.get(typeOfPosts) || [];

        if (typeOfPosts === 'oldPosts'){
            type_str = 'min'
            id_str   = '_min_id'
            id_date  = '_min_date'
        } else {
            type_str = 'max'
            id_str   = '_max_id'
            id_date  = '_max_date'
        }

        // 保存貼文 id 和 date
        providerList.forEach(function (provider){
            var id_key     = provider + id_str,
                id_value   = posts[type_str + '_id'][provider],
                date_key   = provider + id_date,
                date_value = posts[type_str + '_date'][provider];

            if (id_value){
                timelineCache.put(id_key, id_value)
            }
            if (date_value){
                timelineCache.put(date_key, date_value)
            }
        })

        // 保存貼文
        cache = cache.concat(posts.data)
        timelineCache.put(typeOfPosts, cache)
    }

    // 檢查 Provider 最舊的的貼文是否在「時間指針」30 分鐘範圍內，判斷是否需要從後端獲取「舊貼文」
    this.checkOldPosts = function (providerList){
        return $q(function (resolve, reject){
            var invalidList =  providerList.filter(function (provider){
                return time_pointer - timelineCache.get(provider + '_min_date') < TIME_RANGE
            })

            resolve(invalidList)
        })
    }
    // 獲取「時間指針」 30 分鐘內的「舊貼文」
    this.extractOldPosts = function (providerList){
        var oldPosts = timelineCache.get('oldPosts') || [],
            isEmpty = true,
            cache;

        while (isEmpty){
            cache = oldPosts.filter(function (item){
                var time_diff = time_pointer - item.created_at;

                return 0 < time_diff && time_diff <= TIME_RANGE;;
            })

            time_pointer -= TIME_RANGE

            if (cache.length > 0){
                isEmpty = false
            }
        }

        this.updateOldPostsCount(providerList)

        return cache;
    }
    // 向後端請求加載「舊貼文」
    this.loadOldPosts = function (invalidList, providerList){
        var defer = $q.defer()

        var _this = this;
        var count = retrieve_count;

        function fetchPosts(invalidList){
            var defer = $q.defer()

            var max_id_str = _this.getId('oldPosts', invalidList);

            Timeline
            .load({ id: max_id_str, count: count })
            .$promise
            .then(function (oldPosts){
                if (!oldPosts || (oldPosts.data && oldPosts.data.length < 1)){
                    defer.reject({ status: 304 })
                    return;
                }

                // 過濾 Twitter 返回的「舊貼文」中包含 max_id 貼文
                if (oldPosts.min_date.twitter){
                    oldPosts.data.splice(0, 1)
                }
                _this.storePosts('oldPosts', oldPosts, providerList)

                // 若一次未能滿足，下次獲取時「加量」
                count < 100 ? count += 10 : null

                defer.resolve()
            })
            .catch(function (err){
                defer.reject(err)
            })

            return defer.promise;
        }
        function isLoadFin(){
            var defer = $q.defer()

            _this.checkOldPosts(providerList)
            .then(function (invalidList){
                if (invalidList.length > 0){
                    fetchPosts(invalidList)
                    .then(isLoadFin)
                    .then(function (){
                        defer.resolve()
                    })
                    .catch(function (err){
                        defer.reject(err)
                    })
                } else {
                    defer.resolve()
                }
            })

            return defer.promise;
        }

        fetchPosts(invalidList)
        .then(isLoadFin)
        .then(function (){
            retrieve_count < 100 ? retrieve_count += 10 : null

            defer.resolve()
        })
        .catch(function (err){
            defer.reject(err)
        })

        return defer.promise;
    }
    // 向後端請求加載「新貼文」
    this.loadNewPosts = function (providerList){
        var defer = $q.defer()
            _this = this;

        Timeline
        .load({
            id: _this.getId('newPosts', providerList),
            count: 70
        })
        .$promise
        .then(function (newPosts){
            if (newPosts.data && newPosts.data.length > 0){
                _this.storePosts('newPosts', newPosts, providerList)
                defer.resolve()
            } else {
                defer.reject({ status: 304 })
            }
        }, function (err){
            defer.reject(err)
        })

        return defer.promise;
    }
    // 折疊「舊貼文」（大於 TIME_RANGE * 2）
    this.removeOldPosts = function (timelineData, providerList){
        var now = Date.now(),
            cache = timelineData.filter(function (item){
                return now - item.created_at < TIME_RANGE * 2
            });

        time_pointer = now - TIME_RANGE * 2
        this.updateOldPostsCount(providerList)

        return cache;
    }
    // 更新（本地）「舊帖文」數目提示
    this.updateOldPostsCount = function (providerList){
        this.checkOldPosts(providerList)
        .then(function (invalidList){
            // 從後端加載
            if (invalidList.length > 0){
                olUI.setPostsCount('oldPosts', '')
            }
            // 從本地加載
            else {
                var oldPosts = timelineCache.get('oldPosts') || [],
                    oldPostsCount = 0;

                oldPosts.forEach(function (item){
                    var time_diff = time_pointer - item.created_at;

                    if (0 < time_diff && time_diff <= TIME_RANGE){
                        oldPostsCount ++
                    }
                })

                olUI.setPostsCount('oldPosts', oldPostsCount === 0 ? '' : oldPostsCount)
            }
        })
    }
    this.handleError = function (err, step){
        console.log(err)
        if (!err){
            olUI.setLoading('fail', step)
            return;
        }

        if (err.status === 401){
            olTokenHelper.clearToken()
            $state.go('settings')
        } else if (err.status === 429){
            olUI.setLoading('fail', step)
            var safeTime = new Date(err.data.reset * 1000).toLocaleTimeString('en-GB').substring(0, 5)
            olUI.setPostsCount('newPosts', safeTime)
        } else {
            olUI.setLoading('done', step)
        }
    }
}])