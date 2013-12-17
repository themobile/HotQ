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

