angular.module('Oneline.textDirectives', [])
.directive('trimMediaLink', ['$timeout', function ($timeout){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            $timeout(function () {
                element.html(element.html().replace(attrs.trimMediaLink, ''));
            })

        }
    }
}])
.directive('trimSuffixLink', ['$timeout', function ($timeout){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (attrs.trimSuffixLink === 'true'){
                var suffixLink = /(?:https?\:\/\/)+(?![^\s]*?")([\w.,@?!^=%&amp;:\/~+#-]*[\w@?!^=%&amp;\/~+#-])?$/ig

                $timeout(function () {
                    element.html(element.html().replace(suffixLink, ''));
                })
            }
        }
    }
}])
.filter('html', ['$sce', function($sce) {
    return function(str) {
        return $sce.trustAsHtml(str);
    };
}])