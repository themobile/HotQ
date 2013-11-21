Parse.Cloud.job("SetQuestion", function (request, status) {
    var jobName = "SetQuestion"
        , jobParam = request.params
        , jobRunId
        , theDate = parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z")
        , dayId, weekId, monthId
        ;

    Parse.Cloud.useMasterKey();


    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;

            return _GetCurentQs(theDate, "day");
        }).then(function (retD) {
            if (retD) {
                dayId = parsePointer("Question", retD.id);
            }
            return _GetCurentQs(theDate, "week");
        }).then(function (retW) {
            if (retW) {
                weekId = parsePointer("Question", retW.id);
            }
            return _GetCurentQs(theDate, "month");
        }).then(function (retM) {
            if (retM) {
                monthId = parsePointer("Question", retM.id);
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
                return qT.save();
            } else {
                var QT = Parse.Object.extend("QuestionSelect");
                QT = new QT();
                QT.set("date", theDate);
                QT.set("questionOfDay", dayId);
                QT.set("questionOfWeek", weekId);
                QT.set("questionOfMonth", monthId);
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

var _GetCurentQs;
_GetCurentQs = function (date, type) {
    var promise = new Parse.Promise()
        ;
    var qType = new Parse.Query("QuestionType");
    qType.notEqualTo("isDeleted", true);
    qType.equalTo("name", type);

    var qQ1 = new Parse.Query("Question")
        , qQ2 = new Parse.Query("Question")
        , qQ
        ;
    qQ1.lessThanOrEqualTo("startDate", date);
    qQ1.greaterThanOrEqualTo("endDate", date);
    qQ2.lessThanOrEqualTo("endDate", date);
    qQ = Parse.Query.or(qQ1, qQ2);
    qQ.notEqualTo("isDeleted", true);
    qQ.matchesQuery("typeId", qType);
    qQ.descending("startDate");
    qQ.descending("updatedAt");
    qQ.first().then(function (q) {
        if (q) {
            promise.resolve(q)
        } else {
            promise.reject({
                date: date,
                type: type
            })
        }
    }, function (error) {
        promise.reject({
            error: error,
            date: date,
            type: type
        })
    });

    return promise;
};