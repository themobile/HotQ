var gcm = require('node-gcm');
var message = new gcm.Message();
 
//API Server Key
var sender = new gcm.Sender('AIzaSyAYfJ50KHLoEuinbEi4suNfyrJZTKxKVMA');
var registrationIds = [];
 
// Value the payload data to send...
message.addData('message',"\u270C Peace, Love \u2764 and PhoneGap \u2706!");
message.addData('title','Push Notification Sample' );
message.addData('msgcnt','3'); // Shows up in the notification in the status bar
//message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
//message.collapseKey = 'demo';
//message.delayWhileIdle = true; //Default is false
message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.
 
// At least one reg id required
registrationIds.push('APA91bFSXN0tq8qx37EQGDJvJwvVm4GHHAqTa0SiXQa-octQm62KkZzRUCKzNk6rYhdvKV4capHMavKFFfsfnbfuzsFwQhcaWaApdqtClLnjPsAc6jYWs6VJYFP2WiT6Gi8GNETDE6hs6KXs78crP38rKQbTQg3-Uw');
 
/**
 * Parameters: message-literal, registrationIds-array, No. of retries, callback-function
 */
sender.send(message, registrationIds, 4, function (result) {
    console.log(result);
});