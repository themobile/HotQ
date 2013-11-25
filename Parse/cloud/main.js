//TODO: atentie la toate Query-urile: limit este default 100 si maxim 1000 - la un moment dat trebe tinut cont de asta

//todo: table de quotes
//todo: functie de intors aleator un quotes - in clasa de quotes am o coloana de tip identity (se incarca dintr-o alta clasa dedicata secventelor);
//todo: in cazul ca ultima intrebare nu este din data cutenta atunci o duplic
//todo: la validarea votului trebe sa salvez si data primului vot
//todo: de primit la salvarea votului un obiect de geolocatie

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
});


Parse.Cloud.define("test2", function (request, response) {
    Parse.Cloud.useMasterKey();
    var x = new Parse.Query("_Installation");
    x.find().then(function (rez) {
        response.success(rez);
    }, function (error) {
        response.error(error);
    });
});


Parse.Cloud.define("test3", function (request, response) {
    Parse.Cloud.useMasterKey();
    var q = new Parse.Query("Vote");
    q.equalTo("installationId", parsePointer("_Installation", "ezljyA7ITD"));
    q.equalTo("questionId", parsePointer("Question", "OHnYCdQrI1"));
    q.first().then(function (rez) {

        response.success(rez);
    });
});

Parse.Cloud.define("test4", function (request, response) {
    Parse.Cloud.useMasterKey();
    _GetVote("ezljyA7ITD", "OHnYCdQrI1").then(function (rez) {
        response.success(rez);
    }, function (error) {
        response.error(error);
    });
});



Parse.Cloud.beforeSave("AppJob", function (request, response) {
    Parse.Cloud.useMasterKey();
    request.object.increment("runCounter");
    response.success();
});

Parse.Cloud.define("JobHistory", function (request, response) {
    Parse.Cloud.useMasterKey();
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
            return Parse.Promise.error("There is no such job.");
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
    Parse.Cloud.useMasterKey();
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
        , pACL = new Parse.ACL()
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

    pACL.setRoleReadAccess("Administrators", true);
    pACL.setRoleWriteAccess("Administrators", true);
    NewJobRun.setACL(pACL);
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
                , pACL = new Parse.ACL()
                ;
            pACL.setRoleReadAccess("Administrators", true);
            pACL.setRoleWriteAccess("Administrators", true);

            NewJob = new NewJob();
            NewJob.set("name", jobName);
            NewJob.set("parameters", request.parameters);
            NewJob.setACL(pACL);
            return NewJob.save();
        }
    }).then(function (jobSaved) {
            jobId = jobSaved.id;
            jobRunId = jobSaved.get("runCounter");
            return AddJobRunHistory({
                name: jobSaved.get("name"),
                jobId: parsePointer("AppJob", jobId),
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
Parse.Cloud.job("SetQuestion", function (request, status) {
    var jobName = "SetQuestion"
        , jobParam = request.params
        , jobRunId
        , theDate = parseDate(moment().format("YYYY-MM-DD") + "T00:00:00.000Z")
        , dayId, weekId, monthId
        ;

    Parse.Cloud.useMasterKey();


    AddJobRunCounter({
        name: jobName,
        parameters: jobParam
    }).then(function (jobRun) {
            jobRunId = jobRun;

            return _GetCurentQs(theDate, "day");
        }).then(function (retD) {
            if (retD) {
                dayId = parsePointer("Question", retD.id);
            }
            return _GetCurentQs(theDate, "week");
        }).then(function (retW) {
            if (retW) {
                weekId = parsePointer("Question", retW.id);
            }
            return _GetCurentQs(theDate, "month");
        }).then(function (retM) {
            if (retM) {
                monthId = parsePointer("Question", retM.id);
            }
            var qS = new Parse.Query("QuestionSelect");
            qS.equalTo("date", theDate);
            qS.notEqualTo("isDeleted", true);
            return qS.first();
        }).then(function (qT) {
            if (qT) {
                qT.increment("updates");
                qT.set("questionOfDay", dayId);
                qT.set("questionOfWeek", weekId);
                qT.set("questionOfMonth", monthId);
                return qT.save();
            } else {
                var QT = Parse.Object.extend("QuestionSelect");
                QT = new QT();
                QT.set("date", theDate);
                QT.set("questionOfDay", dayId);
                QT.set("questionOfWeek", weekId);
                QT.set("questionOfMonth", monthId);
                return QT.save();
            }
        }).then(function (qTSaved) {
            return AddJobRunHistory({
                name: jobName,
                jobId: parsePointer("AppJob", jobRunId.jobId),
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
                jobId: parsePointer("AppJob", jobRunId.jobId),
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

var _GetCurentQs;
_GetCurentQs = function (date, type) {
    var promise = new Parse.Promise()
        ;
    var qType = new Parse.Query("QuestionType");
    qType.notEqualTo("isDeleted", true);
    qType.equalTo("name", type);

    var qQ1 = new Parse.Query("Question")
        , qQ2 = new Parse.Query("Question")
        , qQ
        ;
    qQ1.lessThanOrEqualTo("startDate", date);
    qQ1.greaterThanOrEqualTo("endDate", date);
    qQ2.lessThanOrEqualTo("endDate", date);
    qQ = Parse.Query.or(qQ1, qQ2);
    qQ.notEqualTo("isDeleted", true);
    qQ.matchesQuery("typeId", qType);
    qQ.descending("startDate");
    qQ.descending("updatedAt");
    qQ.first().then(function (q) {
        if (q) {
            promise.resolve(q)
        } else {
            promise.reject({
                date: date,
                type: type
            })
        }
    }, function (error) {
        promise.reject({
            error: error,
            date: date,
            type: type
        })
    });

    return promise;
};Parse.Cloud.job("VoteProcess", function (request, status) {
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
                jobId: parsePointer("AppJob", jobRunId.jobId),
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
                jobId: parsePointer("AppJob", jobRunId.jobId),
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


var _VoteSaveFirst;
_VoteSaveFirst = function (log) {
    var promise = new Parse.Promise()
        ;
    var inst = log.get("installationId")
        , quest = log.get("questionId").id
        , answ = log.get("answer")
        , date = log.createdAt
        ;
    _VoteSave(inst, quest, answ, date).then(function (voteSaved) {
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

var _VoteSave;
_VoteSave = function (installationId, questionId, answer, voteDate) {
    var promise = new Parse.Promise()
        , questionObject
        , installationObject
        , duplicate = false
        , voteDateTest
        ;

    voteDateTest = moment(voteDate).format("YYYY-MM-DD") + "T00:00:00.000Z";
//
//    console.log(" unu ");
//    console.log(voteDateTest);
//    console.log(moment(voteDateTest).format());
//    console.log(" doi ");
//    console.log(voteDate);
//    console.log(moment(voteDate).format());
//    console.log(" trei ");

    var qQ = new Parse.Query("Question");
    qQ.equalTo("objectId", questionId);
    qQ.first().then(function (question) {
        if (question) {
            // verific sa fie valabila
            if (moment(voteDateTest).diff(moment(question.get("startDate")), 'milliseconds') >= 0 &&
                moment(voteDateTest).diff(moment(question.get("endDate")), 'milliseconds') <= 0 && !question.get("isDeleted")
                ) {
                questionObject = question;
                var qInstallation = new Parse.Query("_Installation");
                qInstallation.equalTo("installationId", installationId);
                qInstallation.notEqualTo("isDeleted", true);
                return qInstallation.first();
            } else {
                return Parse.Promise.error("error.question-not-available");
            }
        } else {
            return Parse.Promise.error("error.question-not-found");
        }
    }).then(function (installation) {
            if (installation) {
                installationObject = installation;
                var qVote = new Parse.Query("Vote");
                qVote.equalTo("questionId", questionObject);
                qVote.equalTo("installationId", installation);
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
                Vote.set("installationId", installationObject);
                Vote.set("voteDate", voteDate);
                Vote.set("answer", answer);
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

Parse.Cloud.beforeSave("Question", function (request, response) {
    var q = request.object
        , startDate = q.get("startDate")
        , d
        ;

    if (!(startDate)) {
        q.set("startDate", parseDate(moment().format()));
    }

    q.set("startDate", parseDate(moment(startDate).format("YYYY-MM-DD") + "T00:00:00.000Z"));
    startDate = q.get("startDate");

    var qType = new Parse.Query("QuestionType")
        , typeTest = "inexistent"
        ;
    if (q.get("typeId")) {
        typeTest = q.get("typeId").id;
    }
    qType.equalTo("objectId", typeTest);
    qType.first().then(function (type) {
            if (type) {
                if (type.get("name") == "day") {
                    q.set("endDate", startDate)
                } else {
                    if (type.get("name") == "week") {
                        d = moment(startDate);
                        q.set("startDate", parseDate(d.subtract("days", iif(d.day() > 0, d.day() - 1, 6)).format("YYYY-MM-DD") + "T00:00:00.000Z"));
                        startDate = q.get("startDate");
                        q.set("endDate", parseDate(moment(startDate).add("days", 6).format("YYYY-MM-DD") + "T00:00:00.000Z"));
                    } else {
                        if (type.get("name") == "month") {
                            d = moment(startDate);
                            q.set("startDate", parseDate(d.date(1).format("YYYY-MM-DD") + "T00:00:00.000Z"));
                            startDate = q.get("startDate");
                            q.set("endDate", parseDate(moment(startDate).add("months", 1).subtract("days", 1).format("YYYY-MM-DD") + "T00:00:00.000Z"));
                        }
                    }
                }
            }
            else {
                return Parse.Promise.error("error.invalid-type");
            }
            return Parse.Promise.as();
        }
    ).then(function () {
            response.success();
        }, function (error) {
            response.error(error);
        });
});Parse.Cloud.define("GetQuestions", function (request, response) {
    var theDate
        , installationId
        , result = {}
        ;
    Parse.Cloud.useMasterKey();

    if (request.params.date) {
        theDate = moment(request.params.date).format("YYYY-MM-DD") + "T00:00:00.000Z";
    } else {
        theDate = moment().format("YYYY-MM-DD") + "T00:00:00.000Z";
    }

    var qInst = new Parse.Query("_Installation");
    qInst.equalTo("installationId", request.params.installationId);
    qInst.first().then(function (installation) {
        if (installation) {
            installationId = installation.id;
            var qQ = new Parse.Query("QuestionSelect");
            qQ.equalTo("date", parseDate(theDate));
            qQ.notEqualTo("isDeleted", true);
            qQ.include("questionOfDay.categoryId,questionOfWeek.categoryId,questionOfMonth.categoryId");
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

                result.questionOfWeek = {};
                result.questionOfWeek.id = qT.get("questionOfWeek").id;
                result.questionOfWeek.category = qT.get("questionOfWeek").get("categoryId").get("name");
                result.questionOfWeek.text1 = qT.get("questionOfWeek").get("subject");
                result.questionOfWeek.text2 = qT.get("questionOfWeek").get("body");

                result.questionOfMonth = {};
                result.questionOfMonth.id = qT.get("questionOfMonth").id;
                result.questionOfMonth.category = qT.get("questionOfMonth").get("categoryId").get("name");
                result.questionOfMonth.text1 = qT.get("questionOfMonth").get("subject");
                result.questionOfMonth.text2 = qT.get("questionOfMonth").get("body");

            }
            return Parse.Promise.as();
        }).then(function () {
            return _GetVote(installationId, result.questionOfDay.id);
        }).then(function (rez) {
            if (rez) {
                result.questionOfDay.hasVote = !!rez.date;
                result.questionOfDay.dateVote = rez.date;
            } else {
                result.questionOfDay.hasVote = false;
            }
            return _GetVote(installationId, result.questionOfWeek.id);
        }).then(function (rez) {
            if (rez) {
                result.questionOfWeek.hasVote = !!rez.date;
                result.questionOfWeek.dateVote = rez.date;
            } else {
                result.questionOfWeek.hasVote = false;
            }
            return _GetVote(installationId, result.questionOfMonth.id);
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
_GetVote = function (installationId, questionId) {
    var promise = new Parse.Promise();
    var qVote = new Parse.Query("Vote");
    qVote.equalTo("installationId", parsePointer("_Installation", installationId));
    qVote.equalTo("questionId", parsePointer("Question", questionId));
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
Parse.Cloud.define("VoteSubmit", function (request, response) {
    var installationId = request.params.installationId
        , questionId = request.params.questionId
        , answer = request.params.answer
        , position = request.params.position
        ;
    var VoteLog = Parse.Object.extend("VoteLog");
    VoteLog = new VoteLog();
    VoteLog.set("questionId", parsePointer("Question", questionId));
    VoteLog.set("installationId", installationId);
    VoteLog.set("answer", answer);
    VoteLog.set("position", position);
    VoteLog.save().then(function (voteLog) {
        response.success({success: true});
    }, function (error) {
        response.error(JSON.stringify(error));
    });
});
