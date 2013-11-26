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


    .factory('questions', function ($http) {
        return {
            getAll: function (installationId) {

                return $http.post('https://api.parse.com/1/functions/GetQuestions',
                    installationId,
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


    .factory('geolocation', function () {
        return {
            getAll: function () {
                var me = this;
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        me.position = position;
                    },
                    function (error) {
                        me.position = 'Error in geolocation';
                    })
                return me.position;
            }
        }
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
    })





