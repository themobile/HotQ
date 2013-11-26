angular.module('hotq.controllers', [])

    .value('version', '0.1')

    .controller("HotqCtl", function ($scope, $rootScope, $location, $http, upVotes, questions, geolocation) {

        var screenList = ["questionOfDay", "questionOfWeek", "questionOfMonth", "reward"];

        $scope.init = function () {
            var initQuestions = function (id) {

                //loader
                $scope.loaderMessage="hotQ încarcă întrebările...";
                $rootScope.loader = true;

                $rootScope.currScreen="questionOfDay";
                questions.getAll(id)
                    .success(function (data) {
                        $rootScope.loader = false;
                        $scope.questions = data.result;
                        $scope.loaderMessage='Loadddddiniinig';

                        //padding for questions at 140 and 60 chars
                        var spaceous = ' '
                            , padQ = ''
                            , padI = ''

                        for (var i = 0; i < 141; i++) {
                            padQ = padQ + spaceous;
                        }

                        for (var i = 0; i < 61; i++) {
                            padI = padI + spaceous;
                        }

                        $scope.questions.questionOfDay.text1 = ($scope.questions.questionOfDay.text1 + padI).slice(0, 60);
                        $scope.questions.questionOfWeek.text1 = ($scope.questions.questionOfWeek.text1 + padI).slice(0, 60);
                        $scope.questions.questionOfMonth.text1 = ($scope.questions.questionOfMonth.text1 + padI).slice(0, 60);

                        $scope.questions.questionOfDay.text2 = ($scope.questions.questionOfDay.text2 + padQ).slice(0, 140);
                        $scope.questions.questionOfWeek.text2 = ($scope.questions.questionOfWeek.text2 + padQ).slice(0, 140);
                        $scope.questions.questionOfMonth.text2 = ($scope.questions.questionOfMonth.text2 + padQ).slice(0, 140);

                    })
                    .error(function (error) {
                        $rootScope.loader = false;
                        return error;
                    })
            };
            //load questions from backend
            //FIXME de scris in local storage
            initQuestions({installationId: $rootScope.installId});

            //geographic info
            $scope.position = geolocation.getAll();
        };


        $scope.go=function(location) {
           $location.path(location);
        };


        //disable Forward arrow
        $scope.checkForwardArrowDisabled = function() {
        return    ($rootScope.currScreen=="reward") ? true : false;
        };
        //disable Backward arrow
        $scope.checkBackwardArrowDisabled = function() {
        return    ($rootScope.currScreen=="about" || $rootScope.currScreen=="questionOfDay") ? true : false;
        };


        //if answers are visible or thank you text is shown
        $scope.answersVisible = function () {
            if ($scope.questions) {
                return $scope.questions[$rootScope.currScreen].hasVote ? false : true;
            } else {
                return false;
            }
        };

        //useful when voting :)
        $scope.getQuestionId = function () {
            return $scope.questions[$rootScope.currScreen].id;
        };

        //step forward
        $scope.next = function () {
            var curr = screenList.indexOf($rootScope.currScreen);
            curr++;
            if (curr <= screenList.length - 1) {
                $location.path("/" + screenList[curr]);
            } else {
                curr--;
            }
        };

        //step backward
        $scope.previous = function () {
            var curr = screenList.indexOf($rootScope.currScreen);
            curr--;
            if (curr >= 0) {
                $location.path("/" + screenList[curr]);
            } else {
                curr++;
            }
        };


        $scope.voteNow = function (questionId, voteValue) {
            var qtype = questionId;
            $scope.loaderMessage="hotQ notează răspunsul tău..."
            $rootScope.loader = true;
            upVotes.voteNow(questionId, voteValue, $rootScope.installId, $scope.position)
                .success(function (data /* tipul de intrebare la care s-a votat */) {
                    $scope.questions[data.result.success].hasVote = true;
                    //FIXME de pus in localstorage ca a votat
                    $rootScope.loader = false;
                })
                .error(function (error) {
                    $rootScope.loader = false;
                });
        };
    })









                     