'use strict';



var less = {
    env: "development", // or "production"
    async: false,       // load imports async
    fileAsync: false,   // load imports async when in a page under
    // a file protocol
    poll: 1000,         // when in watch mode, time in ms between polls
    functions: {},      // user functions, keyed by name
    dumpLineNumbers: "comments", // or "mediaQuery" or "all"
    relativeUrls: false,// whether to adjust url's to be relative
    // if false, url's are already relative to the
    // entry less file
    rootpath: ":/a.com/"// a path to add on to the start of every url
    //resource
};


angular.module("hotq",
        [
            "ngRoute",
            "ngAnimate",
            "ngTouch",
            'snap',
//            'angles',
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

        $rootScope.isOnline = navigator.onLine ? 'online' : 'offline';
        $rootScope.$apply();

        if (!navigator.onLine) {
            superScope.loaderMessage = "hotq este offline! Avem nevoie de internet!";
            superScope.loader = !superScope.isOnline;
        }

        document.addEventListener("online", function () {
            $rootScope.$broadcast('onlineChanged', true);
        }, true);
        document.addEventListener("offline", function () {
            $rootScope.$broadcast('onlineChanged', false);
        }, true);


    });




