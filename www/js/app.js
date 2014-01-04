angular.module("hotq", [ "ngRoute", "ngAnimate","ngTouch", "hotq.services", "hotq.controllers","shoppinpal.mobile-menu" ])
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
            .when("/demographics", {
                templateUrl: "partials/demographics.html",
                controller: "HotqCtl",
                resolve: {
                    changeScreen: function ($rootScope) {
                        $rootScope.currScreen = 'demographics';
                        $rootScope.isQuestionScreen = false;
                    }
                }

            })
            .otherwise({redirectTo: "/questionOfDay"})
    })

    .run(function ($window, $rootScope) {

        $rootScope.online = navigator.onLine ? 'online' : 'offline';
        $rootScope.$apply();

        if (!navigator.onLine) {
            superScope.loaderMessage = "hotq este offline! Avem nevoie de internet!";
            superScope.loader = !isOnline;
        }

            document.addEventListener("online",function(){
                $rootScope.$broadcast('onlineChanged',true);
            },true)
            document.addEventListener("offline",function(){
                $rootScope.$broadcast('onlineChanged',false);
            },true)

        //FIXME de pus hardware id intors de parse
        $rootScope.installId = '891e011e-77f3-4b23-8e0d-f7174da27379';



    }
);




