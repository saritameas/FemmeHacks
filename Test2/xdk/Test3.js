 console.log("hello");
// Load the twilio module
var twilio = require('twilio');
 
// Create a new REST API client to make authenticated requests against the
// twilio back end
var TWILIO_ACCOUNT_SID = 'AC5bc177600cabcf924ae68833a4f2413a'
var TWILIO_AUTH_TOKEN = 'aaac543704e9eb8f0015653a928f70cd'
var OUTGOING_NUMBER = '+14257864278'
var TWILIO_NUMBER = '+12062073063'

var client = new twilio.RestClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
 
// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.
client.sms.messages.create({
    to:OUTGOING_NUMBER,
    from:TWILIO_NUMBER,
    body:'RUN!!! your laptop is on the moon!!!!'
}, function(error, message) {
    // The HTTP request to Twilio will run asynchronously. This callback
    // function will be called when a response is received from Twilio
    // The "error" variable will contain error information, if any.
    // If the request was successful, this value will be "falsy"
    if (!error) {
        // The second argument to the callback will contain the information
        // sent back by Twilio for the request. In this case, it is the
        // information about the text messsage you just sent:
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
 
        console.log('Message sent on:');
        console.log(message.dateCreated);
    } else {
        console.log('error: ' + error.message);
    }
});