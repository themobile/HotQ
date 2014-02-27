Parse.Cloud.define("GetQuestions_0101", function (request, response) {
    var theDate
        , deviceId
        , votes = []
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
    qInst.notEqualTo("isDeleted", true);
    qInst.first().then(function (device) {
        if (device) {
            deviceId = device.id;
            return _GetDeviceLastVotes(deviceId);
        } else {
            return Parse.Promise.error("error.device-not-found");
        }
    }).then(function (votesResult) {
            var include = "quoteId"
                ;
            votes = votesResult;

            var qQ = new Parse.Query("QuestionOnLine");
            qQ.equalTo("date", _parseDate(theDate));
            qQ.notEqualTo("isDeleted", true);
            for (var i = 0; i < 10; i++) {
                include += ",questionC" + (i + 1).toString() + "Id.categoryId" + ",questionC" + (i + 1).toString() + "Id.typeId";
            }
            qQ.include(include);
            qQ.descending("createdAt");
            return  qQ.first();
        }).then(function (qT) {
            var column, i
                ;
            result.date = moment(theDate).format("YYYY-MM-DD");
            result.content = [];
            for (i = 0; i < 10; i++) {
                column = "questionC" + (i + 1).toString() + "Id";
                if (qT.get(column)) {
                    result.content.push({
                        type: qT.get(column).get("typeId").get("name"),
                        typeLocale: qT.get(column).get("typeId").get("nameLocale"),
                        id: qT.get(column).id,
                        category: qT.get(column).get("categoryId").get("name"),
                        categoryLocale: qT.get(column).get("categoryId").get("nameLocale"),
                        text1: qT.get(column).get("subject"),
                        text2: qT.get(column).get("body"),
                        link: qT.get(column).get("link"),
                        picture: qT.get(column).get("imageFile"),
                        imageSource: qT.get(column).get("imageSource"),
                        percentYes: qT.get(column).get("results") ? qT.get(column).get("results").percentYes ? qT.get(column).get("results").percentYes : 50 : 50
                    });
                }
            }
            for (i = 0; i < result.content.length; i++) {
                result.content[i].percentNo = 100 - result.content[i].percentYes;
                for (var j = 0; j < votes.length; j++) {
                    if (result.content[i].id == votes[j].questionId) {
                        result.content[i].hasVote = true;
                        result.content[i].dateVote = votes[j].date;
                        votes.splice(j, 1);
                        break;
                    }
                }
            }

            result.content.push({
                type: "o idee",
                typeLocale: "type.quote",
                id: qT.get("quoteId").id,
                category: "o idee",
                author: qT.get("quoteId").get("author"),
                body: qT.get("quoteId").get("body"),
                link: qT.get("quoteId").get("link"),
                picture: qT.get("quoteId").get("imageFile"),
                imageSource: qT.get("quoteId").get("imageSource")
            });

            response.success(result);
        }, function (error) {
            response.error(error);
        });
});

_GetDeviceLastVotes = function (deviceId) {
    var promise = new Parse.Promise()
        , result = []
        ;
    var qVote = new Parse.Query("Vote");
    qVote.equalTo("deviceId", _parsePointer("Device", deviceId));
    qVote.limit(7);
    qVote.descending("createdAt");
    qVote.find().then(function (votes) {
        _.each(votes, function (vote) {
            result.push({
                date: moment(vote.get("voteDate")).format("YYYY-MM-DDTHH:mm:ss"),
                questionId: vote.get("questionId").id
            });
        });
        promise.resolve(result);
    }, function (error) {
        promise.reject(error);
    });
    return promise;
};
