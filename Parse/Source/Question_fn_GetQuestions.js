Parse.Cloud.define("GetQuestions", function (request, response) {
    var theDate = parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z")
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
        var ret = {}
            ;

        ret.date = theDate;

        if (qT) {

            ret.questionOfDay = {};
            ret.questionOfDay.id = qT.get("questionOfDay").id;
            ret.questionOfDay.category = qT.get("questionOfDay").get("categoryId").get("name");
            ret.questionOfDay.text1 = qT.get("questionOfDay").get("subject");
            ret.questionOfDay.text2 = qT.get("questionOfDay").get("body");

            ret.questionOfWeek = {};
            ret.questionOfWeek.id = qT.get("questionOfWeek").id;
            ret.questionOfWeek.category = qT.get("questionOfWeek").get("categoryId").get("name");
            ret.questionOfWeek.text1 = qT.get("questionOfWeek").get("subject");
            ret.questionOfWeek.text2 = qT.get("questionOfWeek").get("body");

            ret.questionOfMonth = {};
            ret.questionOfMonth.id = qT.get("questionOfMonth").id;
            ret.questionOfMonth.category = qT.get("questionOfMonth").get("categoryId").get("name");
            ret.questionOfMonth.text1 = qT.get("questionOfMonth").get("subject");
            ret.questionOfMonth.text2 = qT.get("questionOfMonth").get("body");

        } else {
            console.log("no data");

        }
        return ret;
    }).then(function (result) {
            response.success(result);
        }, function (error) {
            response.error(error);
        });
});