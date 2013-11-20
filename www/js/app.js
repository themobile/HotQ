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
//        .when("/results", {
//            templateUrl: "partials/results.html",
//            controller: "HotqResults"
//
//        })
            .otherwise({redirectTo: "/today"})
    })

    .run(function ($window, $rootScope, $http, $location) {


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

        $rootScope.loader = true;

        //incarcare intrebari la RUN

//        if ($rootScope.online) {

            $http({
                method: 'GET',
                headers: {
                    "X-Parse-Application-Id": "wZe7Z3sAnUgprCrMOSQuarbUoTqmOyXS9MNguwhP",
                    "X-Parse-REST-API-Key": "48bWkLkDjKcafmwLREDkdVUoR84cY0ypmGNNbERo"
                },
                cache: false,
                withCredentials: false,
                url: "https://api.parse.com/1/classes/Questions"
            })
                .success(function (data /*, status, headers, config*/) {
                    // this callback will be called asynchronously
                    // when the response is available
                    console.log('succes');
                    $location.path("/");
                    var result=data.results;

                    for (var q in result) {
                        if (result[q].qtype===1) $rootScope.q_today= result[q].q_text;
                        if (result[q].qtype===2) $rootScope.q_week= result[q].q_text;
                        if (result[q].qtype===3) $rootScope.q_month= result[q].q_text;
                    }
                    $rootScope.rewards = 'Ca să nu te urci pe pereți cu bicicleta, îți recomand o baie rece!';
                    $rootScope.loader = false;

                })
                .error(function (/*data, status, headers, config*/) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    navigator.notification.alert ('Nu exista conexiune la internet!');
                    $rootScope.loader = false;
                });

//        } else {
//            navigator.notification.alert ('Nu exista conexiune la internet!<br/> Nu putem continua!');
//        }
    }
);



