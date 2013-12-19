var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
//        document.addEventListener("offline", this.offline_callback, false);
//        document.addEventListener("online", this.online_callback, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('push-notification', this.pushReceived, false);

    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');


    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        angular.bootstrap(document, ["hotq"]);

    },
//
//    offline_callback: function (evt) {
////        console.log('offline');
//    },
//    online_callback: function (evt) {
////        console.log('online');
//    },

    pushReceived: function(event) {
//        var title = event.notification.title;
//        var userData = event.notification.userdata;
    }

}
