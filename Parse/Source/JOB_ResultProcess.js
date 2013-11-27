Parse.Cloud.job("ResultProcess", function (request, status) {
    var jobName = "ResultProcess"
        , jobParam = request.params
        , jobRunId
        ;
    var cntSuccess = 0
        , cntError = 0
        ;

    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;

            var qVote = new Parse.Query("Vote");
            qVote.notEqualTo("isDeleted", true);
            qVote.notEqualTo("done", true);
            qVote.ascending("createdAt");
            qVote.limit(1000);
            qVote.include("questionId");
            return qVote.find();
        }).then(function (votes) {
            var promise = Parse.Promise.as();
            _.each(votes, function (vote) {
                promise = promise.then(function () {
                    return _ResultProcess(vote);
                }).then(function () {
                        cntSuccess++;
                    }, function (error) {
                        cntError++;
                        return AddJobRunHistory({
                            name: jobName,
                            jobId: parsePointer("AppJob", jobRunId.jobId),
                            jobIdText: jobRunId.jobId,
                            runCounter: jobRunId.jobRunCounter,
                            parameters: jobParam,
                            status: "error",
                            statusObject: error
                        });
                    });
            });
            return promise;
        }).then(function () {
            return AddJobRunHistory({
                name: jobName,
                jobId: parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "success",
                statusObject: {cntSuccess: cntSuccess, cntError: cntError}
            });
        }).then(function () {
            status.success(JSON.stringify({cntSuccess: cntSuccess, cntError: cntError}));
        }, function (error) {
            status.error(JSON.stringify(error));
        });
});


var _ResultProcess;
_ResultProcess = function (vote) {
    var promise = new Parse.Promise();
    var cntYes = 0
        , cntNo = 0
        , cntAll = 0
        , cntAdd = 0
        , answer = vote.get("answer") || {}
        , question
        , beforeAnswer
        , results = {}
        ;

    if (answer) {
        if (answer.answer == 1) {
            cntYes++;
        } else {
            cntNo++;
        }
    }

    var qQuestion = new Parse.Query("Question");
    qQuestion.equalTo("objectId", vote.get("questionId").id);
    qQuestion.first().then(function (question) {
        if (question) {
            beforeAnswer = question.get("results") || {};
            if (beforeAnswer.cntYes) {
                cntYes += beforeAnswer.cntYes;
            }
            if (beforeAnswer.cntNo) {
                cntNo += beforeAnswer.cntNo;
            }
            cntAll = cntYes + cntNo;
            results.cntYes = cntYes;
            results.cntNo = cntNo;
            if (cntAll < 10) {
                cntYes *= 100;
                cntNo *= 100;
            } else {
                if (cntAll < 100) {
                    cntYes *= 10;
                    cntNo *= 10;
                }
            }
            cntAll = cntYes + cntNo;
            if (cntAll < 1000) {
                cntAdd = Math.ceil((1000 - cntAll) / 2);
                cntYes += cntAdd;
                cntNo += cntAdd;
                cntAll = cntYes + cntNo;
            }

            results.percentYes = Math.round((cntYes * 100 / cntAll) * 10) / 10;
            results.percentNo = 100 - results.percentYes;

            question.set("results", results);
            return question.save();
        } else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (questionSaved) {
            vote.set("done", true);
            return vote.save();
        }).then(function (voteSaved) {
            promise.resolve({});
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};
