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

