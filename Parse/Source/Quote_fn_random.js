var _GetRandomQuote;
_GetRandomQuote = function () {
    var promise = new Parse.Promise()
        ;
    var min = 1
        , max
        , number
        ;
    var qSeq = new Parse.Query("Sequence");
    qSeq.equalTo("tableName", "Quote");
    qSeq.first().then(function (seq) {
        if (seq) {
            max = seq.get("identity");
        } else {
            max = min;
        }
        number = Math.floor(Math.random() * (max - min + 1) + min);
        var qQuote = new Parse.Query("Quote");
        qQuote.equalTo("sequence", number);
        return qQuote.first();
    }).then(function (quote) {
            if (quote) {
                return quote;
            } else {
                return Parse.Promise.error("error.quote-not-found");
            }
        }).then(function (quote) {
            promise.resolve(quote);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};