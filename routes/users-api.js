/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');
const foodQueries = require('../db/queries/foods');
const orderQueries = require('../db/queries/orders');

// Returns the user data
router.get('/', (req, res) => {
  userQueries.getUsers()
    .then(users => {
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// Returns the food data
router.get('/food', (req, res) => {
  foodQueries.getFoodItems()
  .then(foods => {
    res.json({foods});
  });
});

// Returns the order data
router.get('/order', (req, res) => {
  orderQueries.getOrderItems()
  .then(orders => {
    orderQueries.getOrderIds()
    .then(orderIds => {
      res.json({orders, orderIds});
    });
  });
});

module.exports = router;
