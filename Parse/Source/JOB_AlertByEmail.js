Parse.Cloud.job("AlertsByEmail", function (request, status) {
    var currentDate = moment().format()
        , minDate
        , rez = {}
        , emailObject
        ;
    var jobName = "AlertsByEmail"
        , jobParam = request.params
        , jobRunId
        ;

    Parse.Cloud.useMasterKey();

    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {

            jobRunId = jobRun;

            minDate = moment(currentDate).add('m', -60).format();   // o ora in urma fata de GMT deci vreo 3-4 or in urma fata de ora Romaniei

            rez["ok"] = rez["err"] = 0;

            var qMail = new Parse.Query("AlertEmail");
            qMail.notEqualTo("isSent", true);
            qMail.greaterThanOrEqualTo("alertDate", parseDate(minDate));
            qMail.include("billId.userId");
            return qMail.find();
        }).then(function (mails) {
            var promise = Parse.Promise.as();
            _.each(mails, function (mail) {
                var bill = mail.get("billId")
                    , user = bill.get("userId")
                    ;
                if (bill.get("doneAlertEmail")) {
                    promise = promise.then(function () {
                        return ComposeMail(mail);
                    }).then(function (mailSaved) {
                            // aici efectiv trimit mail-ul
                            emailObject = mailSaved;
                            return SendEmail(
                                emailObject.get("from"),
                                emailObject.get("fromName"),
                                emailObject.get("to"),
                                emailObject.get("toName"),
                                emailObject.get("subject"),
                                emailObject.get("body")
                            );
                        }).then(function (mailResponse) {
                            emailObject.set("isSent", true);
                            return emailObject.save();
                        }).then(function (mailSaved) {
                            rez["ok"]++;
                        }, function (error) {
                            // nu ma intereseaza daca da eroare, o sa-l incerc iar
                            rez["err"]++;
                            return Parse.Promise.as().then(function () {
                                return AddJobRunHistory({
                                    name: jobName,
                                    jobId: parsePointer("AppJob", jobRunId.jobId),
                                    jobIdText: jobRunId.jobId,
                                    runCounter: jobRunId.jobRunCounter,
                                    parameters: jobParam,
                                    status: "error",
                                    statusObject: {
                                        emailObject: emailObject,
                                        error: error
                                    }
                                });
                            });
                        });
                }
            });
            return promise;
        }).then(function () {
            return AddJobRunHistory({
                name: jobName,
                jobId: parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "success",
                statusObject: rez
            });
        }).then(function () {
            status.success(JSON.stringify(rez));
        }, function (error) {
            status.error(JSON.stringify(error));
        });
});

var ComposeMail;
ComposeMail = function (mailObject) {
    var bill = mailObject.get("billId")
        , user = bill.get("userId")
        , mailFrom = "alert@thebill.ro"
        , mailFromName = "theBill Alerter"
        , jsEnter = String.fromCharCode(10)
        , bodyEn, bodyRo, body
        ;
    var prm = new Parse.Promise();
    TotalOverDueBills(user.id).then(function (rez) {
        var toName
            , firstName
            , lastName
            , totalScadent = formatAmount(rez.amount, '.', ' RON')
            , dueDate = moment(bill.get("dueDate")).format("DD/MMM/YYYY")
            , textAmount = formatAmount(bill.get("amount"), '.', ' RON')
            ;

        firstName = user.get("firstName");
        lastName = user.get("lastName");
        toName = iif(firstName, firstName, "");
        toName += ( (toName && user.get("lastName")) ? " " : "") + (user.get("lastName") ? user.get("lastName") : "" );

        bodyRo = iif(firstName, "Draga " + firstName, "Salut") + "," + jsEnter
            + "" + jsEnter
            + "Ti-am trimis acest mesaj pentru ca se apropie scadenta unei facturi si ai setata o alerta in aplicatia ta theBill." + jsEnter
            + "" + jsEnter
            + "Iata detaliile obligatiei de plata:" + jsEnter
            + "Nume: " + bill.get("name") + jsEnter
            + "Scadenta: " + dueDate + jsEnter
            + "Valoarea de achitat: " + textAmount + "." + jsEnter
            + "" + jsEnter
            + "Totalul obligatiilor tale scadente este de " + totalScadent + "." + jsEnter
            + "" + jsEnter
            + "-----------------------------" + jsEnter
            + "Acest mesaj a fost transmis conform setarilor din contul tau theBill." + jsEnter
            + "Iti reamintim ca iti poti plati foarte usor facturile direct din aplicatia theBill." + jsEnter
            + "http://thebill.ro" + jsEnter;
        bodyEn = iif(firstName, "Dear " + firstName, "Hello") + "," + jsEnter
            + "" + jsEnter
            + "We sent you this message to remind you about the following bill:" + jsEnter
            + "" + jsEnter
            + "Name: " + bill.get("name") + jsEnter
            + "Due on: " + dueDate + jsEnter
            + "Amount: " + textAmount + "." + jsEnter
            + "" + jsEnter
            + "And, for you to be on top of things, we let you know that theBill registered a total of " + totalScadent + " due bills." + jsEnter
            + "" + jsEnter
            + "-----------------------------" + jsEnter
            + "This message was sent according to theBill notification settings in your account." + jsEnter
            + "You can easily pay your bills directly from theBill." + jsEnter
            + "http://thebill.ro" + jsEnter;
        body = iif(user.get("language").toLowerCase() == "en", bodyEn + jsEnter + jsEnter + bodyRo, bodyRo + jsEnter + jsEnter + bodyEn);

        mailObject.set("from", mailFrom);
        mailObject.set("fromName", mailFromName);
        mailObject.set("to", user.get("email"));
        mailObject.set("toName", toName);
        mailObject.set("subject", "Alerta theBill");
        mailObject.set("body", body);
        return mailObject.save();
    }).then(function (mailSaved) {
            prm.resolve(mailSaved);
        }, function (error) {
            prm.reject(error);
        });
    return prm;
};

var SendEmail;
SendEmail = function (from, fromName, to, toName, subject, body) {
    var prm = new Parse.Promise();
    var Mandrill = require('mandrill');
    Mandrill.initialize('WAteKfECxJyYsjLNqujMug');
    Mandrill.sendEmail({
            message: {
                text: body,
                subject: subject,
                from_email: from,
                from_name: fromName,
                to: [
                    {
                        email: to,
                        name: toName
                    },
                    {
                        email: "gmail@thebill.ro",
                        name: "",
                        type: "bcc"
                    }
                ]
            },
            async: true
        },
        {success: function (httpResponse) {
            prm.resolve({httpResponse: httpResponse});
        }, error: function (httpResponse) {
            prm.reject({httpResponse: httpResponse});
        }
        });
    return prm;
};

var TotalOverDueBills;
TotalOverDueBills = function (userId) {
    var prm = new Parse.Promise()
        , qBill = new Parse.Query("Bill")
        , qProvider = new Parse.Query("Provider")
        , qType = new Parse.Query("ProviderType")
        ;
    qType.notEqualTo("isDeleted", true);
    qProvider.notEqualTo("isDeleted", true);
    qProvider.matchesQuery("typeId", qType);
    qBill.equalTo("userId", parsePointer("_User", userId));
    qBill.lessThanOrEqualTo("dueDate", parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z"));
    qBill.notEqualTo("isDeleted", true);
    qBill.matchesQuery("providerId", qProvider);
    qBill.find().then(function (bills) {
        var amount = 0
            , count = 0
            ;
        _.each(bills, function (bill) {
            amount += bill.get("amount");
            count++;
        });
        prm.resolve({
            amount: Math.round(amount),
            count: count
        });
    }, function (error) {
        prm.reject(error);
    });
    return prm;
};
