'use strict';

/* Services */

// Simple value service.
angular.module('hotq.services', []).
    value('version', '0.1')

//service for voting
    .factory('upVotes', function ($http) {
        return {
            voteNow: function (vote,id) {

                if (id=='' || !id) {
                    return $http.post('https://api.parse.com/1/classes/Votes',
                        vote,
                        {
                            headers: {
                                "X-Parse-Application-Id": "wZe7Z3sAnUgprCrMOSQuarbUoTqmOyXS9MNguwhP",
                                "X-Parse-REST-API-Key": "48bWkLkDjKcafmwLREDkdVUoR84cY0ypmGNNbERo",
                                "Content-Type": "application/json"
                            },
                            cache: false,
                            withCredentials: false
                        }

                    );
                } else { //al doilea vot
                    return $http.put('https://api.parse.com/1/classes/Votes/' + id,
                        vote,
                        {
                            headers: {
                                "X-Parse-Application-Id": "wZe7Z3sAnUgprCrMOSQuarbUoTqmOyXS9MNguwhP",
                                "X-Parse-REST-API-Key": "48bWkLkDjKcafmwLREDkdVUoR84cY0ypmGNNbERo",
                                "Content-Type": "application/json"
                            },
                            cache: false,
                            withCredentials: false
                        }

                    );
                }

            }
        }
    })


   .factory("NotificationService", function () {
        return {
            alert: function (message, title, buttonText, buttonAction) {
                navigator.notification.alert(message,
                    buttonAction,
                    title,
                    buttonText);
            }
        }
    })







