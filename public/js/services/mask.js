angular.module('Oneline.maskServices', [])
.service('olMask', ['$q', '$timeout', '$compile', '$templateRequest', 'Action',
    function($q, $timeout, $compile, $templateRequest, Action){

    this.append = function (templateUrl, scope){
        $timeout(function (){
            var _mask = angular.element(document.querySelector('.cancelMask__wrapper'));

            $templateRequest(templateUrl, scope)
            .then(function (html){
                _mask.children()
                .empty()
                .append($compile(html)(scope))
            })
        })
    }
    this.switch = function (scope){
        return scope.controlCenter
                    ? scope.setControlCenter('', 'fullmask')
                : scope.setControlCenter('fullmask');
    }
    this.loadOldPosts = function (action, provider, id, min_id){
        var defer = $q.defer()

        Action.get({
            action: action,
            provider: provider,
            id: id,
            max_id: min_id
        })
        .$promise
        .then(function (res){
            defer.resolve(res.data)
        })
        .catch(function (err){
            defer.reject(err)
        })

        return defer.promise;
    }
}])
.service('olNotification', ['$q', '$filter', 'store', 'Action', 
    function($q, $filter, store, Action){

    var _provider, _action, _key, _notifications, _max_id;

    this.initLoad = function (provider, action){
        _provider = provider
        _action = action
        _key = action === 'mentions'
                    ? 'notification_m_' + provider
                : 'notification_d_' + provider

        _info = store.get(_key) || {}
        _notifications = _info.notifications || []
        _max_id = _info.max_id

        return _notifications;
    }
    this.load = function(isInitLoad){
        var defer = $q.defer()


        Action.get({
            action: _action,
            provider: _provider,
            id: 0,
            min_id: isInitLoad ? null : _max_id
        })
        .$promise
        .then(function (res){
            res = res.data;

             _max_id = res.max_id || _max_id

            // Store
            if (res.data.length > 0){
                _notifications = _notifications.concat(res.data)
                store.set(_key, {
                    notifications: _notifications,
                    max_id: _max_id
                })
            }

            defer.resolve(_notifications)
        })
        .catch(function (err){
            defer.reject(err)
        })

        return defer.promise;
    }
    this.extractDirect = function (_authUid){
        var senderList = []
        var conversations = {}
        var _sender_uid_list = [];

        // Extract
        for (var i = 0, len = _notifications.length; i < len; i++){
            var sender = _notifications[i].sender;

            if (sender.uid !== _authUid && _sender_uid_list.indexOf(sender.uid) < 0){
                senderList.push(_notifications[i].sender)

                _sender_uid_list.push(sender.uid)
            }
        }

        // Sort & Insert Conversation
        if (senderList.length === 1){
            var _uid = senderList[0].uid;

            conversations[_uid] = extractConversation(_uid, _authUid)
        } else {
            senderList = senderList.sort(function (sender1, sender2){
                var uid1 = sender1.uid,
                    uid2 = sender2.uid;

                // Insert Conversation
                var conversation1 = extractConversation(uid1, _authUid),
                    conversation2 = extractConversation(uid2, _authUid);

                conversations[uid1] = conversation1
                conversations[uid2] = conversation2

                // Sort
                var latestCreatedAt1 = conversation1[conversation1.length - 1].created_at;
                    latestCreatedAt2 = conversation2[conversation2.length - 1].created_at;

                return latestCreatedAt1 < latestCreatedAt2;
            })
        }

        return [senderList, conversations];
    }

    function extractConversation (uid, _authUid){
        return $filter('orderBy')(
            $filter('filter')(_notifications, function (item, index, array){
                return item.sender.uid === uid || 
                        (item.sender.uid === _authUid && item.recipient.uid === uid)
            })
        , 'created_at')
    }
}])

