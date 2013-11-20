Parse.Cloud.define("GetQuestions", function (request, response) {
    var theDate = parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z")
        , installationId = request.params.installationId
        , result = {}
        ;
    Parse.Cloud.useMasterKey();

    if (request.params.date) {
        theDate = parseDate(moment(request.params.date).format("YYYY-MM-DD") + "T00:00:00.000Z");
    }


    var qQ = new Parse.Query("QuestionSelect");
    qQ.equalTo("date", theDate);
    qQ.notEqualTo("isDeleted", true);
    qQ.include("questionOfDay.categoryId,questionOfWeek.categoryId,questionOfMonth.categoryId");
    qQ.first().then(function (qT) {

        result.date = theDate;

        if (qT) {

            result.questionOfDay = {};
            result.questionOfDay.id = qT.get("questionOfDay").id;
            result.questionOfDay.category = qT.get("questionOfDay").get("categoryId").get("name");
            result.questionOfDay.text1 = qT.get("questionOfDay").get("subject");
            result.questionOfDay.text2 = qT.get("questionOfDay").get("body");

            result.questionOfWeek = {};
            result.questionOfWeek.id = qT.get("questionOfWeek").id;
            result.questionOfWeek.category = qT.get("questionOfWeek").get("categoryId").get("name");
            result.questionOfWeek.text1 = qT.get("questionOfWeek").get("subject");
            result.questionOfWeek.text2 = qT.get("questionOfWeek").get("body");

            result.questionOfMonth = {};
            result.questionOfMonth.id = qT.get("questionOfMonth").id;
            result.questionOfMonth.category = qT.get("questionOfMonth").get("categoryId").get("name");
            result.questionOfMonth.text1 = qT.get("questionOfMonth").get("subject");
            result.questionOfMonth.text2 = qT.get("questionOfMonth").get("body");

        }
        return Parse.Promise.as();
    }).then(function () {
            return _GetVote(installationId, result.questionOfDay.id);
        }).then(function (rez) {
            console.log(rez);
            if (rez) {
                result.questionOfDay.hasVote = !!rez.date;
                result.questionOfDay.dateVode = rez.date;
            } else {
                result.questionOfDay.hasVote = false;
            }
            return _GetVote(installationId, result.questionOfWeek.id);
        }).then(function (rez) {
            if (rez) {
                result.questionOfWeek.hasVote = !!rez.date;
                result.questionOfWeek.dateVode = rez.date;
            } else {
                result.questionOfWeek.hasVote = false;
            }
            return _GetVote(installationId, result.questionOfMonth.id);
        }).then(function (rez) {
            if (rez) {
                result.questionOfMonth.hasVote = !!rez.date;
                result.questionOfMonth.dateVode = rez.date;
            } else {
                result.questionOfMonth.hasVote = false;
            }
            response.success(result);
        }, function (error) {
            response.error(error);
        });
});

var _GetVote;
_GetVote = function (device, question) {
    var promise = new Parse.Promise()
        ;
    var qVote = new Parse.Query("Vote");
    qVote.equalTo("questionId", parsePointer("Question", question));
    qVote.equalTo("installationId", device);
    qVote.first().then(function (vote) {
        if (vote) {
            promise.resolve({date: vote.get("updatedAt")});
        } else {
            promise.resolve({date: ""});
        }
    }, function (error) {
        promise.reject(error);
    });
    return promise;
};
