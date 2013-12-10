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
    qQuestion.find().then(function (qs) {
        _.each(qs, function (q) {
            var objToAdd = {
                id: q.id,
                category: q.get("categoryId").get("name"),
                type: q.get("typeId").get("name"),
                typeLocale: q.get("typeId").get("nameLocale"),
                text1: q.get("subject"),
                text2: q.get("body"),
                startDate: moment(q.get("startDate")).format("YYYY-MM-DD"),
                endDate: moment(q.get("endDate")).format("YYYY-MM-DD"),
                resultPercentYes: q.get("results") ? q.get("results").percentYes ? q.get("results").percentYes : 50 : 50
            };
            objToAdd.resultPercentNo = 100 - objToAdd.resultPercentYes;
            results.push(objToAdd);
        });
        response.success(results);
    }, function (error) {
        response.error(error);
    });
});