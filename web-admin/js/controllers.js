'use strict';

/* Controllers */

angular.module('hotq.controllers', [])

    .controller('main', function ($scope, questions) {


    })


    .controller('main_userquestions', function ($scope, userQuestions, userservice, $timeout) {

        $scope.operationError = false;
        $scope.user = userservice.getUser();
        $scope.questions = [];

        $scope.currentPage = 0;
        $scope.pageSize = 10;


        $scope.numberOfPages = function () {
            return Math.ceil($scope.questions.length / $scope.pageSize);
        };

        $scope.getAll = function () {
            userQuestions.getAll().then(
                function (data) {
                    $scope.questions = data.data.results;

                },
                function (error) {
                    $scope.questions = 'Error retrieving user questions!';
                    $scope.operationError = true;
                    $timeout(function () {
                        $scope.operationError = false;
                    }, 3000);
                }

            );
        };

        $scope.deleteQuestion = function (index) {
            userQuestions.deleteQuestion(index).then(
                function (success) {
//                    $scope.questions.splice(index,1);

                },
                function (error) {
                    console.log('nu am putut sterge');
                    $scope.operationError = true;
                    $timeout(function () {
                        $scope.operationError = false;
                    }, 3000);
                }
            )
        };


        $scope.isRead = function (index) {
            var res = $scope.questions[index].isRead;
            var username = userservice.getUser().username;
            if (res) {
                return (res.indexOf(username) >= 0) ? true : false;
            } else {
                return false;
            }
        };


        $scope.markQuestion = function (index) {

            var username = userservice.getUser().username;
            var unmark, res, newMark = [];
            if ($scope.questions[index].isRead) {
                res = $scope.questions[index].isRead.indexOf(username);
            } else {
                $scope.questions[index].isRead = [];
                res = -1;
            }


            if (res == -1) {
                unmark = false;
                $scope.questions[index].isRead.push(username);
                newMark = $scope.questions[index].isRead;
            } else {
                unmark = true;
                $scope.questions[index].isRead.splice(res, 1);
                newMark = $scope.questions[index].isRead;

            }


            userQuestions.markQuestion(newMark, index).then(
                function (success) {
                    $scope.questions[index].isRead = newMark;

                },
                function (error) {
                    console.log('nu am putut marca');
                    $scope.operationError = true;
                    $timeout(function () {
                        $scope.operationError = false;
                    }, 3000);
                }
            )
        }

    })

    .controller('main_addquestion', function ($scope, sendQuestion, $timeout, userQuestions) {


        $scope.saveQuestionSuccess = false;
        $scope.saveQuestionError = false;
        $scope.qCategory = [];


        $scope.addFile = function (files) {
            $scope.files = files[0];
        };

        $scope.getCategory = function () {
            userQuestions.getCategory().then(
                function (data) {
                    $scope.qCategory = data;
                },
                function (error) {
                    $scope.saveQuestionError = true;
                    $timeout(function () {
                        $scope.saveQuestionError = false;
                    }, 3000);
                }
            )
        };

        $scope.addQuestion = function () {

            sendQuestion.add($scope.q, $scope.files)
                .then(
                function (success) {
                    $scope.saveQuestionSuccess = true;
                    $scope.q = {};
                    $timeout(function () {
                        $scope.saveQuestionSuccess = false;
                    }, 3000);

                },
                function (error) {
                    $scope.saveQuestionError = true;
                    $timeout(function () {
                        $scope.saveQuestionError = false;
                    }, 3000);
                }
            )
        };
    })


    .controller('main_addquote', function ($scope, sendQuote, $timeout) {

        $scope.saveQuoteSuccess = false;
        $scope.saveQuoteError = false;
        $scope.quote = {};

        $scope.addFile = function (files) {
            $scope.files = files[0];
        };


        $scope.addQuote = function () {
            sendQuote.add($scope.quote, $scope.files)
                .then(
                function (success) {
                    $scope.saveQuoteSuccess = true;
                    $scope.quote = {};
                    $timeout(function () {
                        $scope.saveQuoteSuccess = false;
                    }, 3000);

                },
                function (error) {
                    $scope.saveQuoteError = true;
                    $timeout(function () {
                        $scope.saveQuoteError = false;
                    }, 3000);
                }
            )
        };
    })


    .controller('login', function ($scope, userservice, $location, $timeout, $log) {
        $scope.error = false;
        $scope.success = false;


        $scope.isLoggedIn = function () {
            return userservice.isLoggedIn();
        };

        $scope.logout = function () {
            userservice.logout();
            $scope.reset();
        };

        $scope.user = userservice.getUser();

        $scope.login = function () {
            $log.info('logging in')
            userservice.login($scope.user).then(

                function (success) {
                    $scope.user.sessionToken = success.data.sessionToken;
                    $scope.error = false;
                    $scope.success = true;
                    $timeout(function () {
                        $scope.success = false;
                    }, 3000);
                },

                function (error) {
                    $scope.error = true;
                    $timeout(function () {
                        $scope.error = false;
                    }, 3000);
                    $scope.loading = false;
                }

            )
        };

        $scope.reset = function () {
            $scope.error = false;
            $scope.loading = false;
            $scope.success = false;

            $scope.user = {};
        }

    })

    .controller('menuCtrl', function ($scope, userservice) {
        $scope.isLoggedIn = function () {
            return userservice.isLoggedIn();
        }


    });