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

module.exports = { addOrder, addItemToOrder };


// order_status VARCHAR(255) NOT NULL,
// -- order_total INTEGER NOT NULL,
// user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
