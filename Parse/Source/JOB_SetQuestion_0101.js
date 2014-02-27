Parse.Cloud.job("SetQuestion_0101", function (request, status) {
    var jobName = "ReSetQuestion_0101"
        , jobParam = request.params
        , jobRunId
        , theDate = _parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z")
//        , qsExisted = false
        , jobResultText = "Existed"
        ;

    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;

            var qS = new Parse.Query("QuestionOnLine");
            qS.equalTo("date", theDate);
            qS.notEqualTo("isDeleted", true);
            return qS.first();

        }).then(function (qsFounded) {
            if (qsFounded) {
//                qsExisted = true;
                return Parse.Promise.as();
            } else {
                jobResultText = "NOT Existed";
                return _AddDateCateg(theDate);
            }
        }).then(function () {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "success",
                statusObject: {result: jobResultText}
            }).then(function () {
                    status.success("ok");
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        }, function (error) {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "error",
                statusObject: error
            }).then(function () {
                    status.error(JSON.stringify(error));
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        });
});

/*
Parse.Cloud.job("SetQuestion_0101", function (request, status) {
    var jobName = "SetQuestion"
        , jobParam = request.params
        , jobRunId
        , theDate = _parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z")
        ;

    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;
            return _AddDateCateg(theDate);
        }).then(function () {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "success",
                statusObject: {result: "ok"}
            }).then(function () {
                    status.success("ok");
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        }, function (error) {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "error",
                statusObject: error
            }).then(function () {
                    status.error(JSON.stringify(error));
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        });
});
*/

_AddDateCateg = function (date) {
    var promise = new Parse.Promise()
        , prm = Parse.Promise.as()
        , qs = []
        , quoteId
        ;
    _.each(HotQCategory, function (category) {
        prm = prm.then(function () {
            return _GetCurrentQCat(date, category.nameLocale, "type.q-day")
        }).then(function (question) {
                qs.push(question);
            });
    });
    prm = prm.then(function () {
        return _GetRandomQuote();
    }).then(function (retQuote) {
            if (retQuote) {
                quoteId = _parsePointer("Quote", retQuote.id);
            }
            var qS = new Parse.Query("QuestionOnLine");
            qS.equalTo("date", date);
            qS.notEqualTo("isDeleted", true);
            return qS.first();
        }).then(function (activeQuestion) {
            if (!(activeQuestion)) {
                var QT = Parse.Object.extend("QuestionOnLine");
                activeQuestion = new QT();
                activeQuestion.set("date", date);
                activeQuestion.setACL(_getAdminACL());
            }
            activeQuestion.increment("updates");
            for (var i = 0; i < 10; i++) {
                var column = "questionC" + (i + 1).toString() + "Id";
                if (qs[i]) {
                    activeQuestion.set(column, qs[i]);
                }
            }
            activeQuestion.set("quoteId", quoteId);
            return activeQuestion.save();
        }).then(function (questionSelectUpdated) {
            promise.resolve(questionSelectUpdated);
        }, function (error) {
            promise.reject(error);
        });
    return promise;

};


_GetCurrentQCat = function (date, category, type) {
    var promise = new Parse.Promise()
        ;
    var qCat = new Parse.Query("QuestionCategory");
    qCat.notEqualTo("isDeleted", true);
    qCat.equalTo("nameLocale", category);
    var qType = new Parse.Query("QuestionType");
    qType.notEqualTo("isDeleted", true);
    qType.equalTo("nameLocale", type);
    var qQuestion = new Parse.Query("Question");
    qQuestion.lessThanOrEqualTo("startDate", date);
    qQuestion.greaterThanOrEqualTo("endDate", date);
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.matchesQuery("typeId", qType);
    qQuestion.matchesQuery("categoryId", qCat);
    qQuestion.descending("startDate");
    qQuestion.descending("updatedAt");
    qQuestion.first().then(function (question) {
        if (question) {
            return question;
        } else {
            return _DuplLastQuestion(date, category, type);
        }
    }).then(function (question) {
            if (question) {
                promise.resolve(question);
            } else {
                promise.reject({
                    date: date,
                    type: type
                });
            }
        },
        function (error) {
            promise.reject({
                error: error,
                date: date,
                type: type
            })
        }
    );
    return promise;
};

_DuplLastQuestion = function (date, category, type) {
    var promise = new Parse.Promise()
        ;
    var question
        ;
    var qType = new Parse.Query("QuestionType");
    qType.notEqualTo("isDeleted", true);
    qType.equalTo("nameLocale", type);
    var qCat = new Parse.Query("QuestionCategory");
    qCat.notEqualTo("isDeleted", true);
    qCat.equalTo("nameLocale", category);
    var qQuestion = new Parse.Query("Question");
    qQuestion.lessThanOrEqualTo("endDate", date);
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.matchesQuery("typeId", qType);
    qQuestion.matchesQuery("categoryId", qCat);
    qQuestion.descending("startDate");
    qQuestion.descending("updatedAt");
    qQuestion.include("typeId");
    qQuestion.first().then(function (qFound) {
        if (qFound) {
            question = qFound;
            return _ValidateDate(question.get("typeId").get("name"), moment().format("YYYY-MM-DD"));
        } else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (objDates) {
            return _AdminQuestion(null, null, question.get("categoryId"), question.get("typeId"), question.get("subject"), question.get("body"), question.get("link"), objDates.startDate, objDates.endDate);
        }).then(function (questionSaved) {
            questionSaved.set("questionId", question);
            return questionSaved.save();
        }).then(function (newQuestion) {
            promise.resolve(newQuestion);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};
