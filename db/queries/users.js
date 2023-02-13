const db = require('../connection');

const getUsers = () => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};

const checkUserRole = (id) => {
  console.log("id", id)
  return db.query('SELECT * FROM users WHERE id = $1;', [id])
  .then(data => {
    return data.rows[0];
  });
}

const getFoodItems = () => {
  return db.query('SELECT * FROM foods;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getUsers, checkUserRole, getFoodItems };
