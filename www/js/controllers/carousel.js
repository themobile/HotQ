'use strict';


angular.module('hotq.controllers.carousel', [])


    .controller("carousel", function ($scope, $rootScope, $timeout, upVotes, questions) {


        $scope.slideIndex = 0;
        $scope.questions = [];

        //to communicate with indexpage.js to change menu button color. siiiiilly
        $scope.$watch('slideIndex', function() {
            if ($scope.slideIndex==3) {
                $rootScope.$broadcast('isQuoteSlide',true);
            } else {
                $rootScope.$broadcast('isQuoteSlide',false);
            }
        })


        $scope.getPercentage = function (which) {
            if (typeof $scope.questions[$scope.slideIndex] != 'undefined') {
                if ($scope.questions[$scope.slideIndex].hasVote) {
                    return $scope.questions[$scope.slideIndex][which] + '%';
                } else {
                    return '50%';
                }
            } else {
                return '50%';
            }
        };


        $scope.getMessage = function () {
            if (typeof $scope.questions[$scope.slideIndex] != 'undefined') {
                if ($scope.questions[$scope.slideIndex].hasVote) {
                    return 'ai răspuns la această întrebare';
                } else {
                    return 'răspunde onest și fără inhibiții';
                }
            }
        };


        $scope.$on('questionsLoaded', function () {
            $scope.loadq();
        });

        $scope.loadq = function () {
            var tempq = questions.getLocal();
            if (tempq) {
                $scope.questions = questions.getLocal().content;
            }
        };

        $scope.answersVisible = function () {
            if ($scope.questions[$scope.slideIndex]) {
                return !$scope.questions[$scope.slideIndex].hasVote;
            } else {
                return true;
            }
        };


        //votare efectiva cu service voteNow
        $scope.voteNow = function (voteValue) {
            if (!$scope.questions[$scope.slideIndex].hasVote) {
                $rootScope.loaderMessage = "hotQ notează răspunsul tău...";
                $rootScope.loader = true;

                upVotes.voteNow($scope.questions[$scope.slideIndex].id, voteValue, $rootScope.installId, {position: $scope.position, address: $scope.geoInfo}, {demographics: $scope.user})
                    .success(function (data /* tipul de intrebare la care s-a votat */) {
                        questions.setVote($scope.slideIndex, true);
                        window.localStorage.setItem("hotQuestions", JSON.stringify(questions.getLocal()));
                        $rootScope.loader = false;
                    })
                    .error(function () {
                        $rootScope.loader = false;
                    });
            }
        };

    });

