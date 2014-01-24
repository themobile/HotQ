angular.module('hotq.controllers.indexpage', [])

    .controller("indexpage", function ($scope, $rootScope, $timeout, $location, $http, $q, upVotes, questions, poosh, geolocation, parseBAAS) {

        $scope.thumbs=[1,2,3,4];


        $scope.thumbSetQuestion=function(index){
            questions.setCurrentQuestion(index);
        }

        $scope.init = function () {
            $timeout(function () {
                $rootScope.startup = false;
            }, 1000);
            $scope.swipe_indicator = false;
            $rootScope.loader = false;


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


            checkPoosh()
                .then(function (data) {
                    return getQuestions(data);
                })
                .then(function () {
                    var hotQLocal = window.localStorage.getItem("hotQuestions");
                    if (hotQLocal && hotQLocal != 'undefined') {
                        var localQ = JSON.parse(window.localStorage.getItem("hotQuestions"));
                        if (localQ.date === questions.getLocal().date) {
                            questions.setVote('questionOfDay', localQ.questionOfDay.hasVote);
                            questions.setVote('questionOfWeek', localQ.questionOfWeek.hasVote);
                            questions.setVote('questionOfMonth', localQ.questionOfMonth.hasVote);
                        }
                    }
                    $rootScope.$broadcast('questionsLoaded');
                    $scope.yesproc = questions.getLocal().questionOfDay.percentYes;
                    $scope.noproc = questions.getLocal().questionOfDay.percentNo;
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

            //read timesLoaded from storage
            $scope.timesLoaded = parseInt(window.localStorage.getItem("hotQTimesLoaded"));
            if ($scope.timesLoaded) {
                $scope.timesLoaded++;   // increment timesLoaded
            } else {
                $scope.timesLoaded = 1; // init timesLoaded
            }

            //write timesLoaded in storage
            window.localStorage.setItem("hotQTimesLoaded", $scope.timesLoaded.toString());

            //show demographics when 3 app loadings
            if ($scope.timesLoaded > 2) {
                if (!window.localStorage.getItem("hotQUserDemo")) {
                    this.showModal = demoModal.activate();  // show demos in modal
                } else {
                    $scope.user = JSON.parse(window.localStorage.getItem("hotQUserDemo"));
                    if ($scope.user.sex != 1 && $scope.user.sex != 2) { // check if data in storage
                        this.showModal = demoModal.activate();
                    }
                }
            }

//            first two loads show swipe indicator
            if ($scope.timesLoaded <= 2) {
                $scope.swipe_indicator = true;
                $timeout(function () {
                    $scope.swipe_indicator = false;
                }, 8000);
            }
        };

        //routing function
        $scope.go = function (location) {
            $timeout(function () {
                $scope.$spMenu.toggle();
            }, 20);
            $location.path(location);
        };

        $scope.goLocal = function (location) {
            $location.path(location);
        };

        $scope.goReward = function (location) {
            window.open(location, '_blank', 'location=yes');
        };

        //useful when voting :)
        $scope.getQuestionId = function () {
            return questions.getLocal()[$rootScope.currScreen].id;
        };

        //pay atention to currentScreen
        $rootScope.$watch('currScreen', function () {
            if (questions.getLocal()) {
                if (questions.getLocal()[$rootScope.currScreen]) {
                    $scope.yesproc = questions.getLocal()[$rootScope.currScreen].percentYes;
                    $scope.noproc = questions.getLocal()[$rootScope.currScreen].percentNo;
                }
            }
        });

        //if answers are visible or thank you text is shown
        $scope.answersVisible = function () {
            if (questions.getLocal()) {
                if (questions.getLocal()[$rootScope.currScreen]) {
                    return questions.getLocal()[$rootScope.currScreen].hasVote ? false : true;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        };


    })


