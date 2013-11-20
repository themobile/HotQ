'use strict';

angular.module('hotQ', ['googlechart']).controller("hotQCtl", function ($scope) {

    var chart1 = {};
    chart1.type = "PieChart";
    chart1.displayed = false;
    chart1.cssStyle = "min-height:300px; width:100%;";
    chart1.data = {"cols": [
        {id: "raspuns", label: "Răspuns", type: "string"},
        {id: "procent", label: "Procent", type: "number"}

    ], "rows": [
        {c: [
            {v: "DA"},
            {v: 30}

        ]},
        {c: [
            {v: "NU"},
            {v: 13}

        ]}
    ]};



    chart1.options = {
        "title": "Sales per month",
        "colors":['white','#FE6700'],
//        "isStacked": "true",
        "backgroundColor": '#2F3238',
        "fill": 20,
        "displayExactValues": true,
        "backgroundColor.strokeWidth":10

    };


    var formatCollection = [
        {

        }
    ]

    chart1.formatters = {};

    $scope.chart = chart1;




    $scope.formatCollection = formatCollection;

    $scope.chartReady = function() {
        fixGoogleChartsBarsBootstrap();
    }

    function fixGoogleChartsBarsBootstrap() {
        // Google charts uses <img height="12px">, which is incompatible with Twitter
        // * bootstrap in responsive mode, which inserts a css rule for: img { height: auto; }.
        // *
        // * The fix is to use inline style width attributes, ie <img style="height: 12px;">.
        // * BUT we can't change the way Google Charts renders its bars. Nor can we change
        // * the Twitter bootstrap CSS and remain future proof.
        // *
        // * Instead, this function can be called after a Google charts render to "fix" the
        // * issue by setting the style attributes dynamically.

        $(".google-visualization-table-table img[width]").each(function(index, img) {
            $(img).css("width", $(img).attr("width")).css("height", $(img).attr("height"));
        });
    };

});



