Parse.Cloud.define("GetQuestionsNew", function (request, response) {
    const DAY = 0
        , WEEK = 1
        , MONTH = 2
        , QUOTE = 3
        ;
    var theDate
        , deviceId
        , result = {}
        ;
    Parse.Cloud.useMasterKey();
    if (request.params.date) {
        theDate = moment(request.params.date).format("YYYY-MM-DD") + "T00:00:00.000Z";
    } else {
        theDate = moment().format("YYYY-MM-DD") + "T00:00:00.000Z";
    }
    var qInst = new Parse.Query("Device");
    qInst.equalTo("installationId", request.params.installationId);
    qInst.notEqualTo("isDeleted",true);
    qInst.first().then(function (device) {
        if (device) {
            deviceId = device.id;
            var qQ = new Parse.Query("QuestionSelect");
            qQ.equalTo("date", _parseDate(theDate));
            qQ.notEqualTo("isDeleted", true);
            qQ.include("questionOfDay.categoryId,questionOfWeek.categoryId,questionOfMonth.categoryId,quoteId");
            qQ.descending("createdAt");
            return  qQ.first();
        } else {
            return Parse.Promise.error("error.device-not-found");
        }
    }).then(function (qT) {
            result.date = moment(theDate).format("YYYY-MM-DD");
            result.content = new Array(4);
            if (qT) {
                result.content[DAY] = {};
                result.content[DAY].type = "astăzi";
                result.content[DAY].typeLocale = "type.q-day";
                result.content[DAY].id = qT.get("questionOfDay").id;
                result.content[DAY].category = qT.get("questionOfDay").get("categoryId").get("name");
                result.content[DAY].text1 = qT.get("questionOfDay").get("subject");
                result.content[DAY].text2 = qT.get("questionOfDay").get("body");
                result.content[DAY].link = qT.get("questionOfDay").get("link");
                result.content[DAY].picture = qT.get("questionOfDay").get("imageFile");
                result.content[DAY].imageSource = qT.get("questionOfDay").get("imageSource");
                result.content[DAY].percentYes = qT.get("questionOfDay").get("results") ? qT.get("questionOfDay").get("results").percentYes ? qT.get("questionOfDay").get("results").percentYes : 50 : 50;
                result.content[DAY].percentNo = 100 - result.content[DAY].percentYes;

                result.content[WEEK] = {};
                result.content[WEEK].type = "7 zile";
                result.content[WEEK].typeLocale = "type.q-week";
                result.content[WEEK].id = qT.get("questionOfWeek").id;
                result.content[WEEK].category = qT.get("questionOfWeek").get("categoryId").get("name");
                result.content[WEEK].text1 = qT.get("questionOfWeek").get("subject");
                result.content[WEEK].text2 = qT.get("questionOfWeek").get("body");
                result.content[WEEK].link = qT.get("questionOfWeek").get("link");
                result.content[WEEK].picture = qT.get("questionOfWeek").get("imageFile");
                result.content[WEEK].imageSource = qT.get("questionOfWeek").get("imageSource");
                result.content[WEEK].percentYes = qT.get("questionOfWeek").get("results") ? qT.get("questionOfWeek").get("results").percentYes ? qT.get("questionOfWeek").get("results").percentYes : 50 : 50;
                result.content[WEEK].percentNo = 100 - result.content[WEEK].percentYes;

                result.content[MONTH] = {};
                result.content[MONTH].type = "30 zile";
                result.content[MONTH].typeLocale = "type.q-month";
                result.content[MONTH].id = qT.get("questionOfMonth").id;
                result.content[MONTH].category = qT.get("questionOfMonth").get("categoryId").get("name");
                result.content[MONTH].text1 = qT.get("questionOfMonth").get("subject");
                result.content[MONTH].text2 = qT.get("questionOfMonth").get("body");
                result.content[MONTH].link = qT.get("questionOfMonth").get("link");
                result.content[MONTH].picture = qT.get("questionOfMonth").get("imageFile");
                result.content[MONTH].imageSource = qT.get("questionOfMonth").get("imageSource");
                result.content[MONTH].percentYes = qT.get("questionOfMonth").get("results") ? qT.get("questionOfMonth").get("results").percentYes ? qT.get("questionOfMonth").get("results").percentYes : 50 : 50;
                result.content[MONTH].percentNo = 100 - result.content[MONTH].percentYes;

                result.content[QUOTE] = {};
                result.content[QUOTE].type = "o idee";
                result.content[QUOTE].typeLocale = "type.quote";
                result.content[QUOTE].id = qT.get("quoteId").id;
                result.content[QUOTE].author = qT.get("quoteId").get("author");
                result.content[QUOTE].body = qT.get("quoteId").get("body");
                result.content[QUOTE].link = qT.get("quoteId").get("link");
                result.content[QUOTE].picture = qT.get("quoteId").get("imageFile");
                result.content[QUOTE].imageSource = qT.get("quoteId").get("imageSource");
            }
            return Parse.Promise.as();
        }).then(function () {
            return _GetVote(deviceId, result.content[DAY].id);
        }).then(function (rez) {
            if (rez) {
                result.content[DAY].hasVote = !!rez.date;
                result.content[DAY].dateVote = rez.date;
            } else {
                result.content[DAY].hasVote = false;
            }
            return _GetVote(deviceId, result.content[WEEK].id);
        }).then(function (rez) {
            if (rez) {
                result.content[WEEK].hasVote = !!rez.date;
                result.content[WEEK].dateVote = rez.date;
            } else {
                result.content[WEEK].hasVote = false;
            }
            return _GetVote(deviceId, result.content[MONTH].id);
        }).then(function (rez) {
            if (rez) {
                result.content[MONTH].hasVote = !!rez.date;
                result.content[MONTH].dateVote = rez.date;
            } else {
                result.content[MONTH].hasVote = false;
            }
            response.success(result);
        }, function (error) {
            response.error(error);
        });
});

var _GetVote;
_GetVote = function (deviceId, questionId) {
    var promise = new Parse.Promise();
    var qVote = new Parse.Query("Vote");
    qVote.equalTo("deviceId", _parsePointer("Device", deviceId));
    qVote.equalTo("questionId", _parsePointer("Question", questionId));
    qVote.first().then(function (vote) {
        if (vote) {
            promise.resolve({date: moment(vote.get("voteDate")).format("YYYY-MM-DDTHH:mm:ss")});
        } else {
            promise.resolve({date: ""});
        }
    }, function (error) {
        promise.reject(error);
    });
    return promise;
};
