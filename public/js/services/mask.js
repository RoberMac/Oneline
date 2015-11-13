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
    this.extractDirect = function (_authUid, notifications){
        var senderList = []
        var conversations = {}
        var _sender_uid_list = [];

        // Extract
        for (var i = 0, len = notifications.length; i < len; i++){
            var sender = notifications[i].sender;

            if (sender.uid !== _authUid && _sender_uid_list.indexOf(sender.uid) < 0){
                senderList.push(notifications[i].sender)

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


        function extractConversation (uid, _authUid){
            return $filter('orderBy')(
                $filter('filter')(notifications, function (item, index, array){
                    return item.sender.uid === uid || 
                            (item.sender.uid === _authUid && item.recipient.uid === uid)
                })
            , 'created_at')
        }
    }
}])
.service('olWriteMini', ['$q', 'Action', function($q, Action){

    var statusElem, submitButton;
    this.init = function (_statusElem, _submitButton){
        statusElem = _statusElem
        submitButton = _submitButton
    }
    this.submit = function (_provider, _action, _id){
        var defer = $q.defer()

        var status = statusElem.val().trim();

        // UI
        statusElem.prop('disabled', true)
        submitButton.addClass('write__btn--send--sending')
        // Fire
        Action.update({
            action: _action,
            provider: _provider,
            id: _id || 0
        }, { params: {text: status} })
        .$promise
        .then(function (data){
            statusElem.val('')

            defer.resolve(data)
        })
        .catch(function (err){
            submitButton.prop('disabled', false)
            statusElem.addClassTemporarily('write__textarea--err', 500)

            defer.reject(err)
        })
        .finally(function (){
            statusElem.prop('disabled', false)
            submitButton.removeClass('write__btn--send--sending')
        })

        return defer.promise;
    }
    this.input = function (){
        var _status = statusElem.val(),
            status = _status.trim().length > 0 ? _status : _status.trim();

        // 超字提醒
        var statusLength = status.length;
        if (statusLength > 140 || statusLength === 0){
            submitButton.prop('disabled', true)
        } else {
            submitButton.prop('disabled', false)
        }
        // 更新剩餘字數
        submitButton
        .attr('data-count', statusLength > 0 ? statusLength : '')
        .addClassTemporarily('write__btn--send--typing', 700)
    }
}])

