Parse.Cloud.define("QuestionAdmin", function (request, response) {
    var thisUser = request.user
        , param = request.params
        , categoryObject
        , typeObject
        ;
    if (thisUser) {
        if (param.text1 && param.text2 && param.category && param.type && param.startDate) {
            _QuestionCategory(param.category).then(function (categoryId) {
                categoryObject = categoryId;
                return _QuestionType(param.type);
            }).then(function (typeId) {
                    typeObject = typeId;
                    if (!(param.id)) {
                        param.id = "new";
                    }
                    var qQuestion = new Parse.Query("Question");
                    qQuestion.equalTo("objectId", param.id);
                    qQuestion.notEqualTo("isDeleted", true);
                    return qQuestion.first();
                }).then(function (question) {
                    var theDate = moment(param.startDate).format("YYYY-MM-DD") + "T00:00:00.000Z";
                    if (question) {
                        question.set("categoryId", parsePointer("QuestionCategory", categoryObject.id));
                        question.set("typeId", parsePointer("QuestionType", typeObject.id));
                        question.set("subject", param.text1);
                        question.set("body", param.text2);
                        question.set("startDate", parseDate(theDate));
                        return question.save();
                    } else {
                        var Question = Parse.Object.extend("Question");
                        Question = new Question();
                        Question.set("categoryId", parsePointer("QuestionCategory", categoryObject.id));
                        Question.set("typeId", parsePointer("QuestionType", typeObject.id));
                        Question.set("subject", param.text1);
                        Question.set("body", param.text2);
                        Question.set("startDate", parseDate(theDate));
                        return Question.save();
                    }
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

var _QuestionType;
_QuestionType = function (type) {
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


var _QuestionCategory;
_QuestionCategory = function (category) {
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

