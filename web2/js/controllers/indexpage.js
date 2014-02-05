'use strict';


angular.module('hotq.controllers.indexpage', [])

    .controller("indexpage", function ($scope, $rootScope, $timeout, $location, $http, $q, questions, snapRemote) {

        $scope.toggleMenu = function () {
            snapRemote.toggle('left');
        }

        //allowing to change menu button color for quote slide! silly, yes!
        $scope.$on('isQuoteSlide', function(ev,value) {
           value ? $scope.isQuote=true : $scope.isQuote=false;
        });

        $rootScope.errorQuestions=false;


        $scope.init = function () {


            var timesLoaded = window.localStorage.getItem('hotQTimesLoaded');

            var getQuestions = function (installId) {
                var dfd = $q.defer();
                $rootScope.loaderMessage = "hotQ încarcă întrebările...";
                $rootScope.loader = true;
                questions.getAll({" ": " "})
                    .then(
                    function (data) {
                        dfd.resolve(data);
                    },
                    function (error) {
                        dfd.reject(error);
                    }
                );
                return dfd.promise;
            };

            getQuestions()
                .then(function () {

                    $rootScope.$broadcast('questionsLoaded');
                    $rootScope.errorQuestions=false;

                    //succes
                    $rootScope.loader = false;
                }, function () {
                    $rootScope.errorQuestions=true;
                    $rootScope.loader = false;
                });


            $scope.goLink = function (location) {
                window.open(location, '_blank', 'location=yes');
            };


            //functie pentru rutare
            $scope.go = function (location) {
                $timeout(function () {
                    $scope.toggleMenu();
                }, 0);
                $location.path(location);
            };

            //functie pentru rutare
            $scope.goLocal = function (location) {
                $timeout(function () {
                    $scope.forward = true;
                }, 20);
                $location.path(location);
            };

        };

    })


