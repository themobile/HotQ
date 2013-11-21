Parse.Cloud.define("VoteSubmit", function (request, response) {
    var installationId = request.params.installationId
        , questionId = request.params.questionId
        , answer = request.params.answer
        ;
    var VoteLog = Parse.Object.extend("VoteLog");
    VoteLog = new VoteLog();
    VoteLog.set("questionId", parsePointer("Question", questionId));
    VoteLog.set("installationId", installationId);
    VoteLog.set("answer", answer);
    VoteLog.save().then(function (voteLog) {
        response.success(voteLog);
    }, function (error) {
        response.error(JSON.stringify(error));
    });
});
