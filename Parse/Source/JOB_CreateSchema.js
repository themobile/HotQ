//todo: de adaugat in  Question*
//    Category = "social"
//    Type x 3 [day, week, month]

Parse.Cloud.job("CreateApplication", function (request, status) {
    Parse.Cloud.useMasterKey();
    _createAdminUsers().then(function () {
//        return _createRoles();    // merge doar o data, altfel at tb sa schimb codul si sa nu mai creeze rolul daca exista deja
        return Parse.Promise.as();
    }).then(function () {
            return _createSchema();
        }).then(function () {
            return _createQuestionType();
        }).then(function () {
            return _createQuestionCategory();
        }).then(function () {
            status.success("OK");
        }, function (error) {
            _Log(error);
            status.error(JSON.stringify(error));
        });
});

var HotQSchema = {
    columnTypeDefaults: {
        date: {
            __type: "Date",
            iso: "2013-01-01T00:00:00.000Z"
        },
        string: "abcdABCD01234",
        integer: 1234567,
        money: 123243.7698,
        boolean: true,
        object: {},
        array: []
    },
    tables: [
        {
            name: "AppJob",
            columns: [
                {
                    name: "name", type: "string"
                },
                {
                    name: "runCounter", type: "integer"
                },
                {
                    name: "parameters", type: "object"
                }
            ]
        },
        {
            name: "AppJobRunHistory",
            columns: [
                {
                    name: "name", type: "string"
                },
                {
                    name: "jobId", type: "pointer", default: {__type: "Pointer", className: "AppJob", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "isSuccess", type: "boolean"
                },
                {
                    name: "isError", type: "boolean"
                },
                {
                    name: "isOther", type: "boolean"
                },
                {
                    name: "runCounter", type: "integer"
                },
                {
                    name: "status", type: "string"
                },
                {
                    name: "statusObject", type: "object"
                },
                {
                    name: "jobIdText", type: "string"
                },
                {
                    name: "parameters", type: "object"
                }
            ]
        },
        {
            name: "Device",
            columns: [
                {
                    name: "deviceCode", type: "string"
                },
                {
                    name: "pushCode", type: "string"
                },
                {
                    name: "type", type: "string"
                },
                {
                    name: "timeZone", type: "string"
                },
                {
                    name: "installationId", type: "string"
                },
                {
                    name: "tags", type: "object"
                },
                {
                    name: "isDeleted", type: "boolean"
                }
            ]
        },
        {
            name: "Question",
            columns: [
                {
                    name: "categoryId", type: "pointer", default: {__type: "Pointer", className: "QuestionCategory", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "typeId", type: "pointer", default: {__type: "Pointer", className: "QuestionType", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "results", type: "object"
                },
                {
                    name: "subject", type: "string"
                },
                {
                    name: "body", type: "string"
                },
                {
                    name: "link", type: "string"
                },
                {
                    name: "startDate", type: "date"
                },
                {
                    name: "endDate", type: "date"
                },
                {
                    name: "isDeleted", type: "boolean"
                },
                {
                    name: "imageSource", type: "string"
                }
            ]
        },
        {
            name: "QuestionCategory",
            columns: [
                {
                    name: "name", type: "string"
                },
                {
                    name: "nameLocale", type: "string"
                },
                {
                    name: "isDeleted", type: "boolean"
                }
            ]
        },
        {
            // eliminat incepand cu 1.1
            name: "QuestionSelect",
            columns: [
                {
                    name: "date", type: "date"
                },
                {
                    name: "questionOfDay", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "questionOfWeek", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "questionOfMonth", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "quoteId", type: "pointer", default: {__type: "Pointer", className: "Quote", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "updates", type: "integer"
                },
                {
                    name: "isDeleted", type: "boolean"
                }
            ]
        },
        {
            name: "QuestionOnLine",
            columns: [
                {
                    name: "date", type: "date"
                },
                {
                    name: "questionC1Id", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "questionC2Id", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "questionC3Id", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "questionC4Id", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "questionC5Id", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "questionC6Id", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "questionC7Id", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "questionC8Id", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "questionC9Id", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "questionC10Id", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "quoteId", type: "pointer", default: {__type: "Pointer", className: "Quote", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "updates", type: "integer"
                },
                {
                    name: "isDeleted", type: "boolean"
                }
            ]
        },
        {
            name: "QuestionType",
            columns: [
                {
                    name: "name", type: "string"
                },
                {
                    name: "nameLocale", type: "string"
                },
                {
                    name: "isDeleted", type: "boolean"
                }
            ]
        },
        {
            name: "Quote",
            columns: [
                {
                    name: "sequence", type: "integer"
                },
                {
                    name: "author", type: "string"
                },
                {
                    name: "body", type: "string"
                },
                {
                    name: "link", type: "string"
                },
                {
                    name: "isDeleted", type: "boolean"
                },
                {
                    name: "imageSource", type: "string"
                }
            ]
        },
        {
            name: "Sequence",
            columns: [
                {
                    name: "identity", type: "integer"
                },
                {
                    name: "tableName", type: "string"
                }
            ]
        },
        {
            name: "UserQuestion",
            columns: [
                {
                    name: "questionContent", type: "string"
                },
                {
                    name: "tricks", type: "string"
                }
            ]
        },
        {
            name: "Vote",
            columns: [
                {
                    name: "answer", type: "object"
                },
                {
                    name: "counter", type: "integer"
                },
                {
                    name: "voteDate", type: "date"
                },
                {
                    name: "deviceId", type: "pointer", default: {__type: "Pointer", className: "Device", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "questionId", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "done", type: "boolean"
                }
            ]
        },
        {
            name: "VoteLog",
            columns: [
                {
                    name: "answer", type: "object"
                },
                {
                    name: "installationId", type: "string"
                },
                {
                    name: "questionId", type: "pointer", default: {__type: "Pointer", className: "Question", objectId: "Q2AktMb7uA"}
                },
                {
                    name: "position", type: "object"
                },
                {
                    name: "demographics", type: "object"
                },
                {
                    name: "timeZone", type: "string"
                },
                {
                    name: "tags", type: "object"
                },
                {
                    name: "version", type: "string"
                },
                {
                    name: "isSuccess", type: "boolean"
                },
                {
                    name: "status", type: "string"
                },
                {
                    name: "voteId", type: "pointer", default: {__type: "Pointer", className: "Vote", objectId: "Q2AktMb7uA"}
                }
            ]
        }
    ]
};

var adminUsers = [
    {"username": "chindea.daniel@gmail.com", "password": "danny092", "firstName": "Daniel", "lastName": "Chindea"
    },
    {"username": "florian.cechi@gmail.com", "password": "anec27", "firstName": "Florian", "lastName": "Cechi"
    }
];

var HotQCategory = [
    {
        name: "politică",
        nameLocale: "category.politics"
    },
    {
        name: "business",
        nameLocale: "category.business"
    },
    {
        name: "actualitate",
        nameLocale: "category.actual"
    },
    {
        name: "monden",
        nameLocale: "category.lifestyle"
    },
    {
        name: "sport",
        nameLocale: "category.sport"
    }
];

_createSchema = function () {
    var promise = new Parse.Promise()
        , prm = Parse.Promise.as()
        ;

    _.each(HotQSchema.tables, function (table) {
        prm = prm.then(function () {
            return _createSchemaTable(table);
        })
    });

    prm = prm.then(function () {
        promise.resolve({});
    }, function (error) {
        promise.reject(error);
    });

    return promise;
};

_createQuestionCategoryAdd = function (category) {
    var promise = new Parse.Promise()
        ;
    var qc = new Parse.Query("QuestionCategory");
    qc.equalTo("nameLocale", category.nameLocale);
    qc.notEqualTo("isDeleted", true);
    qc.first().then(function (qcObject) {
        if (qcObject) {
            qcObject.set("name", category.name);
        } else {
            var QcObj = Parse.Object.extend("QuestionCategory");
            qcObject = new QcObj();
            qcObject.set("nameLocale", category.nameLocale);
            qcObject.set("name", category.name);
        }
        qcObject.setACL(_getAdminACL());
        return qcObject.save();
    }).then(function () {
            promise.resolve({});
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};

_createQuestionCategory = function () {
    var promise = new Parse.Promise()
        , prm = Parse.Promise.as()
        ;
    _.each(HotQCategory, function (category) {
        prm = prm.then(function () {
            return _createQuestionCategoryAdd(category);
        });
    });

    prm = prm.then(function () {
        promise.resolve({});
    }, function (error) {
        promise.reject(error);
    });

    return promise;
};

_createQuestionType = function () {
    var promise = new Parse.Promise()
        , prm = Parse.Promise.as()
        , qtArray = ["day", "week", "month"]
        ;
    _.each(qtArray, function (qt) {
        prm = prm.then(function () {
            return _createOrModifyQuestionType(qt);
        });
    });
    prm = prm.then(function () {
        promise.resolve({});
    }, function (error) {
        promise.reject(error);
    });

    return promise;
};

_createOrModifyQuestionType = function (type) {
    var promise = new Parse.Promise()
        ;
    var qType = new Parse.Query("QuestionType");
    qType.equalTo("name", type);
    qType.notEqualTo("isDeleted", true);
    qType.first().then(function (qtObject) {
        if (!(qtObject)) {
            var QtObject = Parse.Object.extend("QuestionType");
            qtObject = new QtObject();
            qtObject.set("name", type);
        }
        qtObject.set("nameLocale", "type.q-" + type);
        qtObject.setACL(_getAdminACL());
        return qtObject.save();
    }).then(function (saved) {
            promise.resolve(saved);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};

_createSchemaTable = function (table) {
    var promise = new Parse.Promise()
        ;
    var newObject = Parse.Object.extend(table.name);
    newObject = new newObject();
    _.each(table.columns, function (column) {
        newObject.set(column.name, iif(column.default, column.default, HotQSchema.columnTypeDefaults[column.type]));
    });
    newObject.save().then(function (objSaved) {
        if (objSaved) {
            return objSaved.destroy();
        } else {
            return Parse.Promise.error("Object was not created! (" + table.name + ")");
        }
    }).then(function () {
            promise.resolve({});
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};

_createRoles = function () {
    var promise = new Parse.Promise();
    var usr = [];
    var adminRole;
    _.each(adminUsers, function (adminUser) {
        usr.push(adminUser.username);
    });
    var qAdmin = new Parse.Query(Parse.User);
    qAdmin.containedIn("email", usr);
    qAdmin.find().then(function (admins) {
        var roleACL = new Parse.ACL();
        roleACL.setPublicReadAccess(true);
        roleACL.setRoleReadAccess("Administrators", true);
        roleACL.setRoleWriteAccess("Administrators", true);
        var roleAdmin = new Parse.Role("Administrators", roleACL);
        for (var i = 0, n = admins.length; i < n; i++) {
            roleAdmin.getUsers().add(admins[i]);
        }
        return roleAdmin.save();
    }).then(function (roleAdminSaved) {
            adminRole = roleAdminSaved;
            var qUser = new Parse.Query(Parse.User);
            qUser.notContainedIn("email", usr);
            return qUser.find();
        }).then(function (users) {
            var roleACL = new Parse.ACL();
            roleACL.setPublicReadAccess(true);
            roleACL.setRoleReadAccess("Administrators", true);
            roleACL.setRoleWriteAccess("Administrators", true);
            var role = new Parse.Role("Users", roleACL);
            for (var i = 0, n = users.length; i < n; i++) {
                role.getUsers().add(users[i]);
            }
            role.getRoles().add(adminRole);
            return role.save();
        }).then(function () {
            promise.resolve({});
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};

_createAdminUsers = function () {
    var promise = new Parse.Promise()
        ;

    var prm = Parse.Promise.as();
    _.each(adminUsers, function (user) {
        prm = prm.then(function () {
            return _createUserIfNotExists(user);
        });
    });
    prm = prm.then(function () {
        promise.resolve({});
    }, function (error) {
        promise.reject(error);
    });
    return promise;
};

_createUserIfNotExists = function (user) {
    var promise = new Parse.Promise()
        ;
    var qUser = new Parse.Query(Parse.User);
    qUser.equalTo("email", user.username);
    qUser.first().then(function (userFnd) {
        if (userFnd) {
            return Parse.Promise.as();
        } else {
            var userNew = new Parse.User();
            userNew.set("username", user.username);
            userNew.set("email", user.username);
            userNew.set("password", user.password);
            userNew.set("firstName", user.firstName);
            userNew.set("lastName", user.lastName);
            return userNew.signUp();
        }
    }).then(function (userSaved) {
            promise.resolve(userSaved);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};


