function Proba(APP_ID, KEY) {
    importQuotes(APP_ID, KEY);
}

function importQuotes(APP_ID, KEY) {
    Parse.initialize(APP_ID, KEY);
    var quotes = [
        {'author': 'Heraclit din Efes', 'body': 'Educația este al doilea soare pentru cei care o au.', 'link': 'http://www.citatecelebre.net/alte-categorii/heraclit-din-efes-2/'},
        {'author': 'Heraclit din Efes', 'body': 'Nimic nu este permanent, în afară de schimbare.', 'link': 'http://www.citatecelebre.net/citate-filosofice/heraclit-din-efes/'},
        {'author': 'Nichita Stănescu', 'body': 'Nu putem inventa sentimente. Le putem descoperi și exprima, iubi și urî, le putem apropia de inimă sau le putem respinge.', 'link': 'http://www.citatecelebre.net/citate-filosofice/nichita-st%C4%83nescu-10/'},
        {'author': 'Liviu Rebreanu', 'body': 'Iubirea adevărată înfruntă lumea, e generoasă și mândră. Nici o plăcere în iubire nu se poate compara cu afișarea ei în fața oamenilor. Numai iubirea vinovată se ascunde.', 'link': 'http://www.citatecelebre.net/citate-dragoste/liviu-rebreanu-15/'},
        {'author': 'Joe Vitale', 'body': 'Sexul fără iubire este doar acrobație. Sexul însoțit de iubire este beatitudine.', 'link': 'http://www.citatecelebre.net/citate-dragoste/joe-vitale/'},
        {'author': 'Sigmund Freud', 'body': 'Ești stăpânul a ceea ce nu spui și sclavul a ceea ce nu vorbești.', 'link': 'http://www.citatecelebre.net/citate-filosofice/sigmund-freud-10/'},
        {'author': 'Nicolae Iorga', 'body': 'După furtunile sufletului, ca și după cele ale naturii, învie flori pe care le credeam moarte.', 'link': 'http://www.citatecelebre.net/citate-fericire/nicolae-iorga-38/'},
        {'author': 'Oscar Wilde', 'body': 'Bigamia înseamnă să ai o nevastă în plus. Monogamia e același lucru.', 'link': 'http://www.citatecelebre.net/citate-fericire/oscar-wilde-36/'},
        {'author': 'Woody Allen', 'body': 'Ultima dată când am fost înăuntrul unei femei a fost când am vizitat Statuia Libertății.', 'link': 'http://www.citatecelebre.net/citate-despre-viata/woody-allen-8/'},
        {'author': 'Walt Disney', 'body': 'Îl iubesc mai mult pe Mickey Mouse decât pe orice femeie pe care am cunoscut-o.', 'link': 'http://www.citatecelebre.net/ciate-amuzante/walt-disney-5/'},
        {'author': 'Feodor Mihailovici Dostoievski', 'body': 'Vremurile noastre sunt vremea mediocrității, a lipsei de sentimente, a pasiunii pentru incultură, a lenei, a incapacității de a te apuca de treabă și a dorinței de a avea totul de-a gata.', 'link': 'http://www.citatecelebre.net/citate-despre-viata/feodor-mihailovici-dostoievski-4/'},
        {'author': 'George Carlin', 'body': 'Dacă Dumnezeu nu ar fi dorit ca noi să ne masturbăm, ne-ar fi făcut brațele mai scurte.', 'link': 'http://www.citatecelebre.net/ciate-amuzante/george-carlin-5/'},
        {'author': 'Cary Grant', 'body': 'Pentru a avea succes la sexul opus, spune-i că ești impotent. Va face tot posibilul să iți demonstreze contrariul.', 'link': 'http://www.citatecelebre.net/ciate-amuzante/cary-grant/'}
    ];

    var promise = Parse.Promise.as();
    _.each(quotes, function (quote) {
        promise = promise.then(function () {
            var X = Parse.Object.extend('Quote');
            X = new X();
            X.set('author', quote.author);
            X.set('body', quote.body);
            X.set('link', quote.link);
            return X.save();
        });
    });
    return promise;
}


function statistica(APP_ID, KEY) {
    Parse.initialize(APP_ID, KEY);
    var outPut = [];
    var promise = Parse.Promise.as();
    for (var i = 0; i < 100; i++) {
        promise = promise.then(function () {
            return Parse.Cloud.run("GetQuestions", {"installationId": "891e011e-77f3-4b23-8e0d-f7174da27379"});
        }).then(function (rez) {
                outPut.push({

                });
            });
    }
    var textFinal = outPut.join(",");
}


