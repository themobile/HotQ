//Directives

angular.module('hotq.directives', [])

    .value('version', '0.1')

    .directive('loader', function ($scope) {
        return {
            restrict: 'A',
            template:
                '<div ng-hide="online" class="loading">' +
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








                     