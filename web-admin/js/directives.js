'use strict';

/* Directives */


var direct = angular.module('hotq.directives', [])

direct.directive('appVersion', ['version', function (version) {
    return function (scope, elm, attrs) {
        elm.text(version);
    };
}]);


direct.directive("scrollTo", ["$window", function ($window) {
    return {
        restrict: "AC",
        compile: function () {

            var document = $window.document;

            function scrollInto(idOrName, offset) {//find element with the given id or name and scroll to the first element it finds
                if (!idOrName) //move to top if idOrName is not provided
                    $window.scrollTo(0, 0);

                //check if an element can be found with id attribute
                var el = document.getElementById(idOrName);
                if (!el) {//check if an element can be found with name attribute if there is no such id
                    el = document.getElementsByName(idOrName);

                    if (el && el.length)
                        el = el[0];
                    else
                        el = null;
                }

                if (el) { //if an element is found, scroll to the element
                    if (offset) {
                        var top = $(el).offset().top - offset;
                        window.scrollTo(0, top);
                    }
                    else {
                        el.scrollIntoView();
                    }
                }
                //otherwise, ignore
            }

            return function (scope, element, attr) {
                element.bind("click", function (event) {
                    scrollInto(attr.scrollTo, attr.offset);
                });
            };
        }
    };
}]);