Parse.Cloud.define("VoteSubmit", function (request, response) {
    var installationId = request.params.installationId
        , questionId = request.params.questionId
        , answer = request.params.answer
        , position = request.params.position
        , demographics = request.params.demographics
        , tags = request.params.tags
        , version = request.params.version
        , timeZone = request.params.timeZone
        , type
        ;
    Parse.Cloud.useMasterKey();
    var qQuestion = new Parse.Query("Question");
    qQuestion.equalTo("objectId", questionId);
    qQuestion.include("typeId");
    qQuestion.first().then(function (question) {
        if (question) {
            type = question.get("typeId").get("name");
            var VoteLog = Parse.Object.extend("VoteLog");
            VoteLog = new VoteLog();
            VoteLog.set("questionId", _parsePointer("Question", questionId));
            VoteLog.set("installationId", installationId);
            VoteLog.set("answer", answer);
            VoteLog.set("position", position);
            VoteLog.set("demographics", demographics);
            VoteLog.set("tags", tags);
            VoteLog.set("version", version);
            VoteLog.set("timeZone", timeZone);
            VoteLog.setACL(_getAdminACL());
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
