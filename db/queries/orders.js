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
    console.error(null);
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
    console.error(null);
    return null;
  });
};

const getOrderItems = () => {
  return db
  .query(`
  SELECT order_id, name, order_status, price, quantity, user_id
  FROM orders JOIN food_quantities on order_id = orders.id JOIN foods on food_id = foods.id;
  `)
  .then(result => {
  return result.rows;
  })
  .catch(err => console.error('query error', err.stack));
  };

const getOrderIds = () => {
  return db
  .query(`
  SELECT DISTINCT order_id
  FROM orders JOIN food_quantities on order_id = orders.id;
  `)
  .then(result => {
  return result.rows;
  })
  .catch(err => console.error('query error', err.stack));
  };

const updateOrderItem = (orderId) => {
  return db
  .query(`
    UPDATE orders
    SET order_status = 'Not Ready'
    WHERE id = $1
    RETURNING *
  `, [orderId])
  .then(result => {
    return result.rows[0];
    })

}


module.exports = { addOrder, addItemToOrder, getOrderItems, getOrderIds, updateOrderItem };


// order_status VARCHAR(255) NOT NULL,
// -- order_total INTEGER NOT NULL,
// user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
