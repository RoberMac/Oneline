angular.module('Oneline.utilsDirectives', [])
// via http://stackoverflow.com/a/15208347/3786947
.directive('onFinishRender', ['$timeout', function($timeout){
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            if (scope.$last || scope.$first) {
                $timeout(function () {
                    scope.$emit(attrs.onFinishRender);
                });
            }
        }
    };
}])
.directive('loadMoreIcon', function (){
    return {
        restrict: 'E',
        replace: true,
        template: '\
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">\
                <g fill="none" fill-rule="evenodd">\
                    <circle cx="42.5" cy="100" r="15"/>\
                    <circle cx="100" cy="100" r="15"/>\
                    <circle cx="157.5" cy="100.5" r="15"/>\
                </g>\
            </svg>'
    }
})
.directive('scrollTo', function (){
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, elem, attrs){
            var _direction = attrs.scrollTo.split(':')[0],
                _target    = attrs.scrollTo.split(':')[1],
                _C_ACTIVE = 'scrollTo--' + _direction + '--active',
                _BOUND    = 70,
                _POSITION = 0,
                lastPosTop, isActive;

            var target = angular.element(
                document.querySelector('[js-scroll="' + _target + '"]')
            );

            // 顯示／隱藏按鈕
            target
            .on('scroll', function (){
                var curTop = target.scrollTop();

                if (curTop < _BOUND){
                    hideScrollBtn()
                }
                else if (!isActive && curTop < lastPosTop){
                    isActive = true
                    elem.addClass(_C_ACTIVE)
                    .delay(7000)
                    .then(function (){
                        hideScrollBtn()
                    })
                }
                lastPosTop = curTop
            })
            // 滾動到頂部
            elem
            .on('click', function (){
                target.scrollTop(_POSITION, 700)
            })
            .on('$destroy', function (){
                elem.off()
                target.off()
            })

            function hideScrollBtn(){
                elem.removeClass(_C_ACTIVE)
                isActive = false
            }
        }
    }
})