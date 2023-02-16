const db = require('../connection');

const getFoodItems = () => {
  return db
    .query(`
    SELECT *
    FROM foods
    ORDER BY id DESC;
    `)
    .then(result => {
      return result.rows;
    })
    .catch(err => console.error('query error', err.stack));
};

const addFoodItem = (food) => {
  let values = [food.name, food.description, food.imageUrl, Math.round(food.price * 100), food.userId];

  return db
    .query(`
  INSERT INTO foods (name, description, image_url, price, owner_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
  `, values)
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log("error", err);
      return null;
    });
};

const getToggleValue = (id) => {
  return db.query(`SELECT * FROM foods WHERE id = $1`, [id])
    .then(toggleValue => {
      return (toggleValue.rows[0]);
    });
};

const toggleItem = (id, status) => {
  return db.query(`UPDATE foods SET toggle = $1 WHERE id = $2 RETURNING *;`, [status, id])
    .then(updatedData => {
      return (updatedData.rows[0]);
    });
};

module.exports = { getFoodItems, addFoodItem, toggleItem, getToggleValue };
