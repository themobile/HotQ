Parse.Cloud.job("SetQuestion", function (request, status) {
    var jobName = "SetQuestion"
        , jobParam = request.params
        , jobRunId
        , theDate = _parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z")
        , dayId, weekId, monthId, quoteId
        ;

    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;

            return _GetCurrentQs(theDate, "day");
        }).then(function (retD) {
            if (retD) {
                dayId = _parsePointer("Question", retD.id);
            }
            return _GetCurrentQs(theDate, "week");
        }).then(function (retW) {
            if (retW) {
                weekId = _parsePointer("Question", retW.id);
            }
            return _GetCurrentQs(theDate, "month");
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
            qS.equalTo("date", theDate);
            qS.notEqualTo("isDeleted", true);
            return qS.first();
        }).then(function (activeQuestion) {
            if (!(activeQuestion)) {
                var QT = Parse.Object.extend("QuestionSelect");
                activeQuestion = new QT();
                activeQuestion.set("date", theDate);
                activeQuestion.setACL(_getAdminACL());
            }
            activeQuestion.increment("updates");
            activeQuestion.set("questionOfDay", dayId);
            activeQuestion.set("questionOfWeek", weekId);
            activeQuestion.set("questionOfMonth", monthId);
            activeQuestion.set("quoteId", quoteId);
            return activeQuestion.save();
        }).then(function (qTSaved) {
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
    var qType = new Parse.Query("QuestionType");
    qType.notEqualTo("isDeleted", true);
    qType.equalTo("name", type);
    var qQuestion = new Parse.Query("Question");
    qQuestion.lessThanOrEqualTo("endDate", date);
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.matchesQuery("typeId", qType);
    qQuestion.descending("startDate");
    qQuestion.descending("updatedAt");
    qQuestion.first().then(function (question) {
        if (question) {
            var Question = Parse.Object.extend("Question");
            Question = new Question();
            Question.set("categoryId", question.get("categoryId"));
            Question.set("typeId", question.get("typeId"));
            Question.set("subject", question.get("subject"));
            Question.set("body", question.get("body"));
            Question.set("questionId", _parsePointer("Question", question.id));
            Question.set("startDate", _parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z"));
            Question.setACL(question.getACL());
            return Question.save();
        } else {
            return Parse.Promise.error("error.question-not-found");
        }
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


