angular.module('Oneline.maskServices', [])
.service('olNotification', ['$q', 'store', 'Action', function($q, store, Action){

    var _provider, _action, _key, _notifications, _min_id, _max_id;

    this.initLoad = function (provider, action){
        _provider = provider
        _action = action
        _key = action === 'mentions'
                    ? 'notification_m_' + provider
                : 'notification_d_' + provider

        _info = store.get(_key) || {}
        _notifications = _info.notifications || []
        _min_id = _info.min_id
        _max_id = _info.max_id

        return _notifications;
    }
    this.load = function(type, loadMoreBtn){
        var defer = $q.defer()

        loadMoreBtn = loadMoreBtn || angular.element(document.querySelectorAll('[js-load-' + _action + ']'))
        loadMoreBtn.addClass('loadMore__btn--loading').removeClass('loadMore__btn--loading--fail')

        var id = type && (_max_id || _min_id)
                    ? type === 'min' 
                        ? type + 'Id-' + _max_id
                    : type + 'Id-' + _min_id
                : 0;

        Action.get({
            action: _action,
            provider: _provider,
            id: id
        })
        .$promise
        .then(function (res){
            res = res.data;

            // Load Old
            if (type === 'max'){
                res.data.splice(0, 1)
                // 無更舊消息
                if (res.data.length === 0){
                    loadMoreBtn.remove()
                }
                _min_id = res.min_id
            }
            // First Load
            else if (!id){
                _min_id = res.min_id
                _max_id = res.max_id
            }
            // Load New
            else {
                _max_id = res.max_id || _max_id
            }

            // Store
            if (res.data.length > 0){
                _notifications = _notifications.concat(res.data)
                store.set(_key, {
                    notifications: _notifications,
                    min_id: _min_id,
                    max_id: _max_id
                })
            }

            // UI
            loadMoreBtn.removeClass('loadMore__btn--loading')
            .parent().removeClass('loadMore--initLoad')

            defer.resolve(_notifications)
        })
        .catch(function (err){
            loadMoreBtn.addClass('loadMore__btn--loading--fail')

            defer.reject(err)
        })

        return defer.promise;
    }
    this.extractSenders = function (items, _uid){
        var cache = [];
        var _sender_uid_list = [];

        for (var i = 0, len = items.length; i < len; i++){
            var sender = items[i].sender;

            if (sender.uid !== _uid && _sender_uid_list.indexOf(sender.uid) < 0){
                cache.push(items[i].sender)
                _sender_uid_list.push(sender.uid)
            }
        }

        return cache;
    }
}])