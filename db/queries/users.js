const db = require('../connection');

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

const getUserWithId = (id) => {
  return db
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
      console.error('query error', err);
      return null;
    });
};

const getUsersByRole = (role) => {
  return db
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
      console.error('query error', err);
      return null;
    });
};

const addUser =  function(user) {
  let values = [user.name, user.role];

  return db
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
      console.error('query error', err);
      return null;
    });
};

const checkUserRole = (id) => {
  console.log("id", id);
  return db.query('SELECT * FROM users WHERE id = $1;', [id])
    .then(data => {
      return data.rows[0];
    });
};

module.exports = { getUsers, getUserWithId, getUsersByRole, addUser, checkUserRole };
