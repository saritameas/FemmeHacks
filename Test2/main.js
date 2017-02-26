/*
 * Author: Sarah Knepper 
 * Copyright (c) 2014 Intel Corporation.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Load Grove module
var twilio = require('twilio');
var TWILIO_ACCOUNT_SID = 'AC0043568777297eb469841d9a573ec74c'
var TWILIO_AUTH_TOKEN = '6c2d60a91e98672b92702446f4c5bf44'
var OUTGOING_NUMBER = '+16094422275'
var TWILIO_NUMBER = '+19082586082'
var client = new twilio.RestClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

var sensorModule = require('jsupm_ldt0028');
var NUMBER_OF_SECONDS =5;
var MILLISECONDS_PER_SECOND = 1000;
var SAMPLES_PER_SECOND = 50;
var THRESHOLD = 100;
var SAFE = 30;

var MAX_SECONDS = 180;

// Create the LDT0-028 Piezo Vibration Sensor object using AIO pin 0
var sensor = new sensorModule.LDT0028(0);


// Read the signal every 20 milliseconds for 10 seconds
console.log("For the next few seconds, " +
            SAMPLES_PER_SECOND + " samples will be taken every second.");
console.log("");
var buffer = [];
buffer[0] = 14;

for (var i=0; i < NUMBER_OF_SECONDS * SAMPLES_PER_SECOND; i++) {
    buffer.push(sensor.getSample());
    delay(MILLISECONDS_PER_SECOND / SAMPLES_PER_SECOND );
}

//test start
/*i = 0;
while((buffer[i]<SAFE) && (i < MAX_SECONDS * SAMPLES_PER_SECOND))
{
    buffer.push(sensor.getSample());
    delay(MILLISECONDS_PER_SECOND / SAMPLES_PER_SECOND );
    i++;
    
    if (i%20 == 0)
    {
        NUMBER_OF_SECONDS++;
    }
}
*/

//test end


// Print the number of times the reading was greater than the threshold
var count = 0;
for (var i=0; i < NUMBER_OF_SECONDS * SAMPLES_PER_SECOND; i++) {
    if (buffer[i] > THRESHOLD) {
        count++;
    }
}
console.log(sensor.name() + " exceeded the threshold value of " +
        THRESHOLD + " a total of " + count + " times,");
console.log("out of a total of " + NUMBER_OF_SECONDS*SAMPLES_PER_SECOND +
            " readings.");
console.log("");

// Print a graphical representation of the average value sampled
// each second for the past 10 seconds, using a scale factor of 15
console.log("Now printing a graphical representation of the average reading ");
console.log("each second for the last " + NUMBER_OF_SECONDS + " seconds.");
var SCALE_FACTOR = 15;
for (var i=0; i < NUMBER_OF_SECONDS; i++) {
    var sum = 0;
    for (var j=0; j < SAMPLES_PER_SECOND; j++) {
        sum += buffer[i*SAMPLES_PER_SECOND+j];
    }
    var average = sum / SAMPLES_PER_SECOND;
    var stars_to_print = Math.round(average / SCALE_FACTOR);
    var string = "(" + ("    " + Math.round(average)).slice(-4) + ") | ";
    for (var j=0; j < stars_to_print; j++) {
        string += "*";
    }
    console.log(string);
   // console.log();
}


client.sms.messages.create({
    to:OUTGOING_NUMBER,
    from:TWILIO_NUMBER,
    body:'RUN!!! your laptop is on the move!!!!'
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
function delay( milliseconds ) {
    var startTime = Date.now();
    while (Date.now() - startTime < milliseconds);
}

