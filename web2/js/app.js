'use strict';

angular.module("hotq",
        [
            "ngRoute",
            "ngAnimate",
            "ngTouch",
            'snap',
            "hotq.controllers.indexpage",
            "hotq.controllers.carousel",
            "hotq.controllers.demos",
            "hotq.controllers.sendquestion",
            "hotq.services",
            "hotq.directives",
            'angular-carousel'

        ])


    .config(function ($routeProvider) {
        $routeProvider
            .when("/about", {
                templateUrl: "partials/about.html",
                resolve: {
                    changeScreen: function ($rootScope) {
                        $rootScope.currScreen = 'about';
                    }
                }
            })
            .when("/demographics", {
                templateUrl: "partials/demographics.html",
                controller: "demos",
                resolve: {
                    changeScreen: function ($rootScope) {
                        $rootScope.currScreen = 'demographics';
                    }
                }
            })
            .when("/carousel", {
                templateUrl: "partials/carousel.html",
                controller: "carousel",
                resolve: {
                    changeScreen: function ($rootScope) {
                        $rootScope.currScreen = 'questions';
                    }
                }
            })

            .when("/sendquestion",{
                templateUrl:"partials/sendquestion.html",
                controller:"sendquestion",
                resolve: {
                    changeScreen: function($rootScope){
                        $rootScope.currScreen='sendquestion';
                    }
                }
            })

            .otherwise({redirectTo: "/carousel"});
    })

    .run(function ($window, $rootScope) {



    });




