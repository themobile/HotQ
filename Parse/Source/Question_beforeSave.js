Parse.Cloud.beforeSave("Question", function (request, response) {
    var q = request.object
        , startDate = q.get("startDate")
        , d
        ;

    if (!(startDate)) {
        q.set("startDate", parseDate(moment().format()));
    }

    q.set("startDate", parseDate(moment(startDate).format("YYYY-MM-DD") + "T00:00:00.000Z"));
    startDate = q.get("startDate");

    var qType = new Parse.Query("QuestionType")
        , typeTest = "inexistent"
        ;
    if (q.get("typeId")) {
        typeTest = q.get("typeId").id;
    }
    qType.equalTo("objectId", typeTest);
    qType.first().then(function (type) {
            if (type) {
                if (type.get("name") == "day") {
                    q.set("endDate", startDate)
                } else {
                    if (type.get("name") == "week") {
                        d = moment(startDate);
                        q.set("startDate", parseDate(d.subtract("days", iif(d.day() > 0, d.day() - 1, 6)).format("YYYY-MM-DD") + "T00:00:00.000Z"));
                        startDate = q.get("startDate");
                        q.set("endDate", parseDate(moment(startDate).add("days", 6).format("YYYY-MM-DD") + "T00:00:00.000Z"));
                    } else {
                        if (type.get("name") == "month") {
                            d = moment(startDate);
                            q.set("startDate", parseDate(d.date(1).format("YYYY-MM-DD") + "T00:00:00.000Z"));
                            startDate = q.get("startDate");
                            q.set("endDate", parseDate(moment(startDate).add("months", 1).subtract("days", 1).format("YYYY-MM-DD") + "T00:00:00.000Z"));
                        }
                    }
                }
            }
            else {
                return Parse.Promise.error("error.invalid-type");
            }
            return Parse.Promise.as();
        }
    ).then(function () {
            response.success();
        }, function (error) {
            response.error(error);
        });
});