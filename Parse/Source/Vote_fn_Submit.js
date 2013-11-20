Parse.Cloud.define("VoteSubmit", function (request, response) {
    var device = request.params.installationId
        , question = request.params.questionId
        , answer = request.params.answer
        ;
    var VoteLog = Parse.Object.extend("VoteLog");
    VoteLog = new VoteLog();
    VoteLog.set("questionId", parsePointer("Question", question));
    VoteLog.set("installationId", device);
    VoteLog.set("answer", answer);
    VoteLog.save().then(function () {
        return _VoteSave(device, question, answer);
    }).then(function () {
            response.success();
        }, function (error) {
            response.error(error);
        });
});

var _VoteSave;
_VoteSave = function (device, question, answer) {
    var promise = new Parse.Promise()
        ;
    var qQ = new Parse.Query("Question");
    qQ.equalTo("objectId", question);
    qQ.first().then(function (questionFounded) {
        if (questionFounded) {
            var qVote = new Parse.Query("Vote");
            qVote.equalTo("questionId", questionFounded);
            qVote.equalTo("installationId", device);
            qVote.notEqualTo("isDeleted", true);
            return qVote.first();
        } else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (vote) {
            if (vote) {
                return Parse.Promise.as();
            } else {
                var Vote = Parse.Object.extend("Vote");
                Vote = new Vote();
                Vote.set("questionId", parsePointer("Question", question));
                Vote.set("installationId", device);
                Vote.set("answer", answer);
                return Vote.save();
            }
        }).then(function () {
            promise.resolve({ok: "ok"});
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};

