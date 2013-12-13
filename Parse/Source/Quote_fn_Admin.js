Parse.Cloud.define("QuoteAdmin", function (request, response) {
    var thisUser = request.user
        , quote = request.params
        , quoteRet
        , doSequence = false
        ;
    if (thisUser) {
        var qQuote = new Parse.Query("Quote");
        qQuote.equalTo("body", quote.body);
        qQuote.first().then(function (quoteObject) {
            if (!quoteObject) {
                var NewQuote = Parse.Object.extend("Quote");
                quoteObject = new NewQuote();
                quoteObject.set("body", quote.body);
                doSequence = true;
            }
            quoteObject.set("author", quote.author);
            quoteObject.set("link", quote.link);
            quoteObject.setACL(_getUserACL(thisUser));
            return quoteObject.save();
        }).then(function (quoteSaved) {
                quoteRet = quoteSaved;
                if (doSequence || !quoteSaved.get("sequence")) {
                    doSequence = true;
                    var qSequence = new Parse.Query("Sequence");
                    qSequence.equalTo("tableName", "Quote");
                    return qSequence.first();
                } else {
                    return Parse.Promise.as();
                }
            }).then(function (seq) {
                if (doSequence) {
                    if (!seq) {
                        var Seq = Parse.Object.extend("Sequence");
                        seq = new Seq();
                        seq.set("tableName", "Quote");
                    }
                    seq.setACL(_getUserACL(thisUser));
                    seq.increment("identity");
                    return seq.save();
                } else {
                    return Parse.Promise.as();
                }
            }).then(function (newSeq) {
                if (doSequence) {
                    quoteRet.set("sequence", newSeq.get("identity"));
                    return quoteRet.save();
                } else {
                    return Parse.Promise.as();
                }
            }).then(function () {
                response.success(quoteRet.id);
            }, function (error) {
                response.error(JSON.stringify(error));
            })
    } else {
        response.error("error.user-not-found");
    }
});
