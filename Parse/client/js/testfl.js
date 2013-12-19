var isLoged = false;

iif = function (condition, trueExpression, falseExpression) {
    falseExpression = falseExpression ? falseExpression : "";
    return !!condition ? trueExpression : falseExpression;
};

var _parseDate;
_parseDate = function (stringDate) {
    var objDate = {};
    objDate["__type"] = "Date";
    objDate["iso"] = stringDate;
    return objDate;
};
function doSleep(xtime) {
    var x = 1;
    var y = null; // To keep under proper scope

    setTimeout(function () {
        x = x * 3 + 2;
        y = x / 2;
    }, xtime);
}
function showSuccess(text) {
    $(".success").show();
    $("#p1")[0].innerHTML = text;
}
function hideSucces() {
    $("#p1")[0].innerHTML = "";
    $(".success").hide();
}

function showError(text) {
    $(".error").show();
    $("#p2")[0].innerHTML += "<br>" + text;
}
function hideError() {
    $("#p2")[0].innerHTML = "";
    $(".error").hide();
}


function LogOut() {
    if (Parse.User.current({
        error: function (error) {
            showError(error.message);
        }
    })) {
        Parse.User.logOut();
        $('.stk').hide();
        $('#stktext')[0].innerHTML = "";
        isLoged = false;
        showSuccess("delogare...");
    } else {
        showError("Niciun user logat");
    }
}

function CloseLogin() {
    $('.get-login').hide();
}
function LogInShow() {
    if (!($('.get-login').is(':visible'))) {
        $('.get-login').show();
    }
}


function LogIn(APP_ID, KEY) {
    var userName
        , password
        ;
    Parse.initialize(APP_ID, KEY);

    userName = $('#userName').val();
    password = $('#password').val();

    var user = Parse.User.logIn(userName, password, {
        success: function (user) {
            $('.stk').show();
            $('#stktext')[0].innerHTML = user._sessionToken;
            showSuccess("Autentificat ca: " + user.get("username") + " cu token " + user._sessionToken);
        },
        error: function (user, error) {
            showError("Autentificare esuata cu eroarea: " + error.message);
        }
    });

}


function ShowAddQuestion() {
    $('.add-question').show();
}

function saveQuestion(APP_ID, KEY, dateForm, fileUploadControl) {
    var categoryId = getValue(dateForm, 0)
        , typeId = getValue(dateForm, 1)
        , day = getValue(dateForm, 2)
        , month = getValue(dateForm, 3)
        , year = getValue(dateForm, 4)
        , subject = getValue(dateForm, 5)
        , body = getValue(dateForm, 6)
        , link = getValue(dateForm, 7)
        ;
    var qToSave
        , qObject
        ;

    Parse.initialize(APP_ID, KEY);

    qToSave = {
        category: iif(categoryId == "1", "social", categoryId),
        type: iif(typeId == "1", "day", iif(typeId = "2", "week", "month")),
        text1: urldecode(subject),
        text2: urldecode(body),
        startDate: year + "-" + month + "-" + day,
        link: link
    };

    Parse.Cloud.run("QuestionAdmin", qToSave).then(function (qSaved) {
        qObject = qSaved;
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = file.name;
            var parseFile = new Parse.File(name, file);
            return parseFile.save();
        } else {
            return Parse.Promise.as();
        }
    }).then(function (fileObject) {
            if (fileObject) {
                qObject.set("imageFile", fileObject);
                return qObject.save();
            } else {
                return Parse.Promise.as();
            }
        }).then(function () {
            $('form#form-add-question').trigger('reset');
            $('.add-question').hide();
            showSuccess("New Id: " + qObject.id);
        }, function (error) {
            showError(JSON.stringify(error));
        });
}

function getValue(serial, index) {
    return serial.split("&")[index].split("=")[1];
}

function urldecode(url) {
    return decodeURIComponent(url.replace(/\+/g, ' '));
}