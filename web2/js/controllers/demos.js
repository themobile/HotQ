angular.module('hotq.controllers.demos', [])

    .controller("demos", function ($scope, $location, $timeout) {

        //allowing to change menu button color for quote slide! silly, yes!
        $scope.$on('isQuoteSlide', function(ev,value) {
            value ? $scope.isQuote=true : $scope.isQuote=false;
        });


        // fereastra modala cu tot ce tine de ea
        $scope.user = {};
        $scope.demoThanks = false;


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
                    $location.path('/carousel');
                }, 2500);

            } else {
                $timeout(function () {
                    $scope.step += 1;
                }, 200);
            }
        };
        //end fereastra modala

    });