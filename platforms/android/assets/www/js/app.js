'use strict';


document.ontouchmove = function (event) {
    // provent body move (ipad)
    var sourceElement = event.target || event.srcElement;
    if (!angular.element(sourceElement).hasClass('enable_touchmove')) {
        event.preventDefault();
    }
};




angular.module("hotq",
        [
            "ngRoute",
            "ngAnimate",
            "ngTouch",
            'snap',
            'angles',
            "hotq.controllers.indexpage",
            "hotq.controllers.carousel",
            "hotq.controllers.demos",
            "hotq.services",
            "hotq.directives",
            'angular-carousel'
        ])


    .config(function ($routeProvider) {
        $routeProvider

            .when("/about", {templateUrl: "partials/about.html"})
            .when("/demographics", {templateUrl: "partials/demographics.html", controller: "demos"})
            .when("/carousel", {templateUrl: "partials/carousel.html", controller: "carousel"})
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




