Parse.Cloud.define("VoteSubmit", function (request, response) {
    var installationId = request.params.installationId
        , questionId = request.params.questionId
        , answer = request.params.answer
        , position = request.params.position
        , type
        ;
    var qQuestion = new Parse.Query("Question");
    qQuestion.equalTo("objectId", questionId);
    qQuestion.include("typeId");
    qQuestion.first().then(function (question) {
        if (question) {
            type = question.get("typeId").get("name");
            var VoteLog = Parse.Object.extend("VoteLog");
            VoteLog = new VoteLog();
            VoteLog.set("questionId", parsePointer("Question", questionId));
            VoteLog.set("installationId", installationId);
            VoteLog.set("answer", answer);
            VoteLog.set("position", position);
            return VoteLog.save()
        } else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (voteLog) {
            response.success({success: iif(type == "day", "questionOfDay", iif(type == "week", "questionOfWeek", "questionOfMonth"))});
        }, function (error) {
            response.error(JSON.stringify(error));
        });
});
