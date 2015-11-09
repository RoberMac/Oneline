angular.module('Oneline.UIServices', [])
.service('olUI', ['$filter', function($filter){
    // 設置是否為「正在加載」
    this.setLoading = function (type, step){
        var loadingElem = angular.element(
            document.querySelectorAll('[js-load-timeline]')[step === 1 ? 0 : 1]
        );

        if (type === 'start'){
            loadingElem
            .removeClass('loadMore__btn--loading--fail')
            .addClass('loadMore__btn--loading')
        } else if (type === 'done') {
            loadingElem
            .removeClass('loadMore__btn--loading loadMore__btn--loading--fail')
            .parent()
            .removeClass('loadMore--initLoad')
        } else if (type === 'fail'){
            loadingElem.addClass('loadMore__btn--loading loadMore__btn--loading--fail')
        }
    }
    // 判斷是否「正在加載」
    this.isLoading = function (step){
        var loadingElem = angular.element(
            document.querySelectorAll('[js-load-timeline]')[step === 1 ? 0 : 1]
        );

        return (loadingElem.hasClass('loadMore__btn--loading') &&
                !loadingElem.hasClass('loadMore__btn--loading--fail')) ||
                loadingElem.parent().hasClass('loadMore__btn--initLoad');
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
        .getElementsByClassName('loadMore__btn--count')[isNewPosts ? 0 : 1]
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
                actionElem.parent().addClass('tips--active icon--' + action)
                break;
            case 'inactive':
                actionElem.parent().removeClass('tips--active icon--' + action)
                break;
            case 'frozen':
                actionElem.parent().addClass('tips--frozen')
                break;
        }
    }
    // 判斷是否為激活狀態
    this.isActionActive = function (action, id){
        var actionElem = getActionElem(action, id);

        return actionElem.parent().hasClass('icon--' + action)
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