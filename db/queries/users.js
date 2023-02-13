const db = require('../connection');

const { Pool } = require('pg');
const { query } = require('express');
const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});

const getUsers = () => {
  return pool
  .query(`
  SELECT *
  FROM users
  LIMIT 5;
  `)
  .then(result => {
  console.log(result.rows);
  return result.rows;
  })
  .catch(err => console.error('query error', err.stack));
  };

const getUserWithId = (id) => {
  return pool
  .query(`
  SELECT *
  FROM users
  WHERE id = $1;
  `, [id])
  .then(result => {
  console.log(result.rows);
  return result.rows[0];
  })
  .catch((err) => {
    return null;
  });
};

const getUsersByRole = (role) => {
  return pool
  .query(`
  SELECT *
  FROM users
  WHERE role = $1;
  `, [role])
  .then(result => {
  console.log(result.rows);
  return result.rows;
  })
  .catch((err) => {
    return null;
  });
};

const addUser =  function(user) {
  let values = [user.name, user.role];

  return pool
  .query(`
  INSERT INTO users (name, role)
  VALUES ($1, $2)
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

const deleteItem = (id) => {
  console.log("in db query ",id)
  return db.query('DELETE FROM foods WHERE id = $1;', [id])
  .then(deletedData => {
    console.log("we are in the deleted Query then block", deletedData);
    return ({result: "deleted"});
    // return deletedData.rows[0];
  });
};
module.exports = { getUsers, getUserWithId, getUsersByRole, addUser, deleteItem };
