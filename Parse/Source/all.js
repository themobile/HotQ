//TODO: atentie la toate Query-urile: limit este default 100 si maxim 1000 - la un moment dat trebe tinut cont de asta

//todo: table de quotes
//todo: functie de intors aleator un quotes



var moment = require('moment')
    , _ = require('underscore')
    ;
//require('cloud/app.js');

var theBillSecretKey = 'v0]w?I)2~T~S[6n0(z0*';
var crypto = require('crypto');
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

var parsePointer;
parsePointer = function (className, objectId) {
    var objPointer = {};
    objPointer["__type"] = "Pointer";
    objPointer["className"] = className;
    objPointer["objectId"] = objectId;
    return objPointer;
};
var parseDate;
parseDate = function (stringDate) {
    var objDate = {};
    objDate["__type"] = "Date";
    objDate["iso"] = stringDate;
    return objDate;
};
var holidayTable;
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
        }
    ];
var dateIsHoliDay;
dateIsHoliDay = function (date) {
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
var dateIsWorkingDay;
dateIsWorkingDay = function (date) {
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
var dateGetRoTimeOffset;
dateGetRoTimeOffset = function (date) {
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

var formatAmount;
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

var iif;
iif = function (condition, trueExpression, falseExpression) {
    falseExpression = falseExpression ? falseExpression : "";
    return !!condition ? trueExpression : falseExpression;
};

Parse.Cloud.define("test1", function (req, res) {
    var dd = moment()
        , d = moment(req.params.data)
        ;
    res.success({
        moment: dd.format(),
        date: dd.date(),
        day: dd.day(),
        cat_sa_scad: iif(dd.day() > 0, dd.day() - 1, 6),
        luni: dd.subtract("days", iif(dd.day() > 0, dd.day() - 1, 6)).format(),
        luni_d: d.subtract("days", iif(d.day() > 0, d.day() - 1, 6)).format(),
        momentTz: dateGetRoTimeOffset(dd),
        dt1: dd.date(1).format(),
        dt10: dd.date(20).format()
    });
})
;

