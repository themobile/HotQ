'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('hotq.services', [])
    .value('version', '0.1')


    .factory('userQuestions', function ($http, userservice) {


        var userQ = []
            , qCategory = []
            ;
        var credent1 = userservice.getCredentials();
        var credent2 = credent1;
        credent1['Content-Type'] = 'application/x-www-form-urlencoded'
        credent2['Content-Type'] = 'application/json'
        return {
            getCategory: function () {
                return $http(
                    {
                        method: 'GET',
                        url: 'https://api.parse.com/1/classes/QuestionCategory',
                        headers: credent1,
                        withCredentials: false,
                        cache: false
//                        ,
//                        params: {"where": "{\"isDeleted\":{\"$ne\":true}}"}
                    }
                )
                    .success(function (data) {
                        qCategory = data.results;
                    })
                    .error(function (error) {

                    })
            },

            getAll: function () {
                return $http(
                    {
                        method: 'GET',
                        url: 'https://api.parse.com/1/classes/UserQuestion',
                        headers: credent1,
                        withCredentials: false,
                        cache: false,
                        params: {"where": "{\"isDeleted\":{\"$ne\":true}}"}
                    }
                )
                    .success(function (data) {
                        userQ = data.results;
                    })
                    .error(function (error) {

                    })
            },

            deleteQuestion: function (id) {
                return $http(
                    {
                        method: 'PUT',
                        url: 'https://api.parse.com/1/classes/UserQuestion/' + userQ[id].objectId,
                        headers: credent2,
                        withCredentials: false,
                        cache: false,
                        data: {"isDeleted": true}
                    }
                )
                    .success(function (data) {
                        userQ.splice(id, 1);
                    })
                    .error(function (error) {

                    })
            },

            markQuestion: function (newMark, index) {

                return $http(
                    {
                        method: 'PUT',
                        url: 'https://api.parse.com/1/classes/UserQuestion/' + userQ[index].objectId,
                        headers: credent2,
                        withCredentials: false,
                        cache: false,
                        data: {"isRead": newMark}
                    }
                )
                    .success(function (data) {
                        userQ[index].isRead = newMark;
                    })
                    .error(function (error) {

                    })
            }



        }
    })

    .factory('userservice', function ($http, $q, $cookieStore) {

        var parseCredentials = {
            "X-Parse-Application-Id": "MqJG79VqkwRoUZIFJrOJ348AYdXqAnifz603oSMM",
            "X-Parse-REST-API-Key": "gzDPTv9R1WG5iYCAuqXTLOj50VAqN5joOH6ogWpM",
            "X-Parse-Session-Token": '',
            "Content-Type": "application/json"
        };

        var userData = {};

        return {
            login: function (user) {
                return $http(
                    {
                        method: 'GET',
                        url: 'https://api.parse.com/1/login',
                        headers: parseCredentials,
                        withCredentials: false,
                        cache: false,
                        params: user
                    }
                )
                    .success(function (data) {
                        userData = data;
                        parseCredentials['X-Parse-Session-Token'] = userData.sessionToken;
                        if (user.remember == 1) {
                            $cookieStore.put('hotQAdminUser', userData);
                        } else {
                            $cookieStore.remove('hotQAdminUser');
                        }
                    })
                    .error(function (error) {

                    });
            },
            //get user with token stored in cookie
            getUserByToken: function (token) {

                return $http(
                    {
                        method: 'GET',
                        url: 'https://api.parse.com/1/users/me',
                        headers: parseCredentials,
                        withCredentials: false,
                        cache: false
                    }
                )
                    .success(function (data) {
                        userData = data;
                    })
                    .error(function (error) {
                        userData = {};
                    })

            },

            getUser: function () {
                return userData;
            },

            logout: function () {
                userData = {};
                $cookieStore.remove('hotQAdminUser');
            },
            isLoggedIn: function () {
                return userData.sessionToken;
            },
            getToken: function () {
                return userData.sessionToken;
            },
            getCredentials: function () {
                return parseCredentials;
            },
            setToken: function (token) {
                parseCredentials["X-Parse-Session-Token"] = token;
            }
        }
    })


    .factory('sendQuestion', function ($http, userservice) {

        return {
            add: function (question, file) {

                var qToSave = {
                    category: question.category,
                    type: question.type,
                    text1: question.text1,
                    text2: question.text2,
                    startDate: question.startDate,
                    link: question.url,
                    imageSource: question.imageSource
                };


                var qId, imgLocation;

                return $http(
                    {
                        method: 'POST',
                        url: 'https://api.parse.com/1/functions/QuestionAdmin',
                        headers: userservice.getCredentials(),
                        withCredentials: false,
                        cache: false,
                        data: qToSave
                    }
                )
//                    .then(function (data) {
//                        qId = data.data.result.objectId;
//                        var credent = userservice.getCredentials();
//                        credent["Content-Type"] = "image/jpeg";
//                        return $http(
//                            {
//                                method: 'POST',
//                                url: 'https://api.parse.com/1/files/' + file.name,
//                                headers: credent,
//                                withCredentials: false,
//                                cache: false,
//                                data: file
//                            }
//                        )
//                    })
//                    .then(function (data) {
//                        imgLocation = data.data;
//                        var credent = userservice.getCredentials();
//                        credent["Content-Type"] = "application/json";
//                        var dataFile = {
//                            "imageFile": {
//                                "name": imgLocation.name,
//                                "__type": "File"
//                            }
//                        }
//
//                        return $http(
//                            {
//                                method: 'PUT',
//                                url: 'https://api.parse.com/1/classes/Question/' + qId,
//                                headers: credent,
//                                withCredentials: false,
//                                cache: false,
//                                data: dataFile
//                            }
//                        )
//                    })
            }
        }

    })


    .factory('sendQuote', function ($http, userservice) {

        return {
            add: function (quote, file) {

                var qId, imgLocation;

                return $http(
                    {
                        method: 'POST',
                        url: 'https://api.parse.com/1/functions/QuoteAdmin',
                        headers: userservice.getCredentials(),
                        withCredentials: false,
                        cache: false,
                        data: quote
                    }
                )

            }
        }

    })