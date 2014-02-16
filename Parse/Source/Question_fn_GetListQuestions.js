Parse.Cloud.define("GetListQuestions", function (request, response) {
    Parse.Cloud.useMasterKey();
    var results = []
        , startDate
        , endDate
        ;
    endDate = moment().subtract('days', 1).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    startDate = moment(endDate).subtract('days', 31).format('YYYY-MM-DD') + 'T00:00:00.000Z';

    var qQuestion = new Parse.Query("Question");
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.greaterThanOrEqualTo('startDate', _parseDate(startDate));
    qQuestion.lessThanOrEqualTo('startDate', _parseDate(endDate));
    qQuestion.include("categoryId,typeId");
    qQuestion.descending("startDate");
    qQuestion.find().then(function (questions) {
        var indice = 0;
        _.each(questions, function (question) {
            var startDate = question.get("startDate")
                , endDate = question.get("endDate")
                ;
            var objToAdd = {
                index: ++indice,
                id: question.id,
                category: question.get("categoryId").get("name"),
                type: question.get("typeId").get("name"),
                typeLocale: question.get("typeId").get("nameLocale"),
                text1: question.get("subject"),
                text2: question.get("body"),
//                startDate: moment(question.get("startDate")).format("YYYY,M,D"),
//                endDate: moment(question.get("endDate")).format("YYYY,M,D"),
                resultPercentYes: question.get("results") ? question.get("results").percentYes ? question.get("results").percentYes : 50 : 50
            };
            objToAdd.resultPercentNo = 100 - objToAdd.resultPercentYes;
            objToAdd.period = "unknown";
            if (objToAdd.type == "day") {
                objToAdd.period = moment(startDate).format("D MMMM YYYY");
            } else {
                if (objToAdd.type == "week") {
                    objToAdd.period = moment(startDate).format("D") +
                        iif(moment(startDate).format("M") == moment(endDate).format("M"), "", moment(startDate).format(" MMMM")) +
                        iif(moment(startDate).format("YY") == moment(endDate).format("YY"), "", moment(startDate).format(" YYYY")) +
                        " - " + moment(endDate).format("D MMMM YYYY");
                } else {
                    objToAdd.period = moment(startDate).format("MMMM YYYY");
                }
            }
            results.push(objToAdd);
        });
        response.success(results);
    }, function (error) {
        response.error(error);
    });
});