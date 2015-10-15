angular.module('Oneline.UIServices', [])
.service('olAnimate', ['$q', function($q){
    this.enter = function (element){
        return $q(function (resolve, reject){

            angular.forEach(element, function (elem){
                elem = angular.element(elem)

                var delay = elem.hasClass('animate--general')
                                ? 700
                            : elem.hasClass('animate--faster')
                                ? 300
                            : 0;

                elem
                .addClassTemporarily('ol-enter', delay)
                .delay(70)
                .then(function (){
                    elem.addClassTemporarily('ol-enter--active', delay)
                })
            })

            resolve()
        })
    },
    this.leave = function (element){

        return $q(function (resolve, reject){
            var noAnimate = 0;

            angular.forEach(element, function (elem){
                elem = angular.element(elem)

                if (elem.hasClass('animate--general') || elem.hasClass('animate--faster')){
                    var delay = elem.hasClass('animate--general')
                                    ? 700
                                : elem.hasClass('animate--faster')
                                    ? 300
                                : 0;

                    elem
                    .addClass('ol-leave')
                    .delay(70)
                    .then(function (){
                        elem
                        .addClass('ol-leave--active')
                        .delay(delay)
                        .then(function (){
                            elem.removeClass('ol-leave--active ol-leave')

                            resolve()
                        })
                    })
                } else {
                    noAnimate++
                }
            })

            if (element.length === noAnimate){ resolve() }
        })
    }
}])
.service('olUI', ['$filter', function($filter){
    // 刷新社交網站圖標
    this.updateSocialIcon = function (providerList){
        var socialColor = { twitter: '#2AA9E0', instagram: '#3F5D87', weibo: '#E6162D' },
            socialList  = ['twitter', 'instagram', 'weibo'];

        socialList.forEach(function (provider){
            var elem   = document.querySelectorAll('[data-provider="' + provider + '"]'),
                m_elem = angular.element(elem[0]),
                l_elem = angular.element(elem[1]);

            if (providerList.indexOf(provider) >= 0){
                m_elem.attr('fill', socialColor[provider])
                l_elem.addClass('social-icon--active tips--active')
            } else {
                m_elem.attr('fill', '#FFF')
                l_elem.removeClass('social-icon--active tips--active')
            }
        })
    }
    // 設置是否為「正在加載」
    this.setLoading = function (type, step){
        var loadingElem = angular.element(document.getElementsByClassName('loadMore')[step === 1 ? 0 : 1]);

        if (type === 'start'){
            loadingElem.removeClass('loadMore--loading--fail')
            loadingElem.addClass('loadMore--loading')
        } else if (type === 'done') {
            loadingElem.removeClass('loadMore--initLoad loadMore--loading loadMore--loading--fail')
        } else if (type === 'fail'){
            loadingElem.addClass('loadMore--loading loadMore--loading--fail')
        }
    }
    // 判斷是否「正在加載」
    this.isLoading = function (step){
        var loadingElem = angular.element(document.getElementsByClassName('loadMore')[step === 1 ? 0 : 1]);

        return (loadingElem.hasClass('loadMore--loading') && !loadingElem.hasClass('loadMore--loading--fail'))
                || loadingElem.hasClass('loadMore--initLoad')
    }
    // 設置上次閱讀位置提醒
    this.setDivider = function (step){
        var timelineElem = document.querySelectorAll('.timeline:not(.timeline--quote)');

        timelineElem = angular.element(timelineElem[step === 1 ? 0 : timelineElem.length - 1]);

        timelineElem
        .attr('data-date', $filter('date')(Date.now(), 'HH:mm'))
        .addClass(step === 1 ? 'divider divider--top' : 'divider divider--bottom')
    }
    // 設置未讀「新／舊帖文」數提醒
    this.setPostsCount = function (type, msg){
        var isNewPosts = type === 'newPosts';

        // 設置標題提醒
        if (isNewPosts && msg % 1 === 0){
            var _msg = (~~msg).toString().split(''),
                nmap = {
                    '0': '⁰',
                    '1': '¹',
                    '2': '²',
                    '3': '³',
                    '4': '⁴',
                    '5': '⁵',
                    '6': '⁶',
                    '7': '⁷',
                    '8': '⁸',
                    '9': '⁹'
                }
                __msg = '';

            if (msg !== ''){
                _msg.forEach(function (numStr){
                    __msg += nmap[numStr]
                })
            }

            document.title = '｜'+ __msg
        }


        document
        .getElementsByClassName('loadMore__count')[isNewPosts ? 0 : 1]
        .setAttribute('data-count', msg)
    }
    /**
     * 其他操作相關
     *
     *
     */
    var getActionElem = function (action, id){
        return angular.element(document
        .querySelector('[data-id="' + id + '"]')
        .querySelector('[data-' + action + ']'))
    }
    // 設置 Action 圖標狀態
    this.setActionState = function (action, id, state){
        var actionElem = getActionElem(action, id);

        switch (state){
            case 'wait':
                actionElem.addClass('actions__button--wait')
                break;
            case 'done':
                actionElem.removeClass('actions__button--wait')
                break;
            case 'active':
                actionElem.addClass('actions__button--' + action + '--active')
                actionElem.parent().addClass('tips--active')
                break;
            case 'inactive':
                actionElem.removeClass('actions__button--' + action + '--active')
                actionElem.parent().removeClass('tips--active')
                break;
            case 'frozen':
                actionElem.parent().addClass('tips--frozen')
                break;
        }
    }
    // 判斷是否為激活狀態
    this.isActionActive = function (action, id){
        var actionElem = getActionElem(action, id);

        return actionElem.hasClass('actions__button--' + action + '--active')
    }
    // 判斷是否正在處理中
    this.isActionWait = function (action, id){
        var actionElem = getActionElem(action, id);

        return actionElem.hasClass('actions__button--wait')
    }
    // 判斷是否為已凍結的操作
    this.isActionFrozen = function (action, id){
        var actionElem = getActionElem(action, id)

        return actionElem.parent().hasClass('tips--frozen')
    }
    // 獲取／設置需要綁定的數據
    this.actionData = function (action, id, data, type){
        var actionElem = getActionElem(action, id),
            attr_str;

        if (type === 'count'){
            actionElem = actionElem.next()
            attr_str = 'data-count';
        } else {
            attr_str = 'data-' + action;
        }

        if (data || data === ''){
            actionElem.attr(attr_str, data)
        } else {
            return actionElem.attr(attr_str)
        }
    }
}])