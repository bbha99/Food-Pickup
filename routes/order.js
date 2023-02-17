const express = require('express');
const router  = express.Router();
const orderQueries = require('../db/queries/orders');
const twilio = require('../lib/twilio');

// Display the user order page
router.get('/', (req, res) => {
  const userId = req.session.user_id;
  const userRole = req.session.user_role;

  if (userRole === 'customer') {
    res.render('order_page_user');
  } else {
    res.send("error");
  }

});

// Display the admin order page
router.get('/admin', (req, res) => {
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

      twilio.sendSMS('pending');

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

router.post('/edit', (req, res) => {
  const time = Number(req.body.selectedTime);
  const orderId = req.body.orderId;

  if (time) {
    twilio.sendTimeSMS(time);
  } else {
    twilio.sendSMS('ready');
  }

  orderQueries.updateOrderItem(orderId, time)
  .then(orderData => {
    res.json({orderData})
  })
  .catch(err => {
    console.log("error updating the order item:", err);
    res
      .status(500)
      .json({result: "error"});
  });

});

module.exports = router;
