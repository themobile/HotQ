//TODO: dev, test, pro
//TODO: atentie la toate Query-urile: limit este default 100 si maxim 1000 - la un moment dat trebe tinut cont de asta

var moment = require('moment')
    , _ = require('underscore')
    ;
//require('cloud/app.js');

moment.lang('ro', {
    months: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"],
    monthsShort: ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "nov", "dec"]
});

var theBillSecretKey = 'v0]w?I)2~T~S[6n0(z0*';
var crypto = require('crypto');
var Buffer = require('buffer').Buffer;
var isProduction = (Parse.applicationId == "oYvsd9hx0NoIlgEadXJsqCtU1PgjcPshRqy18kmP");
var HotQVersion = '1.1.249';
var StringBuffer = function () {
    this.buffer = [];
};
StringBuffer.prototype.append = function append(string) {
    this.buffer.push(string);
    return this;
};
StringBuffer.prototype.toString = function toString() {
    return this.buffer.join("");
};

var escapeHtml = function (text) {
//       return text
//              .replace(/&/g, "&amp;")
//              .replace(/</g, "&lt;")
//              .replace(/>/g, "&gt;")
//              .replace(/"/g, "&quot;")
//              .replace(/'/g, "&#039;");
    if (typeof text == "String") {
        text = text.replace(/&/g, "&amp;");
        text = text.replace(/</g, "&lt;");
        text = text.replace(/>/g, "&gt;");
        text = text.replace(/"/g, "&quot;");
        text = text.replace(/'/g, "&#039;");
    }

    return text
};

_getAdminACL = function () {
    var pACL = new Parse.ACL();
    pACL.setRoleReadAccess("Administrators", true);
    pACL.setRoleWriteAccess("Administrators", true);
    return pACL;
};

_getUserACL = function (user) {
    var pACL = new Parse.ACL(user);
    pACL.setRoleReadAccess("Administrators", true);
    pACL.setRoleWriteAccess("Administrators", true);
    return pACL;
};

_parsePointer = function (className, objectId) {
    var objPointer = {};
    objPointer["__type"] = "Pointer";
    objPointer["className"] = className;
    objPointer["objectId"] = objectId;
    return objPointer;
};

_parseDate = function (stringDate) {
    var objDate = {};
    objDate["__type"] = "Date";
    objDate["iso"] = stringDate;
    return objDate;
};
_getAlertDate = function (date, days, time, wdo) {
    var daysBefore = days ? days : 1
        , rgxHour = /^(?:[0,1]?\d{1}|2[0-3])\:[0-5]\d$/g
        , alertTime = rgxHour.test(time) ? time : "09:30"
        , alertDate = moment(date).subtract('days', daysBefore).format("YYYY-MM-DD") + "T" + alertTime + ":00.000Z"
        , tempDate
        , minOffset = 0
        ;
    if (wdo) {
        tempDate = moment(alertDate).format("YYYY-MM-DD");
        while (_dateIsHoliDay(tempDate)) {
            tempDate = moment(tempDate).subtract('days', 1).format("YYYY-MM-DD");
        }
        alertDate = moment(tempDate).format("YYYY-MM-DD") + "T" + alertTime + ":00.000Z"
    }
    return _parseDate(alertDate);
};
holidayTable =
    [
        {
            "date": "2013-01-01", "description": "Revelion"
        },
        {
            "date": "2013-01-02", "description": "Revelion 2"
        },
        {
            "date": "2013-05-01", "description": "1 Mai"
        },
        {
            "date": "2013-05-05", "description": "Prima zi de Paste"
        },
        {
            "date": "2013-05-06", "description": "A 2-a zi de Paste"
        },
        {
            "date": "2013-06-23", "description": "Rusalii"
        },
        {
            "date": "2013-06-24", "description": "Rusalii 2"
        },
        {
            "date": "2013-08-15", "description": "Adormirea Maicii Domnului"
        },
        {
            "date": "2013-11-30", "description": "Sf Andrei"
        },
        {
            "date": "2013-12-01", "description": "Sarbatoare Nationala"
        },
        {
            "date": "2013-12-25", "description": "Prima zi de Craciun"
        },
        {
            "date": "2013-12-26", "description": "A doua zi de Craciun"
        },
        //       2 0 1 4
        {
            "date": "2014-01-01", "description": "Revelion"
        },
        {
            "date": "2014-01-02", "description": "Revelion 2"
        },
        {
            "date": "2014-04-20", "description": "Prima zi de Paste"
        },
        {
            "date": "2014-04-21", "description": "A 2-a zi de Paste"
        },
        {
            "date": "2014-05-01", "description": "1 Mai"
        },
        {
            "date": "2014-06-08", "description": "Rusalii"
        },
        {
            "date": "2014-06-09", "description": "Rusalii 2"
        },
        {
            "date": "2014-08-15", "description": "Adormirea Maicii Domnului"
        },
        {
            "date": "2014-11-30", "description": "Sf Andrei"
        },
        {
            "date": "2014-12-01", "description": "Sarbatoare Nationala"
        },
        {
            "date": "2014-12-25", "description": "Prima zi de Craciun"
        },
        {
            "date": "2014-12-26", "description": "A doua zi de Craciun"
        }
    ];
_dateIsHoliDay = function (date) {
    var weekDay = moment(date).day()
        , pos
        ;
    if (weekDay > 0 && weekDay < 6) {
        pos = _.find(holidayTable, function (hDate) {
            return hDate.date == date;
        });
        if (pos) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }

};
_dateIsWorkingDay = function (date) {
    var weekDay = moment(date).day()
        , pos
        ;
    if (weekDay > 0 && weekDay < 6) {
        pos = _.find(holidayTable, function (hDate) {
            return hDate.date == date;
        });
        if (pos) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};
_dateGetRoTimeOffset = function (date) {
    var arrayDates = [
            {"date": "2000-01-01T00:00:00.000Z", "minOffset": -120, "cnt": 86},
            {"date": "2000-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2000-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 147},
            {"date": "2001-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2001-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2002-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
            {"date": "2002-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2003-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
            {"date": "2003-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2004-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2004-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
            {"date": "2005-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2005-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
            {"date": "2006-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2006-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 147},
            {"date": "2007-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2007-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2008-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
            {"date": "2008-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2009-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
            {"date": "2009-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2010-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2010-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
            {"date": "2011-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2011-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
            {"date": "2012-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2012-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2013-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
            {"date": "2013-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2014-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
            {"date": "2014-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2015-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
            {"date": "2015-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2016-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2016-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
            {"date": "2017-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2017-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 147},
            {"date": "2018-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2018-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2019-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
            {"date": "2019-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2020-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
            {"date": "2020-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2021-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2021-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
            {"date": "2022-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2022-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
            {"date": "2023-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
            {"date": "2023-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2024-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
            {"date": "2024-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
            {"date": "2025-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
            {"date": "2025-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154}//,
//            {"date": "2026-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2026-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2027-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2027-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2028-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2028-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2029-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2029-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2030-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2030-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2031-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2031-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2032-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2032-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2033-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2033-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2034-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2034-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2035-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2035-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2036-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2036-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2037-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2037-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2038-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2038-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2039-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2039-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2040-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2040-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2041-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2041-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2042-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2042-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2043-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2043-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2044-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2044-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2045-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2045-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2046-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2046-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2047-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2047-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2048-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2048-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2049-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2049-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2050-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2050-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2051-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2051-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2052-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2052-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2053-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2053-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2054-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2054-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2055-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2055-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2056-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2056-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2057-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2057-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2058-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2058-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2059-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2059-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2060-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2060-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2061-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2061-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2062-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2062-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2063-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2063-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2064-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2064-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2065-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2065-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2066-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2066-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2067-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2067-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2068-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2068-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2069-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2069-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2070-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2070-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2071-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2071-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2072-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2072-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2073-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2073-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2074-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2074-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2075-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2075-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2076-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2076-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2077-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2077-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2078-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2078-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2079-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2079-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2080-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2080-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2081-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2081-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2082-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2082-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2083-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2083-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2084-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2084-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2085-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2085-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2086-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2086-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2087-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2087-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2088-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2088-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2089-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2089-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2090-03-27T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2090-10-30T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2091-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2091-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2092-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2092-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2093-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2093-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2094-03-29T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2094-11-01T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2095-03-28T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2095-10-31T00:00:00.000Z", "minOffset": -120, "cnt": 147},
//            {"date": "2096-03-26T00:00:00.000Z", "minOffset": -180, "cnt": 217},
//            {"date": "2096-10-29T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2097-04-01T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2097-10-28T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2098-03-31T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2098-10-27T00:00:00.000Z", "minOffset": -120, "cnt": 154},
//            {"date": "2099-03-30T00:00:00.000Z", "minOffset": -180, "cnt": 210},
//            {"date": "2099-10-26T00:00:00.000Z", "minOffset": -120, "cnt": 66}
        ]
        , i = 0
        ;
    while (moment(date).diff(moment(arrayDates[i].date), "days") >= 0) {
        i++;
    }
    if (i > 0) {
        i--;
    }
    return arrayDates[i].minOffset;
};

formatAmount = function (number, groupSeparator, currency, currencyBefore) {
    var theNumber;
    theNumber = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
    if (currencyBefore) {
        theNumber = currency + theNumber;
    } else {
        theNumber = theNumber + currency;
    }
    return theNumber;
};

iif = function (condition, trueExpression, falseExpression) {
    falseExpression = falseExpression ? falseExpression : "";
    return !!condition ? trueExpression : falseExpression;
};

_Log = function (somethingToLog) {
    console.log(somethingToLog);
};


Parse.Cloud.define("test_request", function (q, s) {
    _Log(q);
    s.success({ciphers: crypto.getCiphers(), hashes: crypto.getHashes()});
});

Parse.Cloud.define("test1", function (req, res) {
    var dd = moment(req.params.date).format()
        ;
    res.success({
        moment: dd,
        momentTz: _dateGetRoTimeOffset(dd),
        lastDayNextMonth: moment(dd).add('months', 2).date(1).subtract('days', 1).format("YYYY-MM-DD") + "T00:00:00.000Z",
        lastDayOfThisMonth: moment(dd).add('months', 1).date(1).subtract('days', 1).format("YYYY-MM-DD") + "T00:00:00.000Z"
    });
});

Parse.Cloud.define("test2", function (request, response) {
    response.success({
        applicationId: Parse.applicationId,
        user: request.user
    });
});

Parse.Cloud.define("test3", function (request, response) {
    var userId = request.user
        ;
    response.success(_getAlertDate("2013-12-12T00:00:00.000Z"
        , userId.get("alertDaysBefore")
        , userId.get("alertHour")
        , userId.get("alertOnlyWorkingDays")
    ));
});
Parse.Cloud.define("AddDevice", function (request, response) {
    Parse.Cloud.useMasterKey();
    _AddDevice(request.params.deviceCode,
        request.params.pushCode,
        request.params.timeZone,
        request.params.tags,
        request.params.type).then(function (result) {
            response.success(result.key);
        }, function (error) {
            response.error(error);
        });
});

_GenerateKey = function (token) {
    var key = new Array(16)
        , password
        , cipher, rezult
        , plainText = 'ascii'
        , cipherText = 'base64'
        , algorithm = 'aes-256-cbc'
        ;
    key[0] = key[11] = key[10] = key[9] = "1";
    key[1] = key[12] = key[15] = key[8] = "2";
    key[2] = key[13] = key[14] = key[7] = "3";
    key[3] = key[4] = key[5] = key[6] = "4";
    password = key.join();
    cipher = crypto.createCipher(algorithm, password);
    rezult = cipher.update(token, plainText, cipherText);
    rezult += cipher.final(cipherText);
    return rezult;
};

_AddDevice = function (deviceCode, pushCode, timeZone, tags, type) {
    var promise = new Parse.Promise()
        ;
    var qDevice = new Parse.Query("Device");
    qDevice.equalTo("deviceCode", deviceCode);
    qDevice.equalTo("pushCode", pushCode);
    qDevice.first().then(function (device) {
        if (!device) {
            var Device = Parse.Object.extend("Device");
            device = new Device();
            device.set("deviceCode", deviceCode);
            device.set("pushCode", pushCode);
            device.setACL(_getAdminACL());
        }
        device.set("timeZone", timeZone);
        device.set("tags", tags);
        device.set("type", type);
        device.increment("uses");
        return device.save();
    }).then(function (deviceSaved) {
            if (deviceSaved.get("installationId")) {
                return deviceSaved;
            } else {
                deviceSaved.set("installationId", _GenerateKey(deviceSaved.id));
                return deviceSaved.save();
            }
        }).then(function (deviceFinal) {
            promise.resolve({key: deviceFinal.get("installationId")});
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};

Parse.Cloud.beforeSave("AppJob", function (request, response) {
//    Parse.Cloud.useMasterKey();
    request.object.increment("runCounter");
    response.success();
});

Parse.Cloud.define("JobHistory", function (request, response) {
//    Parse.Cloud.useMasterKey();
    var results = [];
    var qJob = new Parse.Query("AppJob");
    var pageRows = request.params.pageRows
        , pageNo = request.params.pageNo
        ;

    if (!(pageRows)) {
        pageRows = 100;
    }

    if (!(pageNo) || (pageNo < 1)) {
        pageNo = 1;
    }
    qJob.equalTo("name", request.params.name);
    qJob.first().then(function (job) {
        if (job) {
            return {
                jobId: job.id
            }
        } else {
            return Parse.Promise.error("There is no such job or you aren't authenticated!");
        }
    }).then(function (objJob) {
            if (objJob.jobId) {
                var qJH = new Parse.Query("AppJobRunHistory");
                qJH.equalTo("jobIdText", objJob.jobId);
                qJH.skip((pageNo - 1) * pageRows);
                qJH.limit(pageRows);
                qJH.descending("createdAt");
                qJH.include("jobId");
                return qJH.find();
            } else {
                return Parse.Promise.as();
            }
        }).then(function (jobEntries) {
            var promise = Parse.Promise.as();
            _.each(jobEntries, function (jobEntry) {
                var iRow = -1
                    , dS, dE
                    ;
                var rowRet = {
                    job: jobEntry.get("jobId").get("name"),
                    runId: jobEntry.get("runCounter")
                };
                for (var i = 0; i < results.length; i++) {
                    if (results[i].runId == rowRet.runId) {
                        iRow = i;
                        break;
                    }
                }
                if (iRow == -1) {
                    results.push(rowRet);
                    iRow = results.length - 1;
                    results[iRow].errors = [];
                }
                if (jobEntry.get("isSuccess")) {
                    results[iRow].hasSuccess = "Yes";
                    results[iRow].success = JSON.stringify(jobEntry.get("statusObject"));
                }
                if (jobEntry.get("isError")) {
                    results[iRow].hasError = "Yes";
                    results[iRow].errors.push(JSON.stringify(jobEntry.get("statusObject")));
                    results[iRow].errorsCounter = results[iRow].errors.length;
                }
                if (!(results[iRow].start)) {
                    results[iRow].start = moment(jobEntry.createdAt).format("YYYY-MM-DDTHH:mm:ss");
                }
                if (moment(results[iRow].start).diff(moment(jobEntry.createdAt), "seconds") > 0) {
                    results[iRow].start = moment(jobEntry.createdAt).format("YYYY-MM-DDTHH:mm:ss");
                }
                if (!(results[iRow].end)) {
                    results[iRow].end = moment(jobEntry.createdAt).format("YYYY-MM-DDTHH:mm:ss");
                }
                if (moment(jobEntry.createdAt).diff(moment(results[iRow].end), "seconds") > 0) {
                    results[iRow].end = moment(jobEntry.createdAt).format("YYYY-MM-DDTHH:mm:ss");
                }

                dS = results[iRow].start;
                dE = results[iRow].end;

                results[iRow]["durationSeconds"] = moment.duration(moment(dE).diff(moment(dS), 'seconds'), 'seconds')._milliseconds / 1000;
                results[iRow]["duration"] = moment.duration(moment(dE).diff(moment(dS), 'seconds'), 'seconds').humanize();
                if (results[iRow].errors.length == 0) {
                    results[iRow].hasError = "No";
                }
            });
            response.success(results);
        }, function (error) {
            response.error(error);
        });
});


Parse.Cloud.define("JobStatus", function (request, response) {
//    Parse.Cloud.useMasterKey();
    var job = request.params
        , results = []
        ;
    var qJob = new Parse.Query("AppJob");
    if (job.name) {
        qJob.equalTo("name", job.name);
    }
    if (job.nameLike) {
        qJob.contains("name", job.nameLike);
    }
    if (job.nameList) {
        qJob.containedIn("name", job.nameList);
    }
    if (job.orderBy) {
        qJob.ascending(job.orderBy);
    } else {
        qJob.ascending("name");
    }

    qJob.find().then(function (jobs) {
        var promise = Parse.Promise.as()
            ;
        _.each(jobs, function (job) {
            promise = promise.then(function () {
                var jobAdd = {}
                    ;
                jobAdd["id"] = job.id;
                jobAdd["name"] = job.get("name");
                jobAdd["params"] = JSON.stringify(job.get("parameters"));
                jobAdd["iteration"] = job.get("runCounter");
                jobAdd["lastRunStart"] = moment(job.updatedAt).format();
                results.push(jobAdd);
                return jobAdd;
            }).then(function (jobAdd) {
                    var qJh = new Parse.Query("AppJobRunHistory");
                    qJh.equalTo("jobIdText", jobAdd.id);
                    qJh.equalTo("runCounter", jobAdd.iteration);
                    qJh.descending("createdAt");
                    return qJh.first();
                }).then(function (jobHistory) {
                    var jobId = -1
                        ;
                    if (jobHistory) {
                        for (var i = 0; i < results.length; i++) {
                            if (results[i].id == jobHistory.get("jobIdText")) {
                                jobId = i;
                                break;
                            }
                        }
                    }
                    if (jobId > -1) {
                        results[jobId]["lastRunEnd"] = moment(jobHistory.createdAt).format();
                        results[jobId]["lastRunStatus"] = jobHistory.get("status");
                        results[jobId]["lastRunStatusResult"] = JSON.stringify(jobHistory.get("statusObject"));
                    }
                    return Parse.Promise.as();
                }).then(function () {

                })
        });
        return promise;
    }).then(function () {
            for (var i = 0; i < results.length; i++) {
                var dS = results[i].lastRunStart
                    , dE = results[i].lastRunEnd
                    ;
                if ((dS) && (dE)) {
                    results[i]["durationSeconds"] = moment.duration(moment(dE).diff(moment(dS), 'seconds'), 'seconds')._milliseconds / 1000;
                    results[i]["duration"] = moment.duration(moment(dE).diff(moment(dS), 'seconds'), 'seconds').humanize();
                }
            }
            response.success(results);
        }, function (error) {
            response.error(error);
        });
});


var AddJobRunHistory;
AddJobRunHistory = function (request) {
    Parse.Cloud.useMasterKey();
    var promise = new Parse.Promise();
    var NewJobRun = Parse.Object.extend("AppJobRunHistory")
        ;

    NewJobRun = new NewJobRun();
    NewJobRun.set("name", request.name);
    NewJobRun.set("jobId", request.jobId);
    NewJobRun.set("jobIdText", request.jobIdText);
    NewJobRun.set("runCounter", request.runCounter);
    NewJobRun.set("parameters", request.parameters);
    NewJobRun.set("status", request.status);
    NewJobRun.set("statusObject", request.statusObject);
    NewJobRun.set("isSuccess", (request.status == "success"));
    NewJobRun.set("isError", (request.status == "error"));
    NewJobRun.set("isOther", ((request.status != "success") && (request.status != "error")));
    NewJobRun.setACL(_getAdminACL());

    NewJobRun.save().then(function (jrs) {
        promise.resolve({});
    }, function (error) {
        promise.reject(error);
    });
    return promise;
};

var AddJobRunCounter;
AddJobRunCounter = function (request) {
    Parse.Cloud.useMasterKey();
    var jobId
        , jobRunId
        , jobName = request.name
        ;
    var promise = new Parse.Promise();
    var qJob = new Parse.Query("AppJob");
    qJob.equalTo("name", jobName);
    qJob.first().then(function (job) {
        if (job) {
            job.set("parameters", request.parameters);
            return job.save();
        } else {
            var NewJob = Parse.Object.extend("AppJob")
                ;
            NewJob = new NewJob();
            NewJob.set("name", jobName);
            NewJob.set("parameters", request.parameters);
            NewJob.setACL(_getAdminACL());
            return NewJob.save();
        }
    }).then(function (jobSaved) {
            jobId = jobSaved.id;
            jobRunId = jobSaved.get("runCounter");
            return AddJobRunHistory({
                name: jobSaved.get("name"),
                jobId: _parsePointer("AppJob", jobId),
                jobIdText: jobId,
                runCounter: jobRunId,
                parameters: request.parameters,
                status: "start",
                statusObject: {}
            });
        }).then(function (jobHSaved) {
            promise.resolve({
                jobId: jobId,
                jobRunCounter: jobRunId
            });
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};
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
            qMail.greaterThanOrEqualTo("alertDate", _parseDate(minDate));
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
                            return _SendEmail(
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
                                    jobId: _parsePointer("AppJob", jobRunId.jobId),
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
                jobId: _parsePointer("AppJob", jobRunId.jobId),
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
        mailObject.set("subject", "Alerta theBill"+iif(isProduction,""," ( D E V E L O P M E N T )"));
        mailObject.set("body", body);
        return mailObject.save();
    }).then(function (mailSaved) {
            prm.resolve(mailSaved);
        }, function (error) {
            prm.reject(error);
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
    qBill.equalTo("userId", _parsePointer("_User", userId));
    qBill.lessThanOrEqualTo("dueDate", _parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z"));
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

var _SendEmail;
_SendEmail = function (from, fromName, to, toName, subject, body, attachments) {
    var promise = new Parse.Promise();
    var objMail = {
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
                ],
                headers: {
                    "Reply-To": "office@thebill.ro"
                }
            },
            async: true
        }
        ;
    if ((attachments || []).length > 0) {
        objMail.message.attachments = [];
        _.each(attachments, function (attachment) {
            objMail.message.attachments.push({
                type: attachment.type,
                name: attachment.name,
                content: attachment.content
            });
        });
    }
    var Mandrill = require('mandrill');
    Mandrill.initialize('WAteKfECxJyYsjLNqujMug');
    Mandrill.sendEmail(objMail, {
        success: function (httpResponse) {
            promise.resolve({httpResponse: httpResponse});
        },
        error: function (httpResponse) {
            promise.reject({httpResponse: httpResponse});
        }
    });
    return promise;
};



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
            var qtObject = Parse.Object.extend("QuestionType");
            qtObject = new qtObject();
            qtObject.set("name", qt);
            qtObject.set("nameLocale", "type.q-" + qt);
            qtObject.setACL(_getAdminACL());
            return qtObject.save();
        });
    });

    prm = prm.then(function () {
        promise.resolve({});
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


Parse.Cloud.job("DeviceAnalysis", function (request, status) {
    var jobName = "DeviceAnalysis"
        , jobParam = request.params
        , jobRunId
        ;
    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;

            var qDevice = new Parse.Query("Device");
            qDevice.notEqualTo("done", true);
            qDevice.ascending("createdAt");
            qDevice.limit(1000);
            return qDevice.find();
        }).then(function (devices) {
            var promise = Parse.Promise.as();
            _.each(devices, function (device) {
                promise = promise.then(function () {
                    return _DeviceAnalysis(device);
                });
            });
            return promise;
        }).then(function () {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "success",
                statusObject: {result: "ok"}
            }).then(function () {
                    status.success("ok");
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        }, function (error) {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "error",
                statusObject: error
            }).then(function () {
                    status.error(JSON.stringify(error));
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        });
});

_DeviceAnalysis = function (device) {
    var promise = new Parse.Promise()
        ;
    var deviceCode = device.get("deviceCode")
        , pushCode = device.get("pushCode")
        , id = device.id
        , cntDevices = 0
        , cntPush = 0
        ;
    var qDevice = new Parse.Query("Device");
    qDevice.equalTo("deviceCode", deviceCode);
    qDevice.notEqualTo("objectId", id);
    qDevice.count().then(function (cntDevs) {
        cntDevices = cntDevs;
        var qD2 = new Parse.Query("Device");
        qD2.equalTo("pushCode", pushCode);
        qD2.notEqualTo("objectId", id);
        return qD2.count();
    }).then(function (cntPsh) {
            cntPush = cntPsh;
            if (cntDevices > 0) {
                device.set("cntDevice", cntDevices);
            }
            if (cntPush > 0) {
                device.set("cntPush", cntPush);
            }
            device.set("done", true);
            return device.save();
        }).then(function (deviceSaved) {
            promise.resolve({});
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};

Parse.Cloud.job("QuoteChange", function (request, status) {
    var jobName = "QuoteChange"
        , jobParam = request.params
        , jobRunId
        , quoteId
        ;

    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;
            return _GetRandomQuote();
        }).then(function (objQuote) {
            if (objQuote) {
                quoteId = _parsePointer("Quote", objQuote.id);

                var qS = new Parse.Query("QuestionOnLine");
                qS.notEqualTo("isDeleted", true);
                qS.descending("date");
                return qS.first();
            } else {
                return Parse.Promise.as();
            }
        }).then(function (activeQuestion) {
            if (activeQuestion) {
                activeQuestion.set("quoteId", quoteId);
                return activeQuestion.save();
            }
        }).then(function () {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "success",
                statusObject: {result: "ok"}
            }).then(function () {
                    status.success("ok");
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        }, function (error) {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "error",
                statusObject: error
            }).then(function () {
                    status.error(JSON.stringify(error));
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        });
});Parse.Cloud.job("ReSetQuestion", function (request, status) {
    var jobName = "ReSetQuestion"
        , jobParam = request.params
        , jobRunId
        , theDate = _parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z")
//        , qsExisted = false
        , jobResultText = "Existed"
        ;

    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;

            var qS = new Parse.Query("QuestionSelect");
            qS.equalTo("date", theDate);
            qS.notEqualTo("isDeleted", true);
            return qS.first();

        }).then(function (qsFounded) {
            if (qsFounded) {
//                qsExisted = true;
                return Parse.Promise.as();
            } else {
                jobResultText = "NOT Existed";
                return _AddDate(theDate);
            }
        }).then(function () {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "success",
                statusObject: {result: jobResultText}
            }).then(function () {
                    status.success("ok");
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        }, function (error) {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "error",
                statusObject: error
            }).then(function () {
                    status.error(JSON.stringify(error));
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        });
});
Parse.Cloud.job("ResultProcess", function (request, status) {
    var jobName = "ResultProcess"
        , jobParam = request.params
        , jobRunId
        ;
    var cntSuccess = 0
        , cntError = 0
        ;

    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;

            var qVote = new Parse.Query("Vote");
            qVote.notEqualTo("isDeleted", true);
            qVote.notEqualTo("done", true);
            qVote.ascending("createdAt");
            qVote.limit(1000);
            qVote.include("questionId");
            return qVote.find();
        }).then(function (votes) {
            var promise = Parse.Promise.as();
            _.each(votes, function (vote) {
                promise = promise.then(function () {
                    return _ResultProcess(vote);
                }).then(function () {
                        cntSuccess++;
                    }, function (error) {
                        cntError++;
                        return AddJobRunHistory({
                            name: jobName,
                            jobId: _parsePointer("AppJob", jobRunId.jobId),
                            jobIdText: jobRunId.jobId,
                            runCounter: jobRunId.jobRunCounter,
                            parameters: jobParam,
                            status: "error",
                            statusObject: error
                        });
                    });
            });
            return promise;
        }).then(function () {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "success",
                statusObject: {cntSuccess: cntSuccess, cntError: cntError}
            });
        }).then(function () {
            status.success(JSON.stringify({cntSuccess: cntSuccess, cntError: cntError}));
        }, function (error) {
            status.error(JSON.stringify(error));
        });
});

_ResultProcess = function (vote) {
    var promise = new Parse.Promise();
    var cntYes = 0
        , cntNo = 0
        , cntAll = 0
        , cntAdd = 0
        , answer = vote.get("answer") || {}
        , question
        , beforeAnswer
        , results = {}
        ;

    if (answer) {
        if (answer.answer == 1) {
            cntYes++;
        } else {
            cntNo++;
        }
    }

    var qQuestion = new Parse.Query("Question");
    qQuestion.equalTo("objectId", vote.get("questionId").id);
    qQuestion.first().then(function (question) {
        if (question) {
            beforeAnswer = question.get("results") || {};
            if (beforeAnswer.cntYes) {
                cntYes += beforeAnswer.cntYes;
            }
            if (beforeAnswer.cntNo) {
                cntNo += beforeAnswer.cntNo;
            }
            results.cntYes = cntYes;
            results.cntNo = cntNo;
            cntAll = results.cntYes + results.cntNo;

            if ((cntAll < 10) && (moment().diff(moment(question.createdAt), 'hours') <= 12)) {
                results.percentYes = 50;
                results.percentNo = 50;
            } else {
                if (cntAll < 10) {
                    cntYes *= 100;
                    cntNo *= 100;
                } else {
                    if (cntAll < 100) {
                        cntYes *= 10;
                        cntNo *= 10;
                    }
                }
                cntAll = cntYes + cntNo;
                if (cntAll < 1000) {
                    cntAdd = Math.ceil((1000 - cntAll) / 2);
                    cntYes += cntAdd;
                    cntNo += cntAdd;
                    cntAll = cntYes + cntNo;
                }
                results.percentYes = Math.round((cntYes * 100 / cntAll) * 10) / 10;
                results.percentNo = 100 - results.percentYes;
            }
            question.set("results", results);
            return question.save();
        } else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (questionSaved) {
            vote.set("done", true);
            return vote.save();
        }).then(function (voteSaved) {
            promise.resolve({});
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};
Parse.Cloud.job("SetQuestion", function (request, status) {
    var jobName = "SetQuestion"
        , jobParam = request.params
        , jobRunId
        , theDate = _parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z")
        ;

    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;
            return _AddDate(theDate);
        }).then(function () {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "success",
                statusObject: {result: "ok"}
            }).then(function () {
                    status.success("ok");
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        }, function (error) {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "error",
                statusObject: error
            }).then(function () {
                    status.error(JSON.stringify(error));
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        });
});


_AddDate = function (date) {
    var promise = new Parse.Promise()
        , dayId, weekId, monthId, quoteId
        ;
    _GetCurrentQs(date, "day").then(function (retD) {
        if (retD) {
            dayId = _parsePointer("Question", retD.id);
        }
        return _GetCurrentQs(date, "week");
    }).then(function (retW) {
            if (retW) {
                weekId = _parsePointer("Question", retW.id);
            }
            return _GetCurrentQs(date, "month");
        }).then(function (retM) {
            if (retM) {
                monthId = _parsePointer("Question", retM.id);
            }
            return _GetRandomQuote();
        }).then(function (retQuote) {
            if (retQuote) {
                quoteId = _parsePointer("Quote", retQuote.id);
            }
            var qS = new Parse.Query("QuestionSelect");
            qS.equalTo("date", date);
            qS.notEqualTo("isDeleted", true);
            return qS.first();
        }).then(function (activeQuestion) {
            if (!(activeQuestion)) {
                var QT = Parse.Object.extend("QuestionSelect");
                activeQuestion = new QT();
                activeQuestion.set("date", date);
                activeQuestion.setACL(_getAdminACL());
            }
            activeQuestion.increment("updates");
            activeQuestion.set("questionOfDay", dayId);
            activeQuestion.set("questionOfWeek", weekId);
            activeQuestion.set("questionOfMonth", monthId);
            activeQuestion.set("quoteId", quoteId);
            return activeQuestion.save();
        }
    ).then(function (questionSelectUpdated) {
            promise.resolve(questionSelectUpdated);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};


_GetCurrentQs = function (date, type) {
    var promise = new Parse.Promise()
        ;
    var qType = new Parse.Query("QuestionType");
    qType.notEqualTo("isDeleted", true);
    qType.equalTo("name", type);
    var qQuestion = new Parse.Query("Question");
    qQuestion.lessThanOrEqualTo("startDate", date);
    qQuestion.greaterThanOrEqualTo("endDate", date);
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.matchesQuery("typeId", qType);
    qQuestion.descending("startDate");
    qQuestion.descending("updatedAt");
    qQuestion.first().then(function (question) {
        if (question) {
            return question;
        } else {
            return _DuplicateLastQuestion(date, type);
        }
    }).then(function (question) {
            if (question) {
                promise.resolve(question);
            } else {
                promise.reject({
                    date: date,
                    type: type
                });
            }
        },
        function (error) {
            promise.reject({
                error: error,
                date: date,
                type: type
            })
        }
    );
    return promise;
};

_DuplicateLastQuestion = function (date, type) {
    var promise = new Parse.Promise()
        ;
    var question
        ;
    var qType = new Parse.Query("QuestionType");
    qType.notEqualTo("isDeleted", true);
    qType.equalTo("name", type);
    var qQuestion = new Parse.Query("Question");
    qQuestion.lessThanOrEqualTo("endDate", date);
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.matchesQuery("typeId", qType);
    qQuestion.descending("startDate");
    qQuestion.descending("updatedAt");
    qQuestion.include("typeId");
    qQuestion.first().then(function (qFound) {
        if (qFound) {
            question = qFound;
            return _ValidateDate(question.get("typeId").get("name"), moment().format("YYYY-MM-DD"));
        } else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (objDates) {
            return _AdminQuestion(null, null, question.get("categoryId"), question.get("typeId"), question.get("subject"), question.get("body"), question.get("link"), objDates.startDate, objDates.endDate);
        }).then(function (questionSaved) {
            questionSaved.set("questionId", question);
            return questionSaved.save();
        }).then(function (newQuestion) {
            promise.resolve(newQuestion);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};

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


Parse.Cloud.job("SetQuestion_0101", function (request, status) {
    var jobName = "ReSetQuestion_0101"
        , jobParam = request.params
        , jobRunId
        , theDate = _parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z")
//        , qsExisted = false
        , jobResultText = "Existed"
        ;

    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;

            var qS = new Parse.Query("QuestionOnLine");
            qS.equalTo("date", theDate);
            qS.notEqualTo("isDeleted", true);
            return qS.first();

        }).then(function (qsFounded) {
            if (qsFounded) {
//                qsExisted = true;
                return Parse.Promise.as();
            } else {
                jobResultText = "NOT Existed";
                return _AddDateCateg(theDate);
            }
        }).then(function () {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "success",
                statusObject: {result: jobResultText}
            }).then(function () {
                    status.success("ok");
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        }, function (error) {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "error",
                statusObject: error
            }).then(function () {
                    status.error(JSON.stringify(error));
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        });
});

/*
Parse.Cloud.job("SetQuestion_0101", function (request, status) {
    var jobName = "SetQuestion"
        , jobParam = request.params
        , jobRunId
        , theDate = _parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z")
        ;

    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;
            return _AddDateCateg(theDate);
        }).then(function () {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "success",
                statusObject: {result: "ok"}
            }).then(function () {
                    status.success("ok");
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        }, function (error) {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "error",
                statusObject: error
            }).then(function () {
                    status.error(JSON.stringify(error));
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        });
});
*/

_AddDateCateg = function (date) {
    var promise = new Parse.Promise()
        , prm = Parse.Promise.as()
        , qs = []
        , quoteId
        ;
    _.each(HotQCategory, function (category) {
        prm = prm.then(function () {
            return _GetCurrentQCat(date, category.nameLocale, "type.q-day")
        }).then(function (question) {
                qs.push(question);
            });
    });
    prm = prm.then(function () {
        return _GetRandomQuote();
    }).then(function (retQuote) {
            if (retQuote) {
                quoteId = _parsePointer("Quote", retQuote.id);
            }
            var qS = new Parse.Query("QuestionOnLine");
            qS.equalTo("date", date);
            qS.notEqualTo("isDeleted", true);
            return qS.first();
        }).then(function (activeQuestion) {
            if (!(activeQuestion)) {
                var QT = Parse.Object.extend("QuestionOnLine");
                activeQuestion = new QT();
                activeQuestion.set("date", date);
                activeQuestion.setACL(_getAdminACL());
            }
            activeQuestion.increment("updates");
            for (var i = 0; i < 10; i++) {
                var column = "questionC" + (i + 1).toString() + "Id";
                if (qs[i]) {
                    activeQuestion.set(column, qs[i]);
                }
            }
            activeQuestion.set("quoteId", quoteId);
            return activeQuestion.save();
        }).then(function (questionOnLineUpdated) {
            promise.resolve(questionOnLineUpdated);
        }, function (error) {
            promise.reject(error);
        });
    return promise;

};


_GetCurrentQCat = function (date, category, type) {
    var promise = new Parse.Promise()
        ;
    var qCat = new Parse.Query("QuestionCategory");
    qCat.notEqualTo("isDeleted", true);
    qCat.equalTo("nameLocale", category);
    var qType = new Parse.Query("QuestionType");
    qType.notEqualTo("isDeleted", true);
    qType.equalTo("nameLocale", type);
    var qQuestion = new Parse.Query("Question");
    qQuestion.lessThanOrEqualTo("startDate", date);
    qQuestion.greaterThanOrEqualTo("endDate", date);
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.matchesQuery("typeId", qType);
    qQuestion.matchesQuery("categoryId", qCat);
    qQuestion.descending("startDate");
    qQuestion.descending("updatedAt");
    qQuestion.first().then(function (question) {
        if (question) {
            return question;
        } else {
            return _DuplLastQuestion(date, category, type);
        }
    }).then(function (question) {
            if (question) {
                promise.resolve(question);
            } else {
                promise.reject({
                    date: date,
                    type: type
                });
            }
        },
        function (error) {
            promise.reject({
                error: error,
                date: date,
                type: type
            })
        }
    );
    return promise;
};

_DuplLastQuestion = function (date, category, type) {
    var promise = new Parse.Promise()
        ;
    var question
        ;
    var qType = new Parse.Query("QuestionType");
    qType.notEqualTo("isDeleted", true);
    qType.equalTo("nameLocale", type);
    var qCat = new Parse.Query("QuestionCategory");
    qCat.notEqualTo("isDeleted", true);
    qCat.equalTo("nameLocale", category);
    var qQuestion = new Parse.Query("Question");
    qQuestion.lessThanOrEqualTo("endDate", date);
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.matchesQuery("typeId", qType);
    qQuestion.matchesQuery("categoryId", qCat);
    qQuestion.descending("startDate");
    qQuestion.descending("updatedAt");
    qQuestion.include("typeId");
    qQuestion.first().then(function (qFound) {
        if (qFound) {
            question = qFound;
            return _ValidateDate(question.get("typeId").get("name"), moment().format("YYYY-MM-DD"));
        } else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (objDates) {
            return _AdminQuestion(null, null, question.get("categoryId"), question.get("typeId"), question.get("subject"), question.get("body"), question.get("link"), objDates.startDate, objDates.endDate);
        }).then(function (questionSaved) {
            questionSaved.set("questionId", question);
            return questionSaved.save();
        }).then(function (newQuestion) {
            promise.resolve(newQuestion);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};
Parse.Cloud.job("VoteProcess", function (request, status) {
    var jobName = "VoteProcess"
        , jobParam = request.params
        , jobRunId
        ;
    Parse.Cloud.useMasterKey();
    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;

            var qVoteLog = new Parse.Query("VoteLog");
            qVoteLog.notEqualTo("isDeleted", true);
            qVoteLog.doesNotExist("status");
            qVoteLog.ascending("createdAt");
            qVoteLog.limit(1000);
            return qVoteLog.find();

        }).then(function (votes) {
            var promise = Parse.Promise.as();
            _.each(votes, function (vote) {
                promise = promise.then(function () {
                    return _VoteSaveFirst(vote);
                });
            });
            return promise;
        }).then(function (qTSaved) {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "success",
                statusObject: {result: "ok"}
            }).then(function () {
                    status.success("ok");
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        }, function (error) {
            return AddJobRunHistory({
                name: jobName,
                jobId: _parsePointer("AppJob", jobRunId.jobId),
                jobIdText: jobRunId.jobId,
                runCounter: jobRunId.jobRunCounter,
                parameters: jobParam,
                status: "error",
                statusObject: error
            }).then(function () {
                    status.error(JSON.stringify(error));
                }, function (error) {
                    status.error(JSON.stringify(error));
                });
        });
});

_VoteSaveFirst = function (log) {
    var promise = new Parse.Promise()
        ;
    var installationId = log.get("installationId")
        , questionId = log.get("questionId").id
        , answer = log.get("answer")
        , date = log.createdAt
        ;
    _VoteSave(installationId, questionId, answer, date).then(function (voteSaved) {
        log.set("status", "ok");
        log.set("isSuccess", true);
        log.set("voteId", voteSaved);
        log.save().then(function () {
            promise.resolve();
        });
    }, function (respKo) {
        log.set("status", JSON.stringify(respKo));
        log.set("isSuccess", false);
        log.save().then(function () {
            promise.resolve();
        });
    });
    return promise;
};

_VoteSave = function (installationId, questionId, answer, voteDate) {
    var promise = new Parse.Promise()
        , questionObject
        , deviceObject
        , duplicate = false
        , voteDateTest
        ;

    voteDateTest = moment(voteDate).format("YYYY-MM-DD") + "T00:00:00.000Z";

    var qQ = new Parse.Query("Question");
    qQ.equalTo("objectId", questionId);
    qQ.first().then(function (question) {
        if (question) {
            // verific sa fie valabila
            if (moment(voteDateTest).diff(moment(question.get("startDate")), 'milliseconds') >= 0 &&
                moment(voteDateTest).diff(moment(question.get("endDate")), 'milliseconds') <= 0 && !question.get("isDeleted")
                ) {
                questionObject = question;
                var qDevice = new Parse.Query("Device");
                qDevice.equalTo("installationId", installationId);
                qDevice.notEqualTo("isDeleted", true);
                return qDevice.first();
            } else {
                return Parse.Promise.error("error.question-not-available");
            }
        } else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (device) {
            if (device) {
                deviceObject = device;
                var qVote = new Parse.Query("Vote");
                qVote.equalTo("questionId", questionObject);
                qVote.equalTo("installationId", deviceObject);
                qVote.notEqualTo("isDeleted", true);
                return qVote.first();
            } else {
                return Parse.Promise.error("error.device-not-found");
            }
        }).then(function (vote) {
            if (vote) {
                vote.increment("counter");
                duplicate = true;
                return vote.save();
            } else {
                var Vote = Parse.Object.extend("Vote");
                Vote = new Vote();
                Vote.set("questionId", questionObject);
                Vote.set("deviceId", deviceObject);
                Vote.set("voteDate", voteDate);
                Vote.set("answer", answer);
                Vote.setACL(_getAdminACL());
                return Vote.save();
            }
        }).then(function (voteSaved) {
            if (duplicate) {
                return Parse.Promise.error("error.vote-already-exists");
            } else {
                return voteSaved;
            }
        }).then(function (voteSaved) {
            promise.resolve(voteSaved);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};

Parse.Cloud.define("QuestionAdmin", function (request, response) {
    var thisUser = request.user
        , param = request.params
        , categoryObject
        , typeObject
        , startDate
        , endDate
        ;
    if (thisUser) {
        if (param.text1 && param.text2 && param.category && param.type && param.startDate) {
            _ValidateCategory(param.category).then(function (categoryId) {
                categoryObject = categoryId;
                return _ValidateType(param.type);
            }).then(function (typeId) {
                    typeObject = typeId;
                    return _ValidateDate(typeId.get("name"), param.startDate);
                }).then(function (objDates) {
                    startDate = objDates.startDate;
                    endDate = objDates.endDate;

                    return _AdminQuestion(thisUser, param.id, categoryObject, typeObject, param.text1, param.text2, param.link, startDate, endDate, param.imageSource);
                }).then(function (questionSaved) {
                    response.success(questionSaved);
                }, function (error) {
                    response.error(error);
                })
        } else {
            response.error("question.insufficient-data");
        }
    } else {
        response.error("error.user-not-found");
    }
});

_AdminQuestion = function (user, id, categoryId, typeId, subject, body, link, startDate, endDate, imageSource) {
    var promise = new Parse.Promise()
        ;
    if (!(id)) {
        id = "new";
    }
    var qQuestion = new Parse.Query("Question");
    qQuestion.equalTo("objectId", id);
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.first().then(function (question) {
        if (!question) {
            var Question = Parse.Object.extend("Question");
            question = new Question();
        }
        question.set("categoryId", categoryId);
        question.set("typeId", typeId);
        question.set("subject", subject);
        question.set("body", body);
        question.set("link", link);
        question.set("startDate", _parseDate(startDate));
        question.set("endDate", _parseDate(endDate));
        question.set("imageSource", imageSource);
        question.setACL(_getUserACL(user));
        return question.save();
    }).then(function (saved) {
            promise.resolve(saved);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};

_ValidateDate = function (typeText, startDate) {
    var promise = new Parse.Promise()
        , prm = Parse.Promise.as()
        ;

    var dNewStart
        , dNewEnd
        , dD
        ;
    prm = prm.then(function () {
        startDate = moment(startDate).format("YYYY-MM-DD") + "T00:00:00.000Z";
        switch (typeText) {
            case "day":
                dNewStart = startDate;
                dNewEnd = startDate;
                break;
            case  "week":
                dD = moment(startDate);
                dNewStart = dD.subtract("days", iif(dD.day() > 0, dD.day() - 1, 6)).format("YYYY-MM-DD") + "T00:00:00.000Z";
                dNewEnd = moment(dNewStart).add("days", 6).format("YYYY-MM-DD") + "T00:00:00.000Z";
                break;
            case "month":
                dD = moment(startDate);
                dNewStart = dD.date(1).format("YYYY-MM-DD") + "T00:00:00.000Z";
                dNewEnd = moment(dNewStart).add("months", 1).subtract("days", 1).format("YYYY-MM-DD") + "T00:00:00.000Z";
                break;
            default:
                return Parse.Promise.error("error.invalid-type");
        }
        return {startDate: dNewStart, endDate: dNewEnd};
    }).then(function (result) {
            promise.resolve(result);
        }, function (error) {
            promise.reject(error);
        });
    return promise;
};

_ValidateType = function (type) {
    var promise = new Parse.Promise()
        ;
    var qType = new Parse.Query("QuestionType");
    qType.equalTo("name", type);
    qType.notEqualTo("isDeleted", true);
    qType.first().then(function (type) {
        if (type) {
            promise.resolve(type);
        } else {
            promise.reject("error.invalid-type");
        }
    }, function (error) {
        promise.reject(error);
    });
    return promise;
};

_ValidateCategory = function (category) {
    var promise = new Parse.Promise()
        ;
    var qCategory = new Parse.Query("QuestionCategory");
    qCategory.equalTo("name", category);
    qCategory.notEqualTo("isDeleted", true);
    qCategory.first().then(function (category) {
        if (category) {
            promise.resolve(category);
        } else {
            promise.reject("error.invalid-category");
        }
    }, function (error) {
        promise.reject(error);
    });
    return promise;
};

Parse.Cloud.define("GetListQuestions", function (request, response) {
    Parse.Cloud.useMasterKey();
    var results = []
        , startDate
        , endDate
        ;
    endDate = moment().subtract('days', 1).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    startDate = moment(endDate).subtract('days', 31).format('YYYY-MM-DD') + 'T00:00:00.000Z';

    var qQuestion = new Parse.Query("Question");
    qQuestion.notEqualTo("isDeleted", true);
    qQuestion.greaterThanOrEqualTo('startDate', _parseDate(startDate));
    qQuestion.lessThanOrEqualTo('startDate', _parseDate(endDate));
    qQuestion.include("categoryId,typeId");
    qQuestion.descending("startDate");
    qQuestion.find().then(function (questions) {
        var indice = 0;
        _.each(questions, function (question) {
            var startDate = question.get("startDate")
                , endDate = question.get("endDate")
                ;
            var objToAdd = {
                index: ++indice,
                id: question.id,
                category: question.get("categoryId").get("name"),
                type: question.get("typeId").get("name"),
                typeLocale: question.get("typeId").get("nameLocale"),
                text1: question.get("subject"),
                text2: question.get("body"),
//                startDate: moment(question.get("startDate")).format("YYYY,M,D"),
//                endDate: moment(question.get("endDate")).format("YYYY,M,D"),
                resultPercentYes: question.get("results") ? question.get("results").percentYes ? question.get("results").percentYes : 50 : 50
            };
            objToAdd.resultPercentNo = 100 - objToAdd.resultPercentYes;
            objToAdd.period = "unknown";
            if (objToAdd.type == "day") {
                objToAdd.period = moment(startDate).format("D MMMM YYYY");
            } else {
                if (objToAdd.type == "week") {
                    objToAdd.period = moment(startDate).format("D") +
                        iif(moment(startDate).format("M") == moment(endDate).format("M"), "", moment(startDate).format(" MMMM")) +
                        iif(moment(startDate).format("YY") == moment(endDate).format("YY"), "", moment(startDate).format(" YYYY")) +
                        " - " + moment(endDate).format("D MMMM YYYY");
                } else {
                    objToAdd.period = moment(startDate).format("MMMM YYYY");
                }
            }
            results.push(objToAdd);
        });
        response.success(results);
    }, function (error) {
        response.error(error);
    });
});/**
 *  Atentie!!!!!
 *  Aplicatia mobila lanseaza GetQuestionsNew
 *




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


 *
 *
 *
 * *//**
 *
 * * * * * * * * * * * * * * * *
 *                             *
 *    N E U T I L I Z A T A    *
 *                             *
 * * * * * * * * * * * * * * * *
 *
 * */
Parse.Cloud.define("GetQuestions4Site", function (request, response) {
    var theDate
        , result = {}
        ;
    Parse.Cloud.useMasterKey();
    if (request.params.date) {
        theDate = moment(request.params.date).format("YYYY-MM-DD") + "T00:00:00.000Z";
    } else {
        theDate = moment().format("YYYY-MM-DD") + "T00:00:00.000Z";
    }
    var qQ = new Parse.Query("QuestionSelect");
    qQ.equalTo("date", _parseDate(theDate));
    qQ.notEqualTo("isDeleted", true);
    qQ.include("questionOfDay.categoryId,questionOfWeek.categoryId,questionOfMonth.categoryId");
    qQ.descending("createdAt");
    qQ.first().then(function (qT) {
        result.date = moment(theDate).format("YYYY-MM-DD");
        if (qT) {
            result.questionOfDay = {id: "0", category: "unknown", text1: "", text2: "", link: "", picture: "", percentYes: 100, percentNo: 0};
            if (qT.get("questionOfDay")) {
                result.questionOfDay.id = qT.get("questionOfDay").id;
                result.questionOfDay.category = qT.get("questionOfDay").get("categoryId").get("name");
                result.questionOfDay.text1 = qT.get("questionOfDay").get("subject");
                result.questionOfDay.text2 = qT.get("questionOfDay").get("body");
                result.questionOfDay.link = qT.get("questionOfDay").get("link");
                result.questionOfDay.picture = qT.get("questionOfDay").get("imageFile");
                result.questionOfDay.percentYes = qT.get("questionOfDay").get("results") ? qT.get("questionOfDay").get("results").percentYes ? qT.get("questionOfDay").get("results").percentYes : 50 : 50;
                result.questionOfDay.percentNo = 100 - result.questionOfDay.percentYes;
            }

            result.questionOfWeek = {id: "0", category: "unknown", text1: "", text2: "", link: "", picture: "", percentYes: 100, percentNo: 0};
            if (qT.get("questionOfWeek")) {
                result.questionOfWeek.id = qT.get("questionOfWeek").id;
                result.questionOfWeek.category = qT.get("questionOfWeek").get("categoryId").get("name");
                result.questionOfWeek.text1 = qT.get("questionOfWeek").get("subject");
                result.questionOfWeek.text2 = qT.get("questionOfWeek").get("body");
                result.questionOfWeek.link = qT.get("questionOfWeek").get("link");
                result.questionOfWeek.picture = qT.get("questionOfWeek").get("imageFile");
                result.questionOfWeek.percentYes = qT.get("questionOfWeek").get("results") ? qT.get("questionOfWeek").get("results").percentYes ? qT.get("questionOfWeek").get("results").percentYes : 50 : 50;
                result.questionOfWeek.percentNo = 100 - result.questionOfWeek.percentYes;
            }

            result.questionOfMonth = {id: "0", category: "unknown", text1: "", text2: "", link: "", picture: "", percentYes: 100, percentNo: 0};
            if (qT.get("questionOfMonth")) {
                result.questionOfMonth.id = qT.get("questionOfMonth").id;
                result.questionOfMonth.category = qT.get("questionOfMonth").get("categoryId").get("name");
                result.questionOfMonth.text1 = qT.get("questionOfMonth").get("subject");
                result.questionOfMonth.text2 = qT.get("questionOfMonth").get("body");
                result.questionOfMonth.link = qT.get("questionOfMonth").get("link");
                result.questionOfMonth.picture = qT.get("questionOfMonth").get("imageFile");
                result.questionOfMonth.percentYes = qT.get("questionOfMonth").get("results") ? qT.get("questionOfMonth").get("results").percentYes ? qT.get("questionOfMonth").get("results").percentYes : 50 : 50;
                result.questionOfMonth.percentNo = 100 - result.questionOfMonth.percentYes;
            }
            return Parse.Promise.as();
        }
        else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (rez) {
            if (moment().diff(moment(theDate), 'days') > 31) {
                return Parse.Promise.error("error.history-not-found");
            } else {
                return Parse.Promise.as();
            }
        }).then(function (rez) {
            response.success(result);
        }, function (error) {
            response.error(error);
        });
})
;
/**
 *
 *   Eliminat incepand cu 1.1
 *
 */
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
            quoteObject.set("imageSource", quote.imageSource);
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
                response.success(quoteRet);
            }, function (error) {
                response.error(JSON.stringify(error));
            })
    } else {
        response.error("error.user-not-found");
    }
});
Parse.Cloud.define("UserQuestionSubmit", function (request, response) {
    var questionContent = request.params.questionContent
        , tricks = request.params.tricks
        , UserQuestion = Parse.Object.extend("UserQuestion")
        ;
    Parse.Cloud.useMasterKey();
    UserQuestion = new UserQuestion();
    UserQuestion.set("questionContent", questionContent);
    UserQuestion.set("tricks", tricks);
    UserQuestion.setACL(_getAdminACL());
    UserQuestion.save().then(function (userQuestion) {
        response.success(userQuestion.id);
    }, function (error) {
        response.error(JSON.stringify(error));
    });
});

Parse.Cloud.define("VoteSubmit", function (request, response) {
    var installationId = request.params.installationId
        , questionId = request.params.questionId
        , answer = request.params.answer
        , position = request.params.position
        , demographics = request.params.demographics
        , tags = request.params.tags
        , version = request.params.version
        , timeZone = request.params.timeZone
        , type
        ;
    Parse.Cloud.useMasterKey();
    var qQuestion = new Parse.Query("Question");
    qQuestion.equalTo("objectId", questionId);
    qQuestion.include("typeId");
    qQuestion.first().then(function (question) {
        if (question) {
            type = question.get("typeId").get("name");
            var VoteLog = Parse.Object.extend("VoteLog");
            VoteLog = new VoteLog();
            VoteLog.set("questionId", _parsePointer("Question", questionId));
            VoteLog.set("installationId", installationId);
            VoteLog.set("answer", answer);
            VoteLog.set("position", position);
            VoteLog.set("demographics", demographics);
            VoteLog.set("tags", tags);
            VoteLog.set("version", version);
            VoteLog.set("timeZone", timeZone);
            VoteLog.setACL(_getAdminACL());
            return VoteLog.save()
        } else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (voteLog) {
            response.success({success: iif(type == "day", "questionOfDay", iif(type == "week", "questionOfWeek", "questionOfMonth"))});
        }, function (error) {
            response.error(JSON.stringify(error));
        });
});
