angular.module("hotq", [ "ngRoute", "ngAnimate","ngTouch", "hotq.services", "hotq.controllers", "shoppinpal.mobile-menu" ])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/questionOfDay", {
                templateUrl: "partials/today.html",
                controller: "HotqCtl",
                resolve: {
                    changeScreen: function ($rootScope) {
                        $rootScope.currScreen = 'questionOfDay';
                        $rootScope.isQuestionScreen = true;
                    }
                }
            })
            .when("/questionOfWeek", {
                templateUrl: "partials/week.html",
                controller: "HotqCtl", resolve: {
                    changeScreen: function ($rootScope) {
                        $rootScope.currScreen = 'questionOfWeek';
                        $rootScope.isQuestionScreen = true;
                    }
                }

            })
            .when("/questionOfMonth", {
                templateUrl: "partials/month.html",
                controller: "HotqCtl",
                resolve: {
                    changeScreen: function ($rootScope) {
                        $rootScope.currScreen = 'questionOfMonth';
                        $rootScope.isQuestionScreen = true;
                    }
                }

            })
            .when("/reward", {
                templateUrl: "partials/reward.html",
                controller: "HotqCtl",
                resolve: {
                    changeScreen: function ($rootScope) {
                        $rootScope.currScreen = 'reward';
                        $rootScope.isQuestionScreen = false;
                    }
                }

            })
            .when("/about", {
                templateUrl: "partials/about.html",
                controller: "HotqCtl",
                resolve: {
                    changeScreen: function ($rootScope) {
                        $rootScope.currScreen = 'about';
                        $rootScope.isQuestionScreen = false;
                    }
                }

            })
            .otherwise({redirectTo: "/questionOfDay"})
    })

    .run(function ($window, $rootScope) {

        //FIXME de pus hardware id intors de parse
        $rootScope.installId = '891e011e-77f3-4b23-8e0d-f7174da27379';
//

        if (typeof parseGetInstallationId == 'function')
        parseGetInstallationId(function (id) {
            $rootScope.installId = id;
            console.log('IDDDD:' + id);
        }, function (e) {
            console.log('InstallID:' + e);
        });

//setup eventuri retea
        $rootScope.online = false;

        $window.addEventListener("offline", function () {

            $rootScope.$broadcast('onlineChanged', false);

//            $rootScope.$apply(function () {
//                $rootScope.loaderMessage = "hotQ e offline...";
//                $rootScope.loader = true;
//                $rootScope.online = false;
//            });
        }, false);

        $window.addEventListener("online", function () {

            $rootScope.$broadcast('onlineChanged', true);
//
//            $rootScope.$apply(function () {
//                $rootScope.loader = false;
//                $rootScope.online = true;
//            });
        }, false);


    }
);




