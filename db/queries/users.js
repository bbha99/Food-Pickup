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

const deleteItem = (id) => {
  console.log("in db query ",id)
  return db.query('DELETE FROM foods WHERE id = $1;', [id])
    .then(deletedData => {
      console.log("we are in the deleted Query then block", deletedData);
      return ({result: "deleted"});
      // return deletedData.rows[0];
    });
};

module.exports = { getUsers, checkUserRole, getFoodItems, deleteItem };
