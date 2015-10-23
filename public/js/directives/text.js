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
.directive('trimQuoteLink', ['$timeout', function ($timeout){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            if (attrs.trimQuoteLink === 'quote'){
                var quoteLink = /(?:https?\:\/\/)+(?![^\s]*?")([\w.,@?!^=%&amp;:\/~+#-]*[\w@?!^=%&amp;\/~+#-])?$/ig

                $timeout(function () {
                    element.html(element.html().replace(quoteLink, ''));
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