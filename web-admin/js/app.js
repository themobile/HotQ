'use strict';


// Declare app level module which depends on filters, and services
angular.module('hotq-admin', [
        'ngRoute',
        'ngCookies',
        'truncate',
        'blockingClick',
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

        $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'login'});
        $routeProvider.when('/main', {templateUrl: 'partials/main.html'});

        $routeProvider.otherwise({redirectTo: '/login'});
    }])


    .run(function ($cookieStore,$location,userservice,$q) {
        var user=$cookieStore.get('hotQAdminUser');
        if (user) {
            userservice.setToken(user.sessionToken);
            userservice.getUserByToken(user.sessionToken).then(
                function(success) {
                    $location.path('/main');
                },
                function(error) {
                    $cookieStore.set('hotQAdminUser','');
                    $location.path('/login');
                }
            );
        }

    });

