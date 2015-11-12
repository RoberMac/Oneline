angular.module('Oneline.timelineServices', [])
.service('olTimelineHelper', ['$q', '$state',
    'Timeline', 'timelineCache', 'olUI', 'olTokenHelper', 'Action', 'store', 'arrayUnique',
    function($q, $state,
        Timeline, timelineCache, olUI, olTokenHelper, Action, store, arrayUnique){

    var time_pointer   = Date.now();
    var TIME_RANGE     = 1800000;

    /**
     * 初始化相關
     *
     */
    this.initLoad = function (providerList){
        var defer = $q.defer();
        var _this = this;

        Timeline
        .get()
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
    }
    /**
     * 「新／舊帖文」相關
     *
     */
    // 獲取最「新／舊貼文」的 max_id / min_id
    this.getId = function (typeOfPosts, providerList){
        var id_str1, id_str2;

        var str = ''

        if (typeOfPosts === 'oldPosts'){
            id_str1 = '_maxId-'
            id_str2 = '_min_id'
        } else {
            id_str1 = '_minId-'
            id_str2 = '_max_id'
        }

        providerList.forEach(function (provider, index){
            var id_s = provider
                    + id_str1
                    + timelineCache.get(provider + id_str2)
                    + (index === providerList.length - 1 ? '' : ',');

            str += id_s
        })

        return str;
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

        function fetchPosts(invalidList){
            var defer = $q.defer()

            var max_id_str = _this.getId('oldPosts', invalidList);

            Timeline
            .get({ id: max_id_str })
            .$promise
            .then(function (oldPosts){
                if (!oldPosts || !oldPosts.data || (oldPosts.data && oldPosts.data.length < 1)){
                    defer.reject({ status: 304 })
                } else {
                    _this.storePosts('oldPosts', oldPosts, providerList)

                    defer.resolve()
                }
            })
            .catch(function (err){
                defer.reject(err)
            })

            return defer.promise;
        }

        fetchPosts(invalidList)
        .then(function (){
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
        .get({ id: _this.getId('newPosts', providerList) })
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
    // 折疊「舊貼文」（大於 TIME_RANGE * 1）
    this.removeOldPosts = function (timelineData, newPosts, providerList){
        var now = Date.now(),
            oldPostsCache = timelineCache.get('oldPosts') || [];

        // 保存「舊貼文」
        oldPostsCache = oldPostsCache.concat(newPosts)
        timelineCache.put('oldPosts', oldPostsCache)

        // 重置「時間指針」
        time_pointer = now - TIME_RANGE

        this.updateOldPostsCount(providerList)
        return timelineData.filter(function (item){
            return now - item.created_at < TIME_RANGE
        })
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
        if (!err) return;

        var _step = step;
        step = _step ? _step : 1

        switch (err.status){
            case 304:
                olUI.setLoading('done', step)
                break;
            case 401:
                var invalidToken = err.data.invalidToken || ['twitter', 'instagram', 'weibo'];

                invalidToken.forEach(function (provider){
                    olTokenHelper.removeToken(provider)
                })
                $state.go('settings')
                break;
            case 429:
                var _safeTime = err.data.reset * 1000,
                    safeTime  = new Date(_safeTime).toLocaleTimeString('en-GB').substring(0, 5),
                    typeOfPosts = step === 1 ? 'newPosts' : 'oldPosts';

                olUI.setLoading('fail', step)
                olUI.setPostsCount(typeOfPosts, safeTime)
                setTimeout(function (){
                    olUI.setPostsCount(typeOfPosts, '⟳')
                }, _safeTime - Date.now())
                break;
            default:
                olUI.setLoading('fail', step)
                break;
        }
    }
    // Action
    this.toggleAction = function (action, provider, id, isActive){
        var method = isActive ? 'destroy' : 'create',
            _id = id;

        if (action === 'retweet' && method === 'destroy'){
            id = olUI.actionData(action, _id)
        }

        return Action[method]({ action: action, provider: provider, id: id })
        .$promise
        .then(function (data){

            if (method === 'create'){
                if (action === 'retweet'){
                    olUI.actionData(action, _id, data.id_str)
                }

                if (action !== 'star'){
                    var count = ~~olUI.actionData(action, _id, null, 'count') + 1;

                    olUI.actionData(action, _id, count, 'count')
                }
            } else {
                if (action !== 'star'){
                    var count = ~~olUI.actionData(action, _id, null, 'count') - 1;

                    olUI.actionData(action, _id, count > 0 ? count : '', 'count')
                }
            }
        })
    }
    // 紀錄時間線上出現的「提及」用戶
    this.recordMentions = function (providerList){
        var _MAX_COUNT_L1 = 2000;
        var _MAX_COUNT_L2 = 3000;
        var regex = {
            twitter: /(|\s)*@([\w]+)/g,
            instagram: /(|\s)*@([\w\.]+)/g,
            weibo: /(|\s)*@([\u4e00-\u9fa5\w-]+)/g
        };
        var prefix = {
            twitter: '//twitter.com/',
            instagram: '//instagram.com/',
            weibo: '//weibo.com/n/'
        };

        providerList.forEach(function (provider){
            if (provider === 'instagram') return;

            var _mentionsList = store.get('mentions_' + provider) || [],
                _target = [
                    document.querySelectorAll('.timeline--' + provider + ' p'),
                    document.querySelectorAll(
                        '.timeline--' + provider + ' .timeline__profile__fullname a'
                    )
                ];

            // 從（時間線上）貼文文本提取
            angular.forEach(angular.element(_target[0]), function (item){

                var mentions = item.innerText.match(regex[provider]);

                if (!mentions) return;

                // Trim
                mentions = mentions.map(function(i){return i.trim()})

                if (provider === 'twitter'){
                    mentions = mentions.map(function (i){
                        return { 's': i }
                    })
                }
                // 控制最大存儲數 (Level 1: 去除 Twitter 文本提取項)
                if (_mentionsList.length >= _MAX_COUNT_L1){
                    var _len = mentions.length;

                    if (provider === 'twitter'){
                        _mentionsList = _mentionsList.filter(function (item){
                            if (!item.hasOwnProperty('u') && _len > 0){
                                _len --
                                return false;
                            } else {
                                return true;
                            }
                        })
                    } else {
                        _mentionsList.splice(0, _len) 
                    }
                }

                _mentionsList = _mentionsList.concat(mentions)
            })

            // 從（時間線上）貼文貼主提取
            angular.forEach(angular.element(_target[1]), function (item){
                var _item = angular.element(item),
                    _href = _item.attr('href');

                if (!_href) return;

                var mentions = '@' + _href.replace(prefix[provider], '');

                if (provider === 'twitter'){
                    mentions = { 's': mentions, 'u': _item.find('strong').text() }
                }

                _mentionsList.push(mentions)
            })


            // 去重
            _mentionsList = provider === 'twitter'
                                ? arrayUnique.obj(_mentionsList)
                            : arrayUnique.literal(_mentionsList)

            // 控制最大存儲數 (Level 2: 去除舊項)
            if (_mentionsList.length >= _MAX_COUNT_L2){
                var _len = _mentionsList.length - _MAX_COUNT_L2;
                _mentionsList.splice(0, _len) 
            }

            // Store
            store.set('mentions_' + provider, _mentionsList)
        })
    }
}])