angular.module('hotq.controllers', [])

    .value('version', '0.1')

    .controller("HotqCtl", function ($scope, $rootScope, $location, $http, upVotes, questions) {

        $scope.init = function () {
            $scope.votes = {
                q_today: 0,
                q_week: 0,
                q_month: 0
            };
            $scope.questions = {};
            var initQuestions = function (id) {
                $rootScope.loader = true;

                questions.getAll(id)
                    .success(function (data) {
                        $rootScope.loader = false;
                        $scope.questions = data.result;

                    })
                    .error(function (error) {
                        $rootScope.loader = false;
                        return error;
                    })
            };

            initQuestions({installationId: 'asdasd21has1212312'});

        };


        $scope.hasVoted = function (screen) {
            if ($scope.votes[screen] != 0) {
                return false;
            } else {
                return true;
            }
        };

        var screenList = ["/today", "/week", "/month", "/reward"];
        var currScreen = -1;
        var idVote = '';

        $scope.checkScreen = function () {
            currScreen = screenList.indexOf($location.path());
            return currScreen;
        };

        $scope.next = function () {
            $scope.direction = 'animated animate-forward';
            var curr = $scope.checkScreen();
            curr++;
            if (curr <= screenList.length - 1) {
                $location.path(screenList[curr]);
            } else {
                curr--;
            }
            currScreen = curr;

        };

        $scope.previous = function () {
            $scope.direction = 'animated animate-backward';
            var curr = $scope.checkScreen();
            curr--;
            if (curr >= 0) {
                $location.path(screenList[curr]);
            } else {
                curr++;
            }
            currScreen = curr;
        };


        $scope.voteNow = function (voteType, voteValue) {
            var votes = $scope.votes;
            votes[voteType] = voteValue;
            $rootScope.loader = true;
            upVotes.voteNow(votes, $scope.idVote)
                .success(function (data /*, status*/) {
                    if (data.objectId) $scope.$parent.idVote;
                    $rootScope.loader = false;
                })
                .error(function (error) {
                    $rootScope.loader = false;
                });
        };
    })









                     