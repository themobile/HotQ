Parse.Cloud.job("SetQuestion", function (request, status) {
    var jobName = "SetQuestion"
        , jobParam = request.params
        , jobRunId
        , theDate = parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z")
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
                dayId = parsePointer("Question", retD.id);
            }
            return _GetCurrentQs(theDate, "week");
        }).then(function (retW) {
            if (retW) {
                weekId = parsePointer("Question", retW.id);
            }
            return _GetCurrentQs(theDate, "month");
        }).then(function (retM) {
            if (retM) {
                monthId = parsePointer("Question", retM.id);
            }
            return _GetRandomQuote();
        }).then(function (retQuote) {
            if (retQuote) {
                quoteId = parsePointer("Quote", retQuote.id);
            }
            var qS = new Parse.Query("QuestionSelect");
            qS.equalTo("date", theDate);
            qS.notEqualTo("isDeleted", true);
            return qS.first();
        }).then(function (qT) {
            if (qT) {
                qT.increment("updates");
                qT.set("questionOfDay", dayId);
                qT.set("questionOfWeek", weekId);
                qT.set("questionOfMonth", monthId);
                qT.set("quoteId", quoteId);
                return qT.save();
            } else {
                var QT = Parse.Object.extend("QuestionSelect");
                QT = new QT();
                QT.set("date", theDate);
                QT.set("questionOfDay", dayId);
                QT.set("questionOfWeek", weekId);
                QT.set("questionOfMonth", monthId);
                QT.set("quoteId", quoteId);
                return QT.save();
            }
        }).then(function (qTSaved) {
            return AddJobRunHistory({
                name: jobName,
                jobId: parsePointer("AppJob", jobRunId.jobId),
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
                jobId: parsePointer("AppJob", jobRunId.jobId),
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

var _GetCurrentQs;
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
    }).then(function (q) {
            if (q) {
                promise.resolve(q);
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

var _DuplicateLastQuestion;
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
            Question.set("questionId", parsePointer("Question", question.id));
            Question.set("startDate", parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z"));
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

