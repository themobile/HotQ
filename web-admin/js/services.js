'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('hotq.services', [])
    .value('version', '0.1')


    .factory('questions', function ($http, $q, $rootScope,$timeout) {

        var allQ = [];
        var indx = 0;
//

        return {
            getAll: function (installationId) {
                var deferred = $q.defer();
                $http(
                    {
                        method: 'POST',
                        url: 'https://api.parse.com/1/functions/GetListQuestions',
                        headers: {
                            "X-Parse-Application-Id": "oYvsd9hx0NoIlgEadXJsqCtU1PgjcPshRqy18kmP",
                            "X-Parse-REST-API-Key": "gX3SUxGPeSnAefjtFmF9MeWpbTIa9YhC8q1n7hLk",
                            "Content-Type": "application/json"
                        },
                        withCredentials: false,
                        cache: false,
                        data: installationId
                    }
                )
                    .success(function (data) {
                        allQ = data.result;
                        deferred.resolve(data.result);
                    })
                    .error(function (data /*, status, headers, config*/) {
                        console.log('aaaiaaaiaaai');
                        deferred.reject(data);
                    });
                return deferred.promise;
            },

            getAllQuestions: function() {
              return allQ;
            },

            getCurrentQuestion: function () {
                return currQuestion;
            },
            nextQuestion: function () {
                var isEnd = false;
                indx = allQ.indexOf(currQuestion);
                if (indx < allQ.length - 1) {
                    indx++;
                    currQuestion = allQ[indx];
                    if (indx == allQ.length - 1)  isEnd = 'last';
                    $rootScope.$broadcast('questionChanged', currQuestion, isEnd);
                }
            },

            prevQuestion: function () {
                var isEnd = false;
                indx = allQ.indexOf(currQuestion);
                if (indx > 0) {
                    indx--;
                    currQuestion = allQ[indx];
                    if (indx == 0)  isEnd = 'first';
                    $rootScope.$broadcast('questionChanged', currQuestion, isEnd);
                }
            },
            isLast: function () {
                return (indx == allQ.length - 1);
            },
            isFirst: function () {
                return (indx == 0);
            }
        }
    })


//service for voting
    .factory('sendQuestion', function ($http) {
        return {
            now: function (qSend) {

                return $http.post('https://api.parse.com/1/functions/UserQuestionSubmit',
                    qSend,
                    {
                        headers: {
                            "X-Parse-Application-Id": "oYvsd9hx0NoIlgEadXJsqCtU1PgjcPshRqy18kmP",
                            "X-Parse-REST-API-Key": "gX3SUxGPeSnAefjtFmF9MeWpbTIa9YhC8q1n7hLk",
                            "Content-Type": "application/json"
                        },
                        cache: false,
                        withCredentials: false
                    }
                );

            }
        }
    });