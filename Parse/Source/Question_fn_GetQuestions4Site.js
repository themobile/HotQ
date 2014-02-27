/**
 *
 * * * * * * * * * * * * * * * *
 *                             *
 *    N E U T I L I Z A T A    *
 *                             *
 * * * * * * * * * * * * * * * *
 *
 * */
Parse.Cloud.define("GetQuestions4Site", function (request, response) {
    var theDate
        , result = {}
        ;
    Parse.Cloud.useMasterKey();
    if (request.params.date) {
        theDate = moment(request.params.date).format("YYYY-MM-DD") + "T00:00:00.000Z";
    } else {
        theDate = moment().format("YYYY-MM-DD") + "T00:00:00.000Z";
    }
    var qQ = new Parse.Query("QuestionSelect");
    qQ.equalTo("date", _parseDate(theDate));
    qQ.notEqualTo("isDeleted", true);
    qQ.include("questionOfDay.categoryId,questionOfWeek.categoryId,questionOfMonth.categoryId");
    qQ.descending("createdAt");
    qQ.first().then(function (qT) {
        result.date = moment(theDate).format("YYYY-MM-DD");
        if (qT) {
            result.questionOfDay = {id: "0", category: "unknown", text1: "", text2: "", link: "", picture: "", percentYes: 100, percentNo: 0};
            if (qT.get("questionOfDay")) {
                result.questionOfDay.id = qT.get("questionOfDay").id;
                result.questionOfDay.category = qT.get("questionOfDay").get("categoryId").get("name");
                result.questionOfDay.text1 = qT.get("questionOfDay").get("subject");
                result.questionOfDay.text2 = qT.get("questionOfDay").get("body");
                result.questionOfDay.link = qT.get("questionOfDay").get("link");
                result.questionOfDay.picture = qT.get("questionOfDay").get("imageFile");
                result.questionOfDay.percentYes = qT.get("questionOfDay").get("results") ? qT.get("questionOfDay").get("results").percentYes ? qT.get("questionOfDay").get("results").percentYes : 50 : 50;
                result.questionOfDay.percentNo = 100 - result.questionOfDay.percentYes;
            }

            result.questionOfWeek = {id: "0", category: "unknown", text1: "", text2: "", link: "", picture: "", percentYes: 100, percentNo: 0};
            if (qT.get("questionOfWeek")) {
                result.questionOfWeek.id = qT.get("questionOfWeek").id;
                result.questionOfWeek.category = qT.get("questionOfWeek").get("categoryId").get("name");
                result.questionOfWeek.text1 = qT.get("questionOfWeek").get("subject");
                result.questionOfWeek.text2 = qT.get("questionOfWeek").get("body");
                result.questionOfWeek.link = qT.get("questionOfWeek").get("link");
                result.questionOfWeek.picture = qT.get("questionOfWeek").get("imageFile");
                result.questionOfWeek.percentYes = qT.get("questionOfWeek").get("results") ? qT.get("questionOfWeek").get("results").percentYes ? qT.get("questionOfWeek").get("results").percentYes : 50 : 50;
                result.questionOfWeek.percentNo = 100 - result.questionOfWeek.percentYes;
            }

            result.questionOfMonth = {id: "0", category: "unknown", text1: "", text2: "", link: "", picture: "", percentYes: 100, percentNo: 0};
            if (qT.get("questionOfMonth")) {
                result.questionOfMonth.id = qT.get("questionOfMonth").id;
                result.questionOfMonth.category = qT.get("questionOfMonth").get("categoryId").get("name");
                result.questionOfMonth.text1 = qT.get("questionOfMonth").get("subject");
                result.questionOfMonth.text2 = qT.get("questionOfMonth").get("body");
                result.questionOfMonth.link = qT.get("questionOfMonth").get("link");
                result.questionOfMonth.picture = qT.get("questionOfMonth").get("imageFile");
                result.questionOfMonth.percentYes = qT.get("questionOfMonth").get("results") ? qT.get("questionOfMonth").get("results").percentYes ? qT.get("questionOfMonth").get("results").percentYes : 50 : 50;
                result.questionOfMonth.percentNo = 100 - result.questionOfMonth.percentYes;
            }
            return Parse.Promise.as();
        }
        else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (rez) {
            if (moment().diff(moment(theDate), 'days') > 31) {
                return Parse.Promise.error("error.history-not-found");
            } else {
                return Parse.Promise.as();
            }
        }).then(function (rez) {
            response.success(result);
        }, function (error) {
            response.error(error);
        });
})
;
