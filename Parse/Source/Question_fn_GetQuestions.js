/**
 *  Atentie!!!!!
 *  Aplicatia mobila lanseaza GetQuestionsNew
 *
 * */
Parse.Cloud.define("GetQuestions", function (request, response) {
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
            if (qT) {
                result.questionOfDay = {};
                result.questionOfDay.id = qT.get("questionOfDay").id;
                result.questionOfDay.category = qT.get("questionOfDay").get("categoryId").get("name");
                result.questionOfDay.text1 = qT.get("questionOfDay").get("subject");
                result.questionOfDay.text2 = qT.get("questionOfDay").get("body");
                result.questionOfDay.link = qT.get("questionOfDay").get("link");
                result.questionOfDay.picture = qT.get("questionOfDay").get("imageFile");
                result.questionOfDay.imageSource = qT.get("questionOfDay").get("imageSource");
                result.questionOfDay.percentYes = qT.get("questionOfDay").get("results") ? qT.get("questionOfDay").get("results").percentYes ? qT.get("questionOfDay").get("results").percentYes : 50 : 50;
                result.questionOfDay.percentNo = 100 - result.questionOfDay.percentYes;

                result.questionOfWeek = {};
                result.questionOfWeek.id = qT.get("questionOfWeek").id;
                result.questionOfWeek.category = qT.get("questionOfWeek").get("categoryId").get("name");
                result.questionOfWeek.text1 = qT.get("questionOfWeek").get("subject");
                result.questionOfWeek.text2 = qT.get("questionOfWeek").get("body");
                result.questionOfWeek.link = qT.get("questionOfWeek").get("link");
                result.questionOfWeek.picture = qT.get("questionOfWeek").get("imageFile");
                result.questionOfWeek.imageSource = qT.get("questionOfWeek").get("imageSource");
                result.questionOfWeek.percentYes = qT.get("questionOfWeek").get("results") ? qT.get("questionOfWeek").get("results").percentYes ? qT.get("questionOfWeek").get("results").percentYes : 50 : 50;
                result.questionOfWeek.percentNo = 100 - result.questionOfWeek.percentYes;

                result.questionOfMonth = {};
                result.questionOfMonth.id = qT.get("questionOfMonth").id;
                result.questionOfMonth.category = qT.get("questionOfMonth").get("categoryId").get("name");
                result.questionOfMonth.text1 = qT.get("questionOfMonth").get("subject");
                result.questionOfMonth.text2 = qT.get("questionOfMonth").get("body");
                result.questionOfMonth.link = qT.get("questionOfMonth").get("link");
                result.questionOfMonth.picture = qT.get("questionOfMonth").get("imageFile");
                result.questionOfMonth.imageSource = qT.get("questionOfMonth").get("imageSource");
                result.questionOfMonth.percentYes = qT.get("questionOfMonth").get("results") ? qT.get("questionOfMonth").get("results").percentYes ? qT.get("questionOfMonth").get("results").percentYes : 50 : 50;
                result.questionOfMonth.percentNo = 100 - result.questionOfMonth.percentYes;

                result.quote = {};
                result.quote.id = qT.get("quoteId").id;
                result.quote.author = qT.get("quoteId").get("author");
                result.quote.body = qT.get("quoteId").get("body");
                result.quote.link = qT.get("quoteId").get("link");
                result.quote.picture = qT.get("quoteId").get("imageFile");
                result.quote.imageSource = qT.get("quoteId").get("imageSource");
            }
            return Parse.Promise.as();
        }).then(function () {
            return _GetVote(deviceId, result.questionOfDay.id);
        }).then(function (rez) {
            if (rez) {
                result.questionOfDay.hasVote = !!rez.date;
                result.questionOfDay.dateVote = rez.date;
            } else {
                result.questionOfDay.hasVote = false;
            }
            return _GetVote(deviceId, result.questionOfWeek.id);
        }).then(function (rez) {
            if (rez) {
                result.questionOfWeek.hasVote = !!rez.date;
                result.questionOfWeek.dateVote = rez.date;
            } else {
                result.questionOfWeek.hasVote = false;
            }
            return _GetVote(deviceId, result.questionOfMonth.id);
        }).then(function (rez) {
            if (rez) {
                result.questionOfMonth.hasVote = !!rez.date;
                result.questionOfMonth.dateVote = rez.date;
            } else {
                result.questionOfMonth.hasVote = false;
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
