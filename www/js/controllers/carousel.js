angular.module('hotq.controllers.carousel', [])

    .controller("carousel", function ($scope, $rootScope, $timeout,upVotes, questions) {
        $scope.questions = [];
        $scope.$on('questionsLoaded', function () {
            var tempq = questions.getLocal();
            $scope.questions = [];
            $scope.questions.push(tempq.questionOfDay);
            $scope.questions.push(tempq.questionOfWeek);
            $scope.questions.push(tempq.questionOfMonth);
            $scope.questions.push(tempq.quote);
        });


        $scope.slideIndex = 0;
        $scope.answersVisible = function () {
            if ($scope.questions[$scope.slideIndex]) {
                return !$scope.questions[$scope.slideIndex].hasVote;
            } else {
                return true;
            }
            ;
        }

        $scope.getResults = function () {
            var results={};
            if ($scope.questions[$scope.slideIndex]) {
                results.yesproc = parseInt($scope.questions[$scope.slideIndex].percentYes);
                results.noproc = 100 - results.yesproc;
                return results;
            } else {
                results = {yesproc:50,noproc:50};
                return results;
            }
        }


        //votare efectiva cu service voteNow
        $scope.voteNow = function (questionId, voteValue) {
            $rootScope.loaderMessage = "hotQ notează răspunsul tău...";
            $rootScope.loader = true;

            upVotes.voteNow($scope.questions[$scope.slideIndex].id, voteValue, $rootScope.installId, {position: $scope.position, address: $scope.geoInfo}, {demographics: $scope.user})
                .success(function (data /* tipul de intrebare la care s-a votat */) {
                    questions.setVote(data.result.success, true);
                    window.localStorage.setItem("hotQuestions", JSON.stringify(questions.getLocal()));
                    $rootScope.loader = false;
                })
                .error(function () {
                    $rootScope.loader = false;
                });
        };

    });

