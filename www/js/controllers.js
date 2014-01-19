angular.module('hotq.controllers', ['btford.modal'])

    .value('version', '0.1')

    .controller("HotqCtl", function ($scope, $rootScope, $timeout, $location, $http, $q, upVotes, questions, poosh, offlineswitch, geolocation, demoModal, parseBAAS) {

        var screenList = ["questionOfDay", "questionOfWeek", "questionOfMonth", "reward"];

        // fereastra modala cu tot ce tine de ea
        $scope.user = {};
        $scope.demoThanks = false;
        $scope.closeModal = function () {
            demoModal.deactivate();
        };
        $scope.steps = ['one', 'two', 'three', 'four'];
        $scope.step = 0;
        $scope.isCurrentStep = function (step) {
            return $scope.step === step;
        };
        $scope.setCurrentStep = function (step) {
            $scope.step = step;
        };
        $scope.getCurrentStep = function () {
            return $scope.steps[$scope.step];
        };
        $scope.isFirstStep = function () {
            return $scope.step === 0;
        };
        $scope.isLastStep = function () {
            return $scope.step === ($scope.steps.length - 1);
        };
        $scope.getNextLabel = function () {
            return ($scope.isLastStep()) ? '' : '';
        };
        $scope.handlePrevious = function () {
            $scope.step -= ($scope.isFirstStep()) ? 0 : 1;
        };
        $scope.handleNext = function () {
            if ($scope.isLastStep()) {
                $scope.demoThanks = true;
                window.localStorage.setItem("hotQUserDemo", JSON.stringify($scope.user));
                $timeout(function () {
                    $scope.closeModal();
                }, 1500);

            } else {
                $timeout(function () {
                    $scope.step += 1;
                }, 200);
            }
        };
        //end fereastra modala




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
                    $rootScope.installId=hotQPushSyncIdLocal;
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
                                        $rootScope.installId=hotQPushSyncId;
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
                    $scope.questions = questions.getLocal();
                    console.log($scope.questions.questionOfDay.picture);
                    if (window.localStorage.getItem("hotQuestions")) {
                        var localQ = JSON.parse(window.localStorage.getItem("hotQuestions"));
                        if (localQ.date === $scope.questions.date) {
                            questions.setVote('questionOfDay', localQ.questionOfDay.hasVote);
                            questions.setVote('questionOfWeek', localQ.questionOfWeek.hasVote);
                            questions.setVote('questionOfMonth', localQ.questionOfMonth.hasVote);
                            $scope.questions = questions.getLocal();
                        }
                    }

                    $scope.yesproc = $scope.questions.questionOfDay.percentYes;
                    $scope.noproc = $scope.questions.questionOfDay.percentNo;
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

            //citeste din localStorage
            $scope.timesLoaded = parseInt(window.localStorage.getItem("hotQTimesLoaded"));
            if ($scope.timesLoaded) {
                $scope.timesLoaded++;   // incrementare timesLoaded
            } else {
                $scope.timesLoaded = 1; // initiere timesLoaded
            }

            //scrie timesLoaded in storage
            window.localStorage.setItem("hotQTimesLoaded", $scope.timesLoaded.toString());

            //la 4 incarcari de aplicatie arata demograficele
            if ($scope.timesLoaded > 3) {
                if (!window.localStorage.getItem("hotQUserDemo")) {
                    this.showModal = demoModal.activate();  // arata demograficele in modal
                } else {
                    $scope.user = JSON.parse(window.localStorage.getItem("hotQUserDemo"));
                    if ($scope.user.sex != 1 && $scope.user.sex != 2) {
                        this.showModal = demoModal.activate();
                    }
                }
            }

            //            la primele doua incarcari arata swipe indicator
            if ($scope.timesLoaded <= 2) {
                $scope.swipe_indicator = true;
                $timeout(function () {
                    $scope.swipe_indicator = false;
                }, 5000);
            }
        };

        //functie pentru rutare
        $scope.go = function (location) {
            $timeout(function () {
                $scope.forward = true;
                $scope.$spMenu.toggle();
            }, 20);
            $location.path(location);
        };

        $scope.gother = function (location) {
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

        //step forward
        $scope.next = function () {
            $scope.forward = true;
            var curr = screenList.indexOf($rootScope.currScreen);
            curr++;
            if (curr <= screenList.length - 1) {
                $location.path("/" + screenList[curr]);
            }
        };

        //step backward
        $scope.previous = function () {
            $scope.forward = false;
            var curr = screenList.indexOf($rootScope.currScreen);
            curr--;
            if (curr >= 0) {
                $location.path("/" + screenList[curr]);
            }
        };


        //votare efectiva cu service voteNow
        $scope.voteNow = function (questionId, voteValue) {
            $rootScope.loaderMessage = "hotQ notează răspunsul tău...";
            $rootScope.loader = true;
            upVotes.voteNow(questionId, voteValue, $rootScope.installId, {position: $scope.position, address: $scope.geoInfo}, {demographics: $scope.user})
                .success(function (data /* tipul de intrebare la care s-a votat */) {
                    questions.setVote(data.result.success, true);
                    $scope.questions = questions.getLocal();
                    window.localStorage.setItem("hotQuestions", JSON.stringify(questions.getLocal()));
                    $rootScope.loader = false;
                })
                .error(function () {
                    $rootScope.loader = false;
                });
        };
    });