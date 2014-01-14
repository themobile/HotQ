'use strict';


// Declare app level module which depends on filters, and services
angular.module('hotq', [
        'ngRoute',
        'ngAnimate',
        'ngTouch',
        'shoppinpal.mobile-menu',
        'hotq.filters',
        'hotq.services',
        'hotq.directives',
        'hotq.controllers'
    ])

//    .config(['$locationProvider', function($locationProvider) {
//        $locationProvider.html5Mode(true);
////        $locationProvider.hashPrefix('!');
//    }])

    .config(['$routeProvider', function ($routeProvider) {


        $routeProvider.when('/',            {templateUrl: 'partials/main.html',controller: 'main'});
        $routeProvider.when('/raspunsuri',  {templateUrl: 'partials/raspunsuri.html', controller: 'main'});
        $routeProvider.when('/instaleaza',  {templateUrl: 'partials/instaleaza.html'});
        $routeProvider.when('/despre',      {templateUrl: 'partials/despre.html'});
        $routeProvider.when('/trimite',     {templateUrl: 'partials/trimite.html', controller: 'sendquestion'});

        $routeProvider.otherwise({redirectTo: '/'});
    }])



    .run(function ($timeout,$location,$rootScope) {
        $rootScope.slogan=true;
        if ($location.path()=='/' || $location.path()=='') {
            $timeout(function() {
                $rootScope.slogan=false;
                $timeout(function(){
                    $location.path('/raspunsuri');
                },1000)
            },2000);
        }



    });

