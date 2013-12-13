Parse.Cloud.define("QuestionAdmin", function (request, response) {
    var thisUser = request.user
        , param = request.params
        , categoryObject
        , typeObject
        , startDate
        , endDate
        ;
    if (thisUser) {
        if (param.text1 && param.text2 && param.category && param.type && param.startDate) {
            _ValidateCategory(param.category).then(function (categoryId) {
                categoryObject = categoryId;
                return _ValidateType(param.type);
            }).then(function (typeId) {
                    typeObject = typeId;
                    return _ValidateDate(typeId.get("name"), param.startDate);
                }).then(function (objDates) {
                    startDate = objDates.startDate;
                    endDate = objDates.endDate;
                    if (!(param.id)) {
                        param.id = "new";
                    }
                    var qQuestion = new Parse.Query("Question");
                    qQuestion.equalTo("objectId", param.id);
                    qQuestion.notEqualTo("isDeleted", true);
                    return qQuestion.first();
                }).then(function (question) {
                    if (!question) {
                        var Question = Parse.Object.extend("Question");
                        question = new Question();
                    }
                    question.set("categoryId", _parsePointer("QuestionCategory", categoryObject.id));
                    question.set("typeId", _parsePointer("QuestionType", typeObject.id));
                    question.set("subject", param.text1);
                    question.set("body", param.text2);
                    question.set("startDate", _parseDate(startDate));
                    question.set("endDate", _parseDate(endDate));
                    question.setACL(_getUserACL(thisUser));
                    return question.save();
                }).then(function (questionSaved) {
                    response.success(questionSaved.id);
                }, function (error) {
                    response.error(error);
                })
        } else {
            response.error("question.insufficient-data");
        }
    } else {
        response.error("error.user-not-found");
    }
});

_ValidateDate = function (typeText, startDate) {
    var promise = new Parse.Promise()
        , prm = Parse.Promise.as()
        ;

    var dNewStart
        , dNewEnd
        , dD
        ;
    prm = prm.then(function () {
        startDate = moment(startDate).format("YYYY-MM-DD") + "T00:00:00.000Z";
        switch (typeText) {
            case "day":
                dNewStart = startDate;
                dNewEnd = startDate;
                break;
            case  "week":
                dD = moment(startDate);
                dNewStart = dD.subtract("days", iif(dD.day() > 0, dD.day() - 1, 6)).format("YYYY-MM-DD") + "T00:00:00.000Z";
                dNewEnd = moment(dNewStart).add("days", 6).format("YYYY-MM-DD") + "T00:00:00.000Z";
                break;
            case "month":
                dD = moment(startDate);
                dNewStart = dD.date(1).format("YYYY-MM-DD") + "T00:00:00.000Z";
                dNewEnd = moment(dNewStart).add("months", 1).subtract("days", 1).format("YYYY-MM-DD") + "T00:00:00.000Z";
                break;
            default:
                return Parse.Promise.error("error.invalid-type");
        }
        return {startDate: dNewStart, endDate: dNewEnd};
    }).then(function (result) {
            promise.resolve(result);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};

_ValidateType = function (type) {
    var promise = new Parse.Promise()
        ;
    var qType = new Parse.Query("QuestionType");
    qType.equalTo("name", type);
    qType.notEqualTo("isDeleted", true);
    qType.first().then(function (type) {
        if (type) {
            promise.resolve(type);
        } else {
            promise.reject("error.invalid-type");
        }
    }, function (error) {
        promise.reject(error);
    });
    return promise;
};

_ValidateCategory = function (category) {
    var promise = new Parse.Promise()
        ;
    var qCategory = new Parse.Query("QuestionCategory");
    qCategory.equalTo("name", category);
    qCategory.notEqualTo("isDeleted", true);
    qCategory.first().then(function (category) {
        if (category) {
            promise.resolve(category);
        } else {
            promise.reject("error.invalid-category");
        }
    }, function (error) {
        promise.reject(error);
    });
    return promise;
};

