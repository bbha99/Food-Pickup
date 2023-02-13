/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

const userQueries = require('../db/queries/users');

router.get('/', (req, res) => {
  res.render('users');
});

// Login a specific user
router.get('/:id', (req, res) => {
  const id = req.params.id;
  userQueries.checkUserRole(id)
  .then(user => {
    req.session.user_id = user.id;
    req.session.user_role = user.role;
    if (user.role === 'admin') {
      res.render('homepage_admin');
    } else {
      res.render('homepage_user');
    }
  })
  .catch(e => res.send(e.message));
});

router.post("/logout", (req, res) => {
  req.session = null;
  res.render('index');
});


module.exports = router;
