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
.directive("disableBack", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            elem
            .on('mousewheel', function(event) {
                // via http://stackoverflow.com/a/27023848/3786947
                var maxX = this.scrollWidth - this.offsetWidth;

                if (this.scrollLeft + event.deltaX < 0 ||
                    this.scrollLeft + event.deltaX > maxX) {

                    event.preventDefault();

                    this.scrollLeft = Math.max(0, Math.min(maxX, this.scrollLeft + event.deltaX));
                }
            })
            .on('$destroy', function (){
                elem.off()
            })
        }
    };
})