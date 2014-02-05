'use strict';


angular.module('hotq.controllers.carousel', [])


    .controller("carousel", function ($scope, questions) {


        $scope.slideIndex = 0;
        $scope.questions = [];


        $scope.prevSlide= function() {
            $scope.slideIndex>0 ? $scope.slideIndex-- : $scope.slideIndex;

        }

        $scope.nextSlide= function() {
            $scope.slideIndex<3 ? $scope.slideIndex++ : $scope.slideIndex;
        }

        $scope.getPercentage = function (which) {
            if (typeof $scope.questions[$scope.slideIndex] != 'undefined') {
                if ($scope.questions[$scope.slideIndex].hasVote) {
                    return (90-$scope.questions[$scope.slideIndex][which]) + '%';
                } else {
                    return '50%';
                }
            } else {
                return '50%';
            }
        };

        $scope.$on('questionsLoaded', function () {
            $scope.loadq();
        });

        $scope.loadq = function () {
            var tempq = questions.getAllQuestions();
            if (tempq) {
                $scope.questions = questions.getAllQuestions().content;
            }
        };



    });

