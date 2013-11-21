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


var _VoteSaveFirst;
_VoteSaveFirst = function (log) {
    var promise = new Parse.Promise()
        ;
    var inst = log.get("installationId")
        , quest = log.get("questionId").id
        , answ = log.get("answer")
        , date = log.createdAt
        ;
    _VoteSave(inst, quest, answ, date).then(function (voteSaved) {
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

var _VoteSave;
_VoteSave = function (installationId, questionId, answer, voteDate) {
    var promise = new Parse.Promise()
        , questionObject
        , installationObject
        , duplicate = false
        ;
    voteDate = moment(voteDate).format("YYYY-MM-DD") + "T00:00:00.000Z";
    var qQ = new Parse.Query("Question");
    qQ.equalTo("objectId", questionId);
    qQ.first().then(function (question) {
        if (question) {
            // verific sa fie valabila
            if (moment(voteDate).diff(moment(question.get("startDate")), 'milliseconds') >= 0 &&
                moment(voteDate).diff(moment(question.get("endDate")), 'milliseconds') <= 0 && !question.get("isDeleted")
                ) {
                questionObject = question;
                var qInstallation = new Parse.Query("_Installation");
                qInstallation.equalTo("installationId", installationId);
                qInstallation.notEqualTo("isDeleted", true);
                return qInstallation.first();
            } else {
                return Parse.Promise.error("error.question-not-available");
            }
        } else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (installation) {
            if (installation) {
                installationObject = installation;
                var qVote = new Parse.Query("Vote");
                qVote.equalTo("questionId", questionObject);
                qVote.equalTo("installationId", installation);
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
                Vote.set("installationId", installationObject);
                Vote.set("answer", answer);
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

