angular.module('hotq.controllers', [])

    .value('version', '0.1')

    .controller("HotqCtl", function ($scope, $rootScope,$timeout, $location, $http, $q, upVotes, questions, offlineswitch, geolocation) {

        var screenList = ["questionOfDay", "questionOfWeek", "questionOfMonth", "reward"];


        $scope.init = function () {
            //load questions from backend
            //FIXME de scris in local storage
            $rootScope.loaderMessage = "hotQ încarcă întrebările...";
            $rootScope.loader = true;

            //obiect cu uuid si devicename
            $scope.deviceInfo={
                name:device.name,
                uuid:device.uuid
            }


            //call getAll with installationId
            $scope.questions = questions.getAll({installationId: $rootScope.installId});
            $scope.questions.then(
                function (data) {
                    $rootScope.loader = false;
                    $scope.questions = data.result;
                    $scope.yesproc=$scope.questions.questionOfDay.percentYes;
                    $scope.noproc=$scope.questions.questionOfDay.percentNo;
                    $rootScope.loaderMessage = 'Loadddddiniinig';
                }, function (status) {
                    console.log(status);
                });



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
        };

        //functie pentru rutare
        $scope.go = function (location) {
            $timeout(function() {
                $scope.forward = true;
                $scope.$spMenu.toggle();
            },20);
            $location.path(location);
        };


        $scope.gother = function(location) {
            $location.path(location);
        };


        $scope.goReward = function (location) {
            console.log(location);
            window.open(location, '_blank', 'location=yes');
        }


        //useful when voting :)
        $scope.getQuestionId = function () {
            return $scope.questions[$rootScope.currScreen].id;
        };



        //pay atention to currentScreen
        $rootScope.$watch('currScreen', function (currScreen) {
            if ($scope.questions[$rootScope.currScreen]) {
                $scope.yesproc=$scope.questions[$rootScope.currScreen].percentYes;
                $scope.noproc=$scope.questions[$rootScope.currScreen].percentNo;
//                console.log('Screen changed: ' + $rootScope.currScreen);
            }
        });


        //if answers are visible or thank you text is shown
        $scope.answersVisible = function () {
            if ($scope.questions) {
                if ($scope.questions[$rootScope.currScreen]) {
                    return $scope.questions[$rootScope.currScreen].hasVote ? false : true;
                } else {
                    return true
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
            } else {
                curr--;
            }
        };

        //step backward
        $scope.previous = function () {
            $scope.forward = false;
            var curr = screenList.indexOf($rootScope.currScreen);
            curr--;
            if (curr >= 0) {
                $location.path("/" + screenList[curr]);
            } else {
                curr++;
            }
        };


        $scope.voteNow = function (questionId, voteValue) {
            $rootScope.loaderMessage = "hotQ notează răspunsul tău..."
            $rootScope.loader = true;
            upVotes.voteNow(questionId, voteValue, $rootScope.installId, {deviceInfo:$scope.deviceInfo, position: $scope.position, address: $scope.geoInfo})
                .success(function (data /* tipul de intrebare la care s-a votat */) {
                    $scope.questions[data.result.success].hasVote = true;
                    //FIXME de pus in localstorage ca a votat
                    $rootScope.loader = false;
                })
                .error(function (error) {
                    $rootScope.loader = false;
                });
        };

    })











                     