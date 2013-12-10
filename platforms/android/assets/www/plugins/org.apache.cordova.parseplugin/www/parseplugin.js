cordova.define("org.apache.cordova.parseplugin.parseplugin", function(require, exports, module) {parseGetInstallationId = function(successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'ParsePlugin',
            'getInstallationId',
            []
        );
    }

});
