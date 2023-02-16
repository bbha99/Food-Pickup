const db = require('../connection');

// Returns all user data
const getUsers = () => {
  return db
    .query(`
  SELECT *
  FROM users;
  `)
    .then(result => {
      return result.rows;
    })
    .catch(err => console.error('query error', err.stack));
};

// Returns the user data associated with the id
const checkUserRole = (id) => {
  return db.query('SELECT * FROM users WHERE id = $1;', [id])
    .then(data => {
      return data.rows[0];
    });
};

module.exports = { getUsers, checkUserRole };
