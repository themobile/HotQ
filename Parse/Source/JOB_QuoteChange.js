Parse.Cloud.job("QuoteChange", function (request, status) {
    var jobName = "QuoteChange"
        , jobParam = request.params
        , jobRunId
        , quoteId
        ;

    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;
            return _GetRandomQuote();
        }).then(function (objQuote) {
            if (objQuote) {
                quoteId = _parsePointer("Quote", objQuote.id);

                var qS = new Parse.Query("QuestionSelect");
                qS.notEqualTo("isDeleted", true);
                qS.descending("date");
                return qS.first();
            } else {
                return Parse.Promise.as();
            }
        }).then(function (activeQuestion) {
            if (activeQuestion) {
                activeQuestion.set("quoteId", quoteId);
                return activeQuestion.save();
            }
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