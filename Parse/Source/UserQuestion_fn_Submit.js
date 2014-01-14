Parse.Cloud.define("UserQuestionSubmit", function (request, response) {
    var title = request.params.title
        , subtitle = request.params.subtitle
        , tricks = request.params.tricks
        , UserQuestion = Parse.Object.extend("UserQuestion")


        , installationId = request.params.installationId
        , questionId = request.params.questionId
        , answer = request.params.answer
        , position = request.params.position
        , demographics = request.params.demographics
        , type
        ;
    Parse.Cloud.useMasterKey();
    UserQuestion = new UserQuestion();
    UserQuestion.set("title", title);
    UserQuestion.set("subtitle", subtitle);
    UserQuestion.set("tricks", tricks);
    UserQuestion.setACL(_getAdminACL());
    UserQuestion.save().then(function (userQuestion) {
        response.success(userQuestion.id);
    }, function (error) {
        response.error(JSON.stringify(error));
    });
});

