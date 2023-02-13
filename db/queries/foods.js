const db = require('../connection');

const { Pool } = require('pg');
const { query } = require('express');
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});

const getFoodItems = () => {
  return pool
  .query(`
  SELECT *
  FROM foods
  LIMIT 5;
  `)
  .then(result => {
  console.log(result.rows);
  return result.rows;
  })
  .catch(err => console.error('query error', err.stack));
  };

const getFoodByOwnerId = (id) => {
  return pool
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

  return pool
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

module.exports = { getFoodItems, getFoodByOwnerId, addFoodItem };
