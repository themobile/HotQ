Parse.Cloud.job("SetQuestion", function (request, status) {
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
            return _AddDate(theDate);
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


_AddDate = function (date) {
    var promise = new Parse.Promise()
        , dayId, weekId, monthId, quoteId
        ;
    _GetCurrentQs(date, "day").then(function (retD) {
        if (retD) {
            dayId = _parsePointer("Question", retD.id);
        }
        return _GetCurrentQs(date, "week");
    }).then(function (retW) {
            if (retW) {
                weekId = _parsePointer("Question", retW.id);
            }
            return _GetCurrentQs(date, "month");
        }).then(function (retM) {
            if (retM) {
                monthId = _parsePointer("Question", retM.id);
            }
            return _GetRandomQuote();
        }).then(function (retQuote) {
            if (retQuote) {
                quoteId = _parsePointer("Quote", retQuote.id);
            }
            var qS = new Parse.Query("QuestionSelect");
            qS.equalTo("date", date);
            qS.notEqualTo("isDeleted", true);
            return qS.first();
        }).then(function (activeQuestion) {
            if (!(activeQuestion)) {
                var QT = Parse.Object.extend("QuestionSelect");
                activeQuestion = new QT();
                activeQuestion.set("date", date);
                activeQuestion.setACL(_getAdminACL());
            }
            activeQuestion.increment("updates");
            activeQuestion.set("questionOfDay", dayId);
            activeQuestion.set("questionOfWeek", weekId);
            activeQuestion.set("questionOfMonth", monthId);
            activeQuestion.set("quoteId", quoteId);
            return activeQuestion.save();
        }
    ).then(function (questionSelectUpdated) {
            promise.resolve(questionSelectUpdated);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};


_GetCurrentQs = function (date, type) {
    var promise = new Parse.Promise()
        ;
    var qType = new Parse.Query("QuestionType");
    qType.notEqualTo("isDeleted", true);
    qType.equalTo("name", type);
    var qQuestion = new Parse.Query("Question");
    qQuestion.lessThanOrEqualTo("startDate", date);
    qQuestion.greaterThanOrEqualTo("endDate", date);
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.matchesQuery("typeId", qType);
    qQuestion.descending("startDate");
    qQuestion.descending("updatedAt");
    qQuestion.first().then(function (question) {
        if (question) {
            return question;
        } else {
            return _DuplicateLastQuestion(date, type);
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

_DuplicateLastQuestion = function (date, type) {
    var promise = new Parse.Promise()
        ;
    var question
        ;
    var qType = new Parse.Query("QuestionType");
    qType.notEqualTo("isDeleted", true);
    qType.equalTo("name", type);
    var qQuestion = new Parse.Query("Question");
    qQuestion.lessThanOrEqualTo("endDate", date);
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.matchesQuery("typeId", qType);
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

_GetRandomQuote = function () {
    var promise = new Parse.Promise()
        ;
    var min = 1
        , max
        , number
        ;
    var qSeq = new Parse.Query("Sequence");
    qSeq.equalTo("tableName", "Quote");
    qSeq.first().then(function (seq) {
        if (seq) {
            max = seq.get("identity");
        } else {
            max = min;
        }
        number = Math.floor(Math.random() * (max - min + 1) + min);
        var qQuote = new Parse.Query("Quote");
        qQuote.equalTo("sequence", number);
        return qQuote.first();
    }).then(function (quote) {
            if (quote) {
                return quote;
            } else {
                return Parse.Promise.error("error.quote-not-found");
            }
        }).then(function (quote) {
            promise.resolve(quote);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};


