angular.module('hotq.controllers.sendquestion', [])

    .controller("sendquestion", function ($scope, $rootScope, sendQuestion) {


        //allowing to change menu button color for quote slide! silly, yes!
        $scope.$on('isQuoteSlide', function(ev,value) {
            value ? $scope.isQuote=true : $scope.isQuote=false;
        });


        $scope.thankyou = false;
        $scope.error = false;
        $scope.qSend = {tricks: '', questionContent: ''};

        //check for question to be inside 15-200 chars
        $scope.checkQSend = function () {
            if ( typeof $scope.qSend.questionContent !='undefined') {
                return (($scope.qSend.questionContent.length < 15) || ($scope.qSend.questionContent.length>200));
            } else {
                return true;
            }
        }


        $scope.sendQ = function () {
            $rootScope.loaderMessage = "trimitem întrebarea...";

            $rootScope.loader = true;
            sendQuestion.now($scope.qSend).then(

                function (success) {
                    $scope.error = false;
                    $rootScope.loader = false;
                    $scope.thankyou = true;
                    $scope.qSend = {tricks: '', questionContent: ''};
                },

                function (error) {
                    $scope.error = true;
                    $rootScope.loader = false;
                }

            )
        };

        $scope.resetForm = function () {
            $scope.qSend = {tricks: '', questionContent: ''};
            $scope.error = false;
            $scope.thankyou = false;

        }


    });