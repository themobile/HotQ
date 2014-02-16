(function (global) {

    /* smoothie.js */
    var Extender = {
        extend: function () {
            arguments[0] = arguments[0] || {};
            for (var i = 1; i < arguments.length; i++) {
                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        if (typeof(arguments[i][key]) === 'object') {
                            if (arguments[i][key] instanceof Array) {
                                arguments[0][key] = arguments[i][key];
                            } else {
                                arguments[0][key] = Extender.extend(arguments[0][key], arguments[i][key]);
                            }
                        } else {
                            arguments[0][key] = arguments[i][key];
                        }
                    }
                }
            }
            return arguments[0];
        }
    };

    // Rotator Control
    var tgpAbsInd = function (options) {

        // Private vars
        var self, center;

        function TgpAbsInd(options) {
            this.options = Extender.extend({}, TgpAbsInd.defaultOptions, options);
            self = this;
        }

        TgpAbsInd.defaultOptions = {
            width: 260,
            height: 260,
            innerArea: {
                areaSpeed: 0.225,
                circleRadius: 302,
                arcsCount: 1,
                arcsRadius: 1,
                arcsAngularGap: 5,
                arcsPadding: 0,
                glow: {
                    innerRadius: 8,
                    outerRadius: 42,
                    x: 7,
                    y: 7
                }
            },
            outerArcs: [

                {
//                    id: "arc-1",
                    speed: -0.02,
                    radius: 11,
                    distance: 50,
                    fill: "rgba(246,249,228,.3)",
                    angularSize: 270,
                    startAngle: 0
                },

                {
//                    id: "arc-2",
                    speed: -0.02,
                    radius: 11,
                    distance: 50,
                    fill: "rgba(264,192,13,.7)",
                    angularSize: 90,
                    startAngle: -90
                },

                {
//                    id: "arc-3",
                    speed: 0.22,
                    radius: 11,
                    distance: 65,
                    fill: "rgba(164,192,53,.7)",
                    angularSize: 50,
                    startAngle: Math.floor(Math.random() * 360) + 1
                },

                {
//                    id: "arc-4",
                    speed: 0.1,
                    radius: 36.6,
                    distance: 95,
                    fill: "rgba(164,192,53,.7)",
                    angularSize: 105,
                    startAngle: Math.floor(Math.random() * 360) + 1
                },

                {
//                    id: "arc-5",
                    speed: 0.08,
                    radius: 36.6,
                    distance: 95,
                    fill: "rgba(164,192,53,.05)",
                    angularSize: 100,
                    startAngle: Math.floor(Math.random() * 360) + 1
                },

                {
//                    id: "arc-6",
                    speed: 0.08,
                    radius: 36.6,
                    distance: 95,
                    fill: "rgba(164,192,53,.4)",
                    angularSize: 100,
                    startAngle: Math.floor(Math.random() * 360) + 1
                },
                {
//                    id: "arc-7",
                    speed: -0.15,
                    radius: 36.6,
                    distance: 95,
                    fill: "rgba(164,192,53,.7)",
                    angularSize: 45,
                    startAngle: Math.floor(Math.random() * 360) + 1
                }

            ]
        };

        TgpAbsInd.prototype.paintTo = function (selector) {

            var degsToRads = d3.scale.linear().domain([0, 360]).range([0, 2 * Math.PI]);
            d3.select("svg")
                .remove();

//            this.options.width=document.getElementById(selector).offsetWidth;
//            this.options.height=document.getElementById(selector).offsetHeight;

            this.svg = d3.select(selector)
                .append("svg")
                .attr("width", this.options.width)
                .attr("height", this.options.height)
                .attr("class", "animated pulse");

            center = {
                x: this.options.width / 2,
                y: this.options.height / 2
            };

            // Filters
            this.svg
                .append("defs")
                .append("filter")
                .attr("id", "inner-glow")
                .append("feGaussianBlur")
                .attr("in", "SourceGraphic")
                .attr("stdDeviation", this.options.innerArea.glow.x + " " + this.options.innerArea.glow.y);

            var g = this.svg
                .append("g");

            var innerArea = g.append("g")
                .attr("id", "inner-area");

            // Glowing arc
            innerArea.append("path")
                .attr("id", "inner-glowing-arc")
                .attr("transform", "translate(" + center.x + "," + center.y + ")")
                .attr("d", d3.svg.arc()
                    .innerRadius(this.options.innerArea.glow.innerRadius)
                    .outerRadius(this.options.innerArea.glow.outerRadius)
                    .startAngle(0)
                    .endAngle(2 * Math.PI))
                .style("fill", "rgba(164,192,53, 0)")
                .attr("filter", "url(#inner-glow)");

            // Inner circle
            innerArea.append("circle")
                .attr("id", "inner-circle")
                .attr("cx", center.x)
                .attr("cy", center.y)
                .attr("r", this.options.innerArea.circleRadius)
                .style("fill", "rgba(237,237,237,0)");

            innerArea.append("use")
                .attr("xlink:href", "#inner-circle")
                .attr("filter", "url(#inner-glow)");

            var paddings = this.options.innerArea.arcsCount * self.options.innerArea.arcsAngularGap,
                arcAngularSize = (360 - paddings) / this.options.innerArea.arcsCount;

            // Inner surrounding arcs
            innerArea.selectAll("path")
                .data(d3.range(this.options.innerArea.arcsCount + 1))
                .enter()
                .append("path")
                .style("fill", "rgba(164,192,53,0)")
                .attr("transform", "translate(" + center.x + "," + center.y + ")" +
                    "rotate(" + (180 - self.options.innerArea.arcsAngularGap / 2) + ")")
                .attr("d", function (d, i) {

                    var _innerRadius = self.options.innerArea.circleRadius + self.options.innerArea.arcsPadding,
                        startAngle = degsToRads(arcAngularSize * i + self.options.innerArea.arcsAngularGap * (i + 1)),
                        endAngle = degsToRads(arcAngularSize) + startAngle;

                    return d3.svg.arc()
                        .innerRadius(_innerRadius)
                        .outerRadius(_innerRadius + self.options.innerArea.arcsRadius)
                        .startAngle(startAngle)
                        .endAngle(endAngle)();
                });

            /* Outer arcs */
            var outerArea = g.append("g")
                .attr("id", "outer-area");

            var outerArcs = outerArea.selectAll("path")
                .data(this.options.outerArcs)
                .enter()
                .append("path")
                .attr("id", function (d) {
                    return d.id;
                })
                .style("fill", function (d) {
                    return d.fill;
                })
                .attr("transform", "translate(" + center.x + "," + center.y + ")")
                .attr("d", function (d) {

                    var _startAngle = degsToRads(d.startAngle),
                        _angularSize = degsToRads(d.angularSize),
                        _innerRadius = d.distance;

                    return d3.svg.arc()
                        .innerRadius(_innerRadius)
                        .outerRadius(_innerRadius + d.radius)
                        .startAngle(_startAngle)
                        .endAngle(_startAngle + _angularSize)();
                });


            innerArea.append("text")
                .attr("dy", function (d) {
                    return -5
                })
                .style("fill", '#F6AD40')
                .style("font-size", "16px")
                .style("text-anchor", "middle")
                .text('DA: ' + this.options.outerArcs[0].percentage + '%')
                .attr("transform", "translate(" + center.x + "," + center.y + ")")
            ;
            innerArea.append("text")
                .attr("dy", function (d) {
                    return 15
                })
                .style("fill", "rgba(246, 249, 228, 0.3)")
                .style("font-size", "16px")
                .style("text-anchor", "middle")
                .text('NU: ' + this.options.outerArcs[1].percentage + '%')
                .attr("transform", "translate(" + center.x + "," + center.y + ")")
            ;


            var t0 = Date.now();


            if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))) {

                var step = function () {
                    innerArea.attr("transform", function () {
                        return "rotate(" + delta * self.options.innerArea.areaSpeed + "," + center.x + "," + center.y + ")";
                    });


                    var delta = (Date.now() - t0);
                    outerArcs.attr("transform", function (d) {
                        return "translate(" + center.x + "," + center.y + ") rotate(" + delta * d.speed + ")";
                    });

                    if (delta > 5000) return true;

                };

                var timer = d3.timer(step, 00);
            }

            return this;
        };

        return new TgpAbsInd(options);
    };

    global.tgpAbsInd = tgpAbsInd;


})(window);