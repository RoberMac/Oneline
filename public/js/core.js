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
    'duScroll',
    // Templates
    'Oneline.templates',
    // Controllers
    'Oneline.rootControllers',
    'Oneline.settingsControllers',
    'Oneline.timelineControllers',
    'Oneline.maskControllers',
    // Services
    'Oneline.utilsServices',
    'Oneline.timelineServices',
    'Oneline.RESTfulServices',
    'Oneline.tokenHelperServices',
    'Oneline.UIServices',
    'Oneline.controlCenterServices',
    'Oneline.maskServices',
    // Directives
    'Oneline.utilsDirectives',
    'Oneline.mediaDirectives',
    'Oneline.textDirectives',
    'Oneline.controlCenterDirectives',
    'Oneline.maskDirectives'
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


    var cutscenes = ['$q', function ($q){
        return $q(function (resolve, reject){
            var cutscenesElem = angular.element(document.querySelectorAll('[js-cutscenes]'));

            if (cutscenesElem.length > 0){
                cutscenesElem.addClass('animate--cutscenes')
                .delay(1000)
                .then(function (){
                    resolve()
                })
            } else {
                resolve()
            }
        })
    }];
    $stateProvider
        .state('settings', {
            url: '/settings',
            templateUrl: 'settings.html',
            resolve: {
                cutscenes: cutscenes
            },
            controller: 'settingsCtrl'
        })
        .state('timeline', {
            url: "/",
            templateUrl: 'timeline.html',
            resolve: {
                cutscenes: cutscenes
            },
            controller: 'timelineCtrl'
        })
        .state('timeline.action', {
            url: "^/{provider:twitter|instagram|weibo}/{action:user|tags|location}/:id?x",
            controller: 'maskCtrl'
        })

    weiboEmotifyProvider.setEmotionsURL('/public/dist/emotions_v1.min.json')

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