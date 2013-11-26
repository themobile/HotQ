Parse.Cloud.beforeSave("Quote", function (request, response) {
    var quote = request.object
        ;
    if (!quote.existed()) {
        var sequence = new Parse.Query("Sequence");
        sequence.equalTo("tableName", "Quote");
        sequence.first().then(function (seq) {
            if (seq) {
                seq.increment("identity");
                return seq.save();
            } else {
                var Seq = Parse.Object.extend("Sequence");
                Seq = new Seq();
                Seq.set("tableName", "Quote");
                Seq.increment("identity");
                return Seq.save();
            }
        }).then(function (newSeq) {
                quote.set("sequence", newSeq.get("identity"));
                response.success();
            }, function (error) {
                response.error(JSON.stringify(error));
            });
    } else {
        response.success();
    }
});