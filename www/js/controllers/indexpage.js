'use strict';


angular.module('hotq.controllers.indexpage', [])

    .controller("indexpage", function ($scope, $rootScope, $timeout, $location, $http, $q, upVotes, offlineswitch, questions, poosh, geolocation, parseBAAS, snapRemote) {

        $scope.toggleMenu = function () {
            snapRemote.toggle('left');
        }

        //allowing to change menu button color for quote slide! silly, yes!
        $scope.$on('isQuoteSlide', function(ev,value) {
           value ? $scope.isQuote=true : $scope.isQuote=false;
        });




        $scope.init = function () {


            var timesLoaded = window.localStorage.getItem('hotQTimesLoaded');

            if (timesLoaded) {
                timesLoaded++;
                window.localStorage.setItem('hotQTimesLoaded', timesLoaded);

                if (timesLoaded >= 3 && !window.localStorage.getItem('hotQUserDemo')) {
                    $location.path('/demographics');
                }

            } else {
                window.localStorage.setItem('hotQTimesLoaded', 1);

            }


            var tags = {
                cordova: device.cordova,
                platform: device.platform,
                version: device.version,
                model: device.model
            };

            var timeOffset = (new Date()).getTimezoneOffset().toString();
            var hotQPushSyncLastDate = (new Date()).getFullYear().toString() + (new Date()).getMonth().toString();


            var hotQPushSyncIdLocal = window.localStorage.getItem('hotQPooshSyncID');
            var hotQPushSyncLastDateLocal = window.localStorage.getItem('hotQPooshSyncDate');


            var checkPoosh = function () {
                var dfd = $q.defer(); //promise pe toata functia

                if (hotQPushSyncIdLocal && (hotQPushSyncLastDateLocal == hotQPushSyncLastDate)) {
                    $rootScope.installId = hotQPushSyncIdLocal;
                    dfd.resolve(hotQPushSyncIdLocal); // nu mai e nevoie de poosh
                } else {
                    dfd.resolve(
                        poosh.getPooshToken(device.platform)
                            .then(function (token) {

                                var postData = {deviceCode: device.uuid, timeZone: timeOffset, tags: tags, type: device.platform, pushCode: token};
                                var deferred = $q.defer();

                                parseBAAS.post('AddDevice', postData)
                                    .success(function () {
                                        var hotQPushSyncId = parseBAAS.getResult();
                                        $rootScope.installId = hotQPushSyncId;
                                        window.localStorage.setItem('hotQPooshSyncID', hotQPushSyncId);
                                        window.localStorage.setItem('hotQPooshSyncDate', hotQPushSyncLastDate);
                                        deferred.resolve(hotQPushSyncId);
                                    })

                                    .error(function (error) {

                                        deferred.reject(error);
                                    });
                                return deferred.promise;
                            })
                    );
                }
                return dfd.promise; // returneaza promise
            };


            var getQuestions = function (installId) {
                var dfd = $q.defer();
                $rootScope.loaderMessage = "hotQ încarcă întrebările...";
                $rootScope.loader = true;
                questions.loadRemote({installationId: installId})
                    .then(
                    function (data) {
                        dfd.resolve(data);
                    },
                    function (error) {
                        dfd.reject(error);
                    }
                );
                return dfd.promise;
            };

//
//            checkPoosh()
//                .then(function (data) {
//                    console.log(data);
//                    return getQuestions(data);
//                })
            getQuestions('SUs4MpZYPFdgLOegoom3xA==')
                .then(function () {
                    var hotQLocal = window.localStorage.getItem("hotQuestions");
                    if (hotQLocal && hotQLocal != 'undefined') {
                        var localQ = JSON.parse(window.localStorage.getItem("hotQuestions"));
                        if (localQ.date === questions.getLocal().date) {
                            questions.setVote(0, localQ.content[0].hasVote);
                            questions.setVote(1, localQ.content[1].hasVote);
                            questions.setVote(2, localQ.content[2].hasVote);
                        }
                    }
                    $rootScope.$broadcast('questionsLoaded');
                    //succes
                    $rootScope.loader = false;
                }, function () {
                    //eroare
                    $rootScope.loader = false;
                });


            geolocation.getAll()
                .then(function (position) {
                    $scope.position = position.coords;
                    var latP = parseFloat($scope.position.latitude);
                    var lngP = parseFloat($scope.position.longitude);
                    var geocoder = new google.maps.Geocoder();
                    var latlng = new google.maps.LatLng(latP, lngP);
                    geocoder.geocode({'latLng': latlng}, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            $scope.geoInfo = results;
                        } else {
                            $scope.geoInfo = ['error'];
                        }
                    });
                }, function (error) {
                    console.log('Eroare geolocatie: ' + JSON.stringify(error));
                }
            );


            $scope.goLink = function (location) {
                window.open(location, '_blank', 'location=yes');
            };


            //functie pentru rutare
            $scope.go = function (location) {
                $timeout(function () {
                    $scope.forward = true;
                    snapRemote.toggle('left');
                }, 100);
                $location.path(location);
            };

            //functie pentru rutare
            $scope.goLocal = function (location) {
                $timeout(function () {
                    $scope.forward = true;
                }, 20);
                $location.path(location);
            };

        };

    })


