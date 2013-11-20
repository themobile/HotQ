angular.module('hotq.controllers', [])

    .value('version', '0.1')

    .controller("HotqCtl", function ($scope, $rootScope, $location, $http, upVotes, NotificationService) {

        $scope.init=function() {
            $scope.votes = {
                q_today: 0,
                q_week: 0,
                q_month: 0
            };


        };

        $scope.showAlert = function () {
            NotificationService.alert("You caused an alert.", "Alert", "Ok", function () {
                $scope.message = "You clicked it!"
            })
        };

        $scope.device = device;

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
            upVotes.voteNow(votes)
                .success(function (data /*, status*/) {
                    $scope.idVote = data.objectId;
                    console.log(data);
                });
        };
    })









                     