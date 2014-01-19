'use strict';

/* Services */

angular.module('hotq.services', ["btford.modal"]).
    value('version', '0.1')


    .factory('demoModal', function (btfModal) {
        return btfModal({
            controller: 'HotqCtl',
            controllerAs: 'modal',
            templateUrl: 'partials/demographics.html'
        })
    })

    .factory('parseBAAS', function ($http) {
        var parseCredentials = {
            "X-Parse-Application-Id": "oYvsd9hx0NoIlgEadXJsqCtU1PgjcPshRqy18kmP",
            "X-Parse-REST-API-Key": "gX3SUxGPeSnAefjtFmF9MeWpbTIa9YhC8q1n7hLk",
            "Content-Type": "application/json"
        };

        var result;

        return {
            post: function(functionName,payLoad) {
                return $http(
                    {
                        method: 'POST',
                        url: 'https://api.parse.com/1/functions/'+functionName,
                        headers: parseCredentials,
                        withCredentials: false,
                        cache: false,
                        data: payLoad
                    }
                )
                    .success(function (data) {
                        result=data.result;
                    })
                    .error(function (error) {
                    });
            },
            getResult: function(){
                return result;
            },
            getCredentials:function() {
                return parseCredentials;
            }
        }
    })

    .factory('questions', function (parseBAAS) {

        var allQuestions;
        return {
            loadRemote: function (installationId) {
                return parseBAAS.post('GetQuestions',installationId)
                    .then(function(result){
                        allQuestions=parseBAAS.getResult();
                    });
            },

            getLocal: function () {
                return allQuestions;
            },

            setVote: function(question,vote) {
                allQuestions[question].hasVote=vote;
            }
        }
    })

//service for voting
    .factory('upVotes', function (parseBAAS) {
        return {
            voteNow: function (questionId, answer, installationId, position, demographics) {
                var vote = {};
                vote.installationId = installationId;
                vote.questionId = questionId;
                vote.answer = {answer: answer};
                vote.position = position;
                vote.demographics = demographics;

                return parseBAAS.post('VoteSubmit',vote);

            }
        }
    })


    .factory('poosh', function ($q) {

        return {
            getPooshToken: function (type) {
                var pushNotification = window.plugins.pushNotification;
                var deferred = $q.defer();
                var regString = {};

                if (type == "Android") {
                    regString = { projectid: "315937580723", appid: "53BC6-33E16" };
                }
                if (type == "iPhone" || type == "iOS") {
                    regString = {alert: true, badge: true, sound: true, pw_appid: "53BC6-33E16", appname: "hotq"};
                }
                pushNotification.registerDevice(regString,
                    function (token) {
                        //callback when pushwoosh is ready
                        if (token['deviceToken']) {
                            deferred.resolve(token['deviceToken']);
                        } else {
                            deferred.resolve(token);
                        }
                    },
                    function (error) {
                        deferred.reject(error);
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

        $rootScope.$on('onlineChanged', function (evt, isOnline) {

            var superScope = evt.currentScope;
            superScope.$apply(function () {
                superScope.online = isOnline;
                superScope.loaderMessage = "hotq este offline!";
                superScope.loader = !isOnline;
            });

            if (isOnline == true) {
                angular.element(document.getElementsByTagName('body')[0]).scope().init();
                angular.element(document.getElementsByTagName('body')[0]).scope().$apply();

                console.log('isOnline event');
            }
            console.log('isOnline: ' + isOnline);
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










