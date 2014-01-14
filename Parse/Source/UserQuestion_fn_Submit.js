Parse.Cloud.define("UserQuestionSubmit", function (request, response) {
    var questionContent = request.params.questionContent
        , tricks = request.params.tricks
        , UserQuestion = Parse.Object.extend("UserQuestion")
        ;
    Parse.Cloud.useMasterKey();
    UserQuestion = new UserQuestion();
    UserQuestion.set("questionContent", questionContent);
    UserQuestion.set("tricks", tricks);
    UserQuestion.setACL(_getAdminACL());
    UserQuestion.save().then(function (userQuestion) {
        response.success(userQuestion.id);
    }, function (error) {
        response.error(JSON.stringify(error));
    });
});

