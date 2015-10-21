angular.module('Oneline.olUtilsDirectives', [])
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
}]);