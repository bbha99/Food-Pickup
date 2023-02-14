const express = require('express');
const router  = express.Router();

// twilio configurations
const twilio = require('twilio');

const accountSid = `${process.env.TWILIO_ACCOUNTSID}`; // Your Account SID from www.twilio.com/console
const authToken = `${process.env.TWILIO_AUTHTOKEN}` // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken);

const orderQueries = require('../db/queries/orders');

// Notify user by SMS that order is pending
function pendingTwilio() {
  client.messages
  .create({
    body: 'Order is processing. We will give you an estimate of the time remaining soon!',
    to: process.env.PHONE, // Text this number
    from: `${process.env.TWILIO_PHONE}`, // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));
}

// Displays the order number for the user
router.get('/', (req, res) => {
  const userId = req.session.user_id;
  const userRole = req.session.user_role;

  if (userRole === 'customer') {
    const orderId = req.query.orderId;
    console.log("this is orderid:", orderId)
    res.render("order_confirmed", {orderId});
  } else {
    res.redirect('../');
  }



});

router.get('/history/admin', (req, res) => {
  const userId = req.session.user_id;
  const userRole = req.session.user_role;

  if (userRole === 'admin') {
    res.render('order_page_admin');
  } else {
    res.send("error");
  }

});


// Creates a new order and items associated with the order
router.post('/', (req, res) => {
  const userId = req.session.user_id;
  const userRole = req.session.user_role;
  const cartData = req.body.cartItems;

  if (userRole === 'customer') {

    // Create a new order
    orderQueries.addOrder(userId)
    .then(orderData => {
      const orderId = orderData.id;

      // pendingTwilio();

      // Add items and their quantities to order cart
      for (const cartItem in cartData) {
        if (cartData[cartItem].quantity > 0) {
          orderQueries.addItemToOrder(cartData[cartItem], orderId)
          .then(res => {
            console.log("added successfully: ", res);
          });
        }
      }
      res.json({ orderId });
    })
    .catch(err => {
      res
        .status(500)
        .json({result: "error"});
    });
  }
});

module.exports = router;
