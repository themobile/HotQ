'use strict';

/* Controllers */

angular.module('hotq.controllers', [])

    .controller('main', function ($scope, $rootScope, questions) {

        //init default values
        $scope.isLast = false;
        $scope.isFirst = false;
        $scope.loading = false;
        $scope.reverse = false;

        $scope.init = function () {




            $scope.error = false;
            $scope.loading = true;
            $scope.isFirst = true;
            $scope.loading = true;

            if (questions.getAllQuestions().length == 0) {
                questions.getAll({" ": " "}).then(
                    function (data) {
                        $scope.questions = data;
                        $scope.loading = false;
                    },
                    function (error) {
                        $scope.error = true;
                        $scope.loading = false;

                    });
            } else {
                $scope.questions = questions.getAllQuestions();
                $scope.loading = false;
            }


        };

        //calls init
        $scope.init();


    })

    .controller('navigation', function ($scope, $rootScope, $location) {


        $scope.goto = function (location) {
            $scope.$spMenu.toggle();
            $location.path(location);
        }


    })


    .controller('sendquestion', function ($scope, sendQuestion) {
        $scope.qSend = {tricks:''};
        $scope.thankyou=false;
        $scope.loading=false;
        $scope.error=false;

        $scope.sendQ = function () {

            $scope.loading=true;
            sendQuestion.now($scope.qSend).then (

                function(success) {
                    $scope.error=false;
                    $scope.loading=false;
                    $scope.thankyou=true;
                    $scope.qSend={tricks:''};
                },

                function(error) {
                    $scope.error=true;
                    $scope.loading=false;
                }

            )
        };

        $scope.reset=function() {
            $scope.error=false;
            $scope.loading=false;
            $scope.thankyou=false;
            $scope.qSend={tricks:''};
        }



    })