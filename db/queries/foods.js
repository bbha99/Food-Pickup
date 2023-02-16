const db = require('../connection');

const getFoodItems = () => {
  return db
  .query(`
  SELECT *
  FROM foods;
  `)
  .then(result => {
  return result.rows;
  })
  .catch(err => console.error('query error', err.stack));
  };

const getFoodByOwnerId = (id) => {
  return db
  .query(`
  SELECT *
  FROM foods
  WHERE owner_id = $1;
  `, [id])
  .then(result => {
  console.log(result.rows);
  return result.rows[0];
  })
  .catch((err) => {
    return null;
  });
};

const addFoodItem = (food) => {
  let values = [food.name, food.description, food.image_url, food.price, food.owner_id];

  return db
  .query(`
  INSERT INTO foods (name, description, image_url, price, owner_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
  `, values)
  .then((result) => {
    console.log(result.rows);
    return result.rows[0];
  })
  .catch((err) => {
    console.error(null);
    return null;
  });
};

const toggleItem = (id) => {
  console.log("in db query ",id)
  return db.query('DELETE FROM foods WHERE id = $1;', [id])
  .then(deletedData => {
    console.log("we are in the deleted Query then block", deletedData);
    return ({result: "toggled"});
  });
};

module.exports = { getFoodItems, getFoodByOwnerId, addFoodItem, toggleItem };
