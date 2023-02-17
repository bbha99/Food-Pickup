// SMS Twilio notification

// twilio configurations
const twilio = require('twilio');

const accountSid = `${process.env.TWILIO_ACCOUNTSID}`; // Your Account SID from www.twilio.com/console
const authToken = `${process.env.TWILIO_AUTHTOKEN}` // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken);

// Notify user of order status
function sendSMS(readyState) {
  let bodyText = 'A new order has been made!';
  if (readyState === 'ready') bodyText =  'Your order is ready for pickup!'

  client.messages
  .create({
    body: bodyText,
    to: process.env.PHONE, // Text this number
    from: `${process.env.TWILIO_PHONE}`, // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
}

// Send a time estimate message to the user
function sendTimeSMS(time) {
  client.messages
  .create({
    body: `Order has has been confirmed. Time remaining is ${time} minutes`,
    to: process.env.PHONE, // Text this number
    from: `${process.env.TWILIO_PHONE}`, // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
}

module.exports = { sendSMS, sendTimeSMS };
