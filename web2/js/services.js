'use strict';

/* Services */

angular.module('hotq.services', []).
    value('version', '0.1')


    .factory('questions', function ($http, $q) {

        var allQ = [];

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
            }


        }
    })

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














