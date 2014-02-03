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
    })


    .directive('dragMenu',
    function () {
        return {
            restrict: 'EAC',
            link: function ($scope, element, attrs, controller) {
                var content, menu, body,startY,contentY, currentY, menuY, delta, minimum, offset, transformProperty;
                element.bind("touchstart", elmTouchStart);
                element.bind("touchend", elmTouchEnd);
                element.bind("touchmove", elmTouchMove);
                menu = angular.element(document.querySelector('#menu'))[0];
                menuY = menu.getClientRects()[0].top;
                content=element[0];
                contentY=0



                function scroll(y) {

                    if (y<=-menuY) {
                        menu.style[transformProperty] = 'translate3d(0,' + y + 'px, 0)';
                        menu.style[transformProperty] = 'translate3d(0,' + y + 'px, 0)';

                    }


                    var contentY=y-menuY;
                    menu.style['top'] = y + 'px';
                    content.style['top'] = contentY + 'px';
                }


                function autoScroll() {
                    // scroll smoothly to "destination" until we reach it
                    // using requestAnimationFrame
                    var elapsed, delta;

                    if (amplitude) {
                        elapsed = Date.now() - timestamp;
                        delta = amplitude * Math.exp(-elapsed / timeConstant);
                        if (delta > rubberTreshold || delta < -rubberTreshold) {
                            scroll(destination - delta);
                            requestAnimationFrame(autoScroll);
                        } else {
                            goToSlide(destination / containerWidth);
                        }
                    }
                }

                function elmTouchStart(e) {
                    startY = e.clientY;
                    e.preventDefault();
                }

                function elmTouchMove(e) {

                    var diff= e.clientY-startY;
                    scroll(diff);

                    //for touchend to work
                    e.preventDefault();
                }

                function elmTouchEnd(e) {
                    startY=0;
                }


                // detect supported CSS property
                transformProperty = 'transform';
                ['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
                    var e = prefix + 'Transform';
                    if (typeof document.body.style[e] !== 'undefined') {
                        transformProperty = e;
                        return false;
                    }
                    return true;
                });
            }
        };
    }
);