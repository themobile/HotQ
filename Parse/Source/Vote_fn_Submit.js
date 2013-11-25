Parse.Cloud.define("VoteSubmit", function (request, response) {
    var installationId = request.params.installationId
        , questionId = request.params.questionId
        , answer = request.params.answer
        , position = request.params.position
        ;
    var VoteLog = Parse.Object.extend("VoteLog");
    VoteLog = new VoteLog();
    VoteLog.set("questionId", parsePointer("Question", questionId));
    VoteLog.set("installationId", installationId);
    VoteLog.set("answer", answer);
    VoteLog.set("position", position);
    VoteLog.save().then(function (voteLog) {
        response.success({success: true});
    }, function (error) {
        response.error(JSON.stringify(error));
    });
});
