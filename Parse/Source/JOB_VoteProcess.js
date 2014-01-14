Parse.Cloud.job("VoteProcess", function (request, status) {
    var jobName = "VoteProcess"
        , jobParam = request.params
        , jobRunId
        ;
    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;

            var qVoteLog = new Parse.Query("VoteLog");
            qVoteLog.notEqualTo("isDeleted", true);
            qVoteLog.doesNotExist("status");
            qVoteLog.ascending("createdAt");
            qVoteLog.limit(1000);
            return qVoteLog.find();

        }).then(function (votes) {
            var promise = Parse.Promise.as();
            _.each(votes, function (vote) {
                promise = promise.then(function () {
                    return _VoteSaveFirst(vote);
                });
            });
            return promise;
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

_VoteSaveFirst = function (log) {
    var promise = new Parse.Promise()
        ;
    var installationId = log.get("installationId")
        , questionId = log.get("questionId").id
        , answer = log.get("answer")
        , date = log.createdAt
        ;
    _VoteSave(installationId, questionId, answer, date).then(function (voteSaved) {
        log.set("status", "ok");
        log.set("isSuccess", true);
        log.set("voteId", voteSaved);
        log.save().then(function () {
            promise.resolve();
        });
    }, function (respKo) {
        log.set("status", JSON.stringify(respKo));
        log.set("isSuccess", false);
        log.save().then(function () {
            promise.resolve();
        });
    });
    return promise;
};

_VoteSave = function (installationId, questionId, answer, voteDate) {
    var promise = new Parse.Promise()
        , questionObject
        , deviceObject
        , duplicate = false
        , voteDateTest
        ;

    voteDateTest = moment(voteDate).format("YYYY-MM-DD") + "T00:00:00.000Z";

    var qQ = new Parse.Query("Question");
    qQ.equalTo("objectId", questionId);
    qQ.first().then(function (question) {
        if (question) {
            // verific sa fie valabila
            if (moment(voteDateTest).diff(moment(question.get("startDate")), 'milliseconds') >= 0 &&
                moment(voteDateTest).diff(moment(question.get("endDate")), 'milliseconds') <= 0 && !question.get("isDeleted")
                ) {
                questionObject = question;
                var qDevice = new Parse.Query("Device");
                qDevice.equalTo("installationId", installationId);
                qDevice.notEqualTo("isDeleted", true);
                return qDevice.first();
            } else {
                return Parse.Promise.error("error.question-not-available");
            }
        } else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (device) {
            if (device) {
                deviceObject = device;
                var qVote = new Parse.Query("Vote");
                qVote.equalTo("questionId", questionObject);
                qVote.equalTo("installationId", deviceObject);
                qVote.notEqualTo("isDeleted", true);
                return qVote.first();
            } else {
                return Parse.Promise.error("error.device-not-found");
            }
        }).then(function (vote) {
            if (vote) {
                vote.increment("counter");
                duplicate = true;
                return vote.save();
            } else {
                var Vote = Parse.Object.extend("Vote");
                Vote = new Vote();
                Vote.set("questionId", questionObject);
                Vote.set("deviceId", deviceObject);
                Vote.set("voteDate", voteDate);
                Vote.set("answer", answer);
                Vote.setACL(_getAdminACL());
                return Vote.save();
            }
        }).then(function (voteSaved) {
            if (duplicate) {
                return Parse.Promise.error("error.vote-already-exists");
            } else {
                return voteSaved;
            }
        }).then(function (voteSaved) {
            promise.resolve(voteSaved);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};

