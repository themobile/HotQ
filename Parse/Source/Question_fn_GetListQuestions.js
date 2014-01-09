Parse.Cloud.define("GetListQuestions", function (request, response) {
    Parse.Cloud.useMasterKey();
    var results = []
        , startDate
        , endDate
        ;
    endDate = moment().format('YYYY-MM-DD')+'T00:00:00.000Z';
    startDate = moment(endDate).subtract('days',31).format('YYYY-MM-DD')+'T00:00:00.000Z';

    var qQuestion = new Parse.Query("Question");
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.greaterThanOrEqualTo('startDate',_parseDate(startDate));
    qQuestion.lessThanOrEqualTo('startDate',_parseDate(endDate));
    qQuestion.include("categoryId,typeId");
    qQuestion.descending("startDate");
    qQuestion.find().then(function (questions) {
        _.each(questions, function (question) {
            var objToAdd = {
                id: question.id,
                category: question.get("categoryId").get("name"),
                type: question.get("typeId").get("name"),
                typeLocale: question.get("typeId").get("nameLocale"),
                text1: question.get("subject"),
                text2: question.get("body"),
                startDate: moment(question.get("startDate")).format("YYYY,M,D"),
                endDate: moment(question.get("endDate")).format("YYYY,M,D"),
                resultPercentYes: question.get("results") ? question.get("results").percentYes ? question.get("results").percentYes : 50 : 50
            };
            objToAdd.resultPercentNo = 100 - objToAdd.resultPercentYes;
            results.push(objToAdd);
        });
        response.success(results);
    }, function (error) {
        response.error(error);
    });
});