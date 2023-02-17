const db = require('../connection');

// Create a new order
const addOrder =  function(userId) {
  let values = [userId];

  return db
    .query(`
  INSERT INTO orders (order_status, user_id)
  VALUES ('pending', $1)
  RETURNING *;
  `, values)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.error('query error', err);
      return null;
    });
};

// Add item to order
const addItemToOrder =  function(cartItem, orderId) {
  const values = [cartItem.quantity, cartItem.foodDataItem.id, orderId];
  return db
    .query(`
  INSERT INTO food_quantities (quantity, food_id, order_id)
  VALUES ($1, $2, $3)
  RETURNING *;
  `, values)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.error('query error', err);
      return null;
    });
};

// Return the order items
const getOrderItems = () => {
  return db
    .query(`
  SELECT order_id, foods.name as foodname, users.name as username, order_status, price, quantity, created_at
  FROM orders JOIN food_quantities on order_id = orders.id JOIN foods on food_id = foods.id JOIN users on orders.user_id = users.id;
  `)
    .then(result => {
      return result.rows;
    })
    .catch(err => console.error('query error', err.stack));
};

// Return all order ids
const getOrderIds = () => {
  return db
    .query(`
  SELECT id
  FROM orders
  ORDER BY created_at DESC;
  `)
    .then(result => {
      return result.rows;
    })
    .catch(err => console.error('query error', err.stack));
};

// Updates the order status for an order
const updateOrderItem = (orderId, time) => {
  let status = 'Not Ready';
  if (!time) {
    status = 'Ready';
  }

  return db
    .query(`
    UPDATE orders
    SET order_status = $2
    WHERE id = $1
    RETURNING *
  `, [orderId, status])
    .then(result => {
      return result.rows[0];
    });

};

module.exports = { addOrder, addItemToOrder, getOrderItems, getOrderIds, updateOrderItem };
