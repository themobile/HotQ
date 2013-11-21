angular.module("hotq", [ "ngRoute", "ngAnimate", "ngTouch", "hotq.services", "hotq.controllers", "shoppinpal.mobile-menu"])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/today", {
                templateUrl: "partials/today.html",
                controller: "HotqCtl"
            })
            .when("/week", {
                templateUrl: "partials/week.html",
                controller: "HotqCtl"

            })
            .when("/month", {
                templateUrl: "partials/month.html",
                controller: "HotqCtl"

            })
            .when("/reward", {
                templateUrl: "partials/reward.html",
                controller: "HotqCtl"

            })
            .otherwise({redirectTo: "/today"})
    })

    .run(function ($window, $rootScope) {


//setup eventuri retea
        $rootScope.online = true;

        $window.addEventListener("offline", function () {
            $rootScope.$apply(function () {
                $rootScope.online = false;
            });
        }, false);

        $window.addEventListener("online", function () {
            $rootScope.$apply(function () {
                $rootScope.online = true;
            });
        }, false);


    }
);




