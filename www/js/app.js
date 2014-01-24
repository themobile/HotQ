angular.module("hotq", [
        "ngRoute",
        "ngAnimate",
        "ngTouch",
        "hotq.controllers.indexpage",
        "hotq.controllers.demos",
        "hotq.controllers.carousel",
        "hotq.services",
        'angular-carousel',
        "shoppinpal.mobile-menu" ])


    .config(function ($routeProvider) {
        $routeProvider

            .when("/about", {templateUrl: "partials/about.html"})
            .when("/demographics", {templateUrl: "partials/demographics.html",controller:"demos"})
            .when("/carousel", {templateUrl: "partials/carousel.html",controller:"carousel"})
            .otherwise({redirectTo: "/carousel"})
    })

    .run(function ($window, $rootScope) {

        $rootScope.online = navigator.onLine ? 'online' : 'offline';
        $rootScope.$apply();

        if (!navigator.onLine) {
            superScope.loaderMessage = "hotq este offline! Avem nevoie de internet!";
            superScope.loader = !isOnline;
        }

        document.addEventListener("online", function () {
            $rootScope.$broadcast('onlineChanged', true);
        }, true)
        document.addEventListener("offline", function () {
            $rootScope.$broadcast('onlineChanged', false);
        }, true)




    }
);




