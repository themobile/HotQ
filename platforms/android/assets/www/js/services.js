'use strict';

/* Services */

angular.module('hotq.services', []).
    value('version', '0.1')

//service for voting
    .factory('upVotes', function ($http) {
        return {
            voteNow: function (questionId, answer, installationId, position) {
                var vote = {};
                vote.installationId = installationId;
                vote.questionId = questionId;
                vote.answer = {answer: answer};
                vote.position = position;
                return $http.post('https://api.parse.com/1/functions/VoteSubmit',
                    vote,
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
    })


    .factory('questions', function ($http, $q) {
        return {
            getAll: function (installationId) {
                var deferred = $q.defer();
                $http(
                    {
                        method: 'POST',
                        url: 'https://api.parse.com/1/functions/GetQuestions',
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
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject(data);
                    });
                return deferred.promise;
            }
        }
    })


    .factory('geolocation', function ($q) {
        return {
            getAll: function () {
                var deferred = $q.defer();
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        deferred.resolve(position);
                    },
                    function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            }
        }
    })


    .factory('offlineswitch', function ($rootScope) {
//        FIXME de facut load la date atunci cand devine online
//        eventual de mutat getparseid si loadquestions in eventul de online, nu stiu...

        var currentStorage;
        var me = this;
        $rootScope.$on('onlineChanged', function (evt, isOnline) {

            var superScope = evt.currentScope;
            superScope.$apply(function () {
                superScope.online = isOnline;
                superScope.loaderMessage = "hotq este offline!";
                superScope.loader = !isOnline;
            });

            if (isOnline == true) {
                //reincarcare date
                console.log('reincarcare date');
            }
            console.log('isOnline: ' + isOnline);
//            currentStorage = isOnline ? $http : LocalStorage
        });
    })



    .directive('loader', function () {
        return {
            restrict: 'A',
            template: '<div  class="loading">' +
                '<div id="bowlG">' +
                '<div id="bowl_ringG">' +
                '<div class="ball_holderG">' +
                '<div class="ballG">' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<span class="loader_text"> {{loaderMessage}}' +
                '</span>' +
                '</div>' +
                '</div>'
        }
    });









