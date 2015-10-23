angular.module('Oneline', [
    // ng
    'ngTouch',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    // Vendors
    'ui.router',
    'angular-jwt',
    'linkify',
    'weibo-emotify',
    // Templates
    'Oneline.templates',
    // Controllers
    'Oneline.rootControllers',
    'Oneline.settingsControllers',
    'Oneline.timelineControllers',
    // Services
    'Oneline.utilsServices',
    'Oneline.timelineServices',
    'Oneline.RESTfulServices',
    'Oneline.tokenHelperServices',
    'Oneline.UIServices',
    'Oneline.controlCenterServices',
    // Directives
    'Oneline.utilsDirectives',
    'Oneline.mediaDirectives',
    'Oneline.textDirectives',
    'Oneline.controlCenterDirectives',
    'Oneline.userProfileDirectives'
])
.config(['$locationProvider', '$stateProvider', '$compileProvider', '$animateProvider',
    '$urlRouterProvider', '$httpProvider', 'jwtInterceptorProvider', 'weiboEmotifyProvider',
    function($locationProvider, $stateProvider, $compileProvider, $animateProvider,
        $urlRouterProvider, $httpProvider, jwtInterceptorProvider, weiboEmotifyProvider) {


    $locationProvider.html5Mode(true)

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|blob|data|mailto):/)

    $animateProvider.classNameFilter(/animate--\w+/)

    // 配置每次請求攜帶 JWT
    jwtInterceptorProvider.tokenGetter = function() {
        return localStorage.getItem('tokenList')
    }
    $httpProvider.interceptors.push('jwtInterceptor')

    $urlRouterProvider.otherwise('/')

    $stateProvider
        .state('settings', {
            url: '/settings',
            templateProvider: ['$templateCache', function ($templateCache){
                return $templateCache.get('settings.html')
            }],
            controller: 'settingsCtrl'
        })
        .state('timeline', {
            url: "/",
            templateProvider: ['$templateCache', function ($templateCache){
                return $templateCache.get('timeline.html')
            }],
            controller: 'timelineCtrl'
        })

    weiboEmotifyProvider.setEmotionsURL('/public/dist/emotions_v1.min.json')
}])
.factory('timelineCache', ['$cacheFactory', function($cacheFactory){
    return $cacheFactory('timelineCache')
}])
.run(['$q', function ($q){
    /**
     * Extending jQLite
     *
     */
    angular.element.prototype.addClassTemporarily = function (className, delay){
        var elem = this;

        elem.addClass(className)
        setTimeout(function (){
            elem.removeClass(className)
        }, delay)

        return this;
    }
    angular.element.prototype.delay = function (time){
        var _this = this;

        return $q(function (resolve, reject){
            setTimeout(function (){
                resolve(_this)
            }, time)
        })
    }
}])