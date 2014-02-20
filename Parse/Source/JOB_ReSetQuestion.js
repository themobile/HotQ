Parse.Cloud.job("ReSetQuestion", function (request, status) {
    var jobName = "ReSetQuestion"
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

            var qS = new Parse.Query("QuestionSelect");
            qS.equalTo("date", theDate);
            qS.notEqualTo("isDeleted", true);
            return qS.first();

        }).then(function (qsFounded) {
            if (qsFounded) {
//                qsExisted = true;
                return Parse.Promise.as();
            } else {
                jobResultText = "NOT Existed";
                return _AddDate(theDate);
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
