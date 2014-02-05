'use strict';


var direct = angular.module('hotq.directives', ['ngTouch'])

    .directive('loader', function () {
        return {
            restrict: 'A',
            template: '<div  class="loading">' +
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