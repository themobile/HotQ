Parse.Cloud.define("GetListQuestions", function (request, response) {
    var pageRows = request.params.pageRows
        , pageNo = request.params.pageNo
        , results = []
        ;
    Parse.Cloud.useMasterKey();
    if (!(pageRows)) {
        pageRows = 100;
    }
    if (!(pageNo) || (pageNo < 1)) {
        pageNo = 1;
    }
    var qQuestion = new Parse.Query("Question");
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.include("categoryId,typeId");
    qQuestion.descending("startDate");
    qQuestion.skip((pageNo - 1) * pageRows);
    qQuestion.limit(pageRows);
    qQuestion.find().then(function (questions) {
        _.each(questions, function (question) {
            var objToAdd = {
                id: question.id,
                category: question.get("categoryId").get("name"),
                type: question.get("typeId").get("name"),
                typeLocale: question.get("typeId").get("nameLocale"),
                text1: question.get("subject"),
                text2: question.get("body"),
                startDate: moment(question.get("startDate")).format("YYYY-MM-DD"),
                endDate: moment(question.get("endDate")).format("YYYY-MM-DD"),
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