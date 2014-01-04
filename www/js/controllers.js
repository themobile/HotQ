angular.module('hotq.controllers', ['btford.modal'])

    .value('version', '0.1')

    .controller("HotqCtl", function ($scope, $rootScope, $timeout, $location, $http, $q, upVotes, questions, poosh, offlineswitch, geolocation, demoModal) {

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
                }, 1000);
            }
        };
        //end fereastra modala

        $scope.init = function () {
            $timeout(function () {
                $rootScope.startup = false;
            }, 1000);
            $scope.swipe_indicator = false;
            $rootScope.loader = false;


//            initializare PUSHWOOSH
            $scope.initPushwoosh = poosh.getAll(device.platform);
            $scope.initPushwoosh.then(
                function (token) {
                    var postData = {deviceCode: device.uuid, pushCode: token};
                    $http(
                        {
                            method: 'POST',
                            url: 'https://api.parse.com/1/functions/AddDevice',
                            headers: {
                                "X-Parse-Application-Id": "oYvsd9hx0NoIlgEadXJsqCtU1PgjcPshRqy18kmP",
                                "X-Parse-REST-API-Key": "gX3SUxGPeSnAefjtFmF9MeWpbTIa9YhC8q1n7hLk",
                                "Content-Type": "application/json"
                            },
                            withCredentials: false,
                            cache: false,
                            data: postData
                        }
                    )
                        .success(function (data) {
                            $rootScope.installId = data.result;
                        })
                        .error(function (data) {
//                            FIXME: de tratat eroare
                            $rootScope.installId = data;
                        });

                },
                function (status) {
                    $rootScope.installId = status;
                }
            );

            //   SFARSIT INITIALIZARE PUSHWOOSH

            //obiect cu uuid (nu e acceptat de IOS?????) si devicename
            $scope.deviceInfo = {
                name: device.name,
                uuid: device.uuid
            };

            $rootScope.loaderMessage = "hotQ încarcă întrebările...";
            $rootScope.loader = true;

            //call getAll with installationId
            $scope.questions = questions.getAll({installationId: $rootScope.installId});
            $scope.questions.then(
                function (data) {
                    var localData = {};
                    $scope.questions = data.result;
                    $scope.yesproc = $scope.questions.questionOfDay.percentYes;
                    $scope.noproc = $scope.questions.questionOfDay.percentNo;
                    if (window.localStorage.getItem("hotQuestions")) {
                        localData = JSON.parse(window.localStorage.getItem("hotQuestions"));
                        if (localData.date === $scope.questions.date) {
                            $scope.questions.questionOfDay.hasVote = localData.questionOfDay.hasVote;
                            $scope.questions.questionOfWeek.hasVote = localData.questionOfWeek.hasVote;
                            $scope.questions.questionOfMonth.hasVote = localData.questionOfMonth.hasVote;
                        }
                    }
                    $rootScope.loader = false;

                    //scriem in localstorage
                    window.localStorage.setItem("hotQuestions", JSON.stringify(data.result));
                }, function () {
                    //prelevare date din localstorage daca exista in caz de eroare server
                    var localQuestions = window.localStorage.getItem('hotQuestions');
                    if (localQuestions) {
                        $scope.questions = JSON.parse(localQuestions);
                        $scope.yesproc = $scope.questions.questionOfDay.percentYes;
                        $scope.noproc = $scope.questions.questionOfDay.percentNo;
                        console.log('nu incarc date - eroare grava');

                    } else {
//                        TODO: de pus dummy questions sau de vazut ce e cu reteaua. ceva nu merge
                        console.log('nu incarc date - eroare grava');
                    }
                    $rootScope.loader = false;

                });


            //geolocatie si decodare google
            $scope.position = geolocation.getAll();
            $scope.position.then(function (position) {
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
                console.log(error);
            });

            //citeste din localStorage
            $scope.timesLoaded = window.localStorage.getItem("hotQTimesLoaded");
            if ($scope.timesLoaded) {
                $scope.timesLoaded++;   // incrementare timesLoaded
            } else {
                $scope.timesLoaded = 1; // initiere timesLoaded
            }

            //scrie timesLoaded in storage
            window.localStorage.setItem("hotQTimesLoaded", $scope.timesLoaded);

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
            console.log(location);
            window.open(location, '_blank', 'location=yes');
        };

        //useful when voting :)
        $scope.getQuestionId = function () {
            return $scope.questions[$rootScope.currScreen].id;
        };

        //pay atention to currentScreen
        $rootScope.$watch('currScreen', function () {
            if ($scope.questions) {
                if ($scope.questions[$rootScope.currScreen]) {
                    $scope.yesproc = $scope.questions[$rootScope.currScreen].percentYes;
                    $scope.noproc = $scope.questions[$rootScope.currScreen].percentNo;
//                console.log('Screen changed: ' + $rootScope.currScreen);
                }
            }
        });

        //if answers are visible or thank you text is shown
        $scope.answersVisible = function () {
            if ($scope.questions) {
                if ($scope.questions[$rootScope.currScreen]) {
                    return $scope.questions[$rootScope.currScreen].hasVote ? false : true;
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
            upVotes.voteNow(questionId, voteValue, $rootScope.installId, {deviceInfo: $scope.deviceInfo, position: $scope.position, address: $scope.geoInfo}, {demographics: $scope.user})
                .success(function (data /* tipul de intrebare la care s-a votat */) {
                    $scope.questions[data.result.success].hasVote = true;
                    window.localStorage.setItem("hotQuestions", JSON.stringify($scope.questions));
                    $rootScope.loader = false;
                })
                .error(function () {
                    $rootScope.loader = false;
                });
        };
    });