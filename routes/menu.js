const express = require('express');
const router  = express.Router();

const userQueries = require('../db/queries/users');

router.get('/', (req, res) => {
  const userId = req.session.user_id;
  const userRole = req.session.user_role;
  // console.log("UserID", userId);
  // console.log("UserRole", userRole);
  if (userRole === 'admin') {
    res.render('homepage_admin');
  } else if (userRole === 'customer') {
    res.render('homepage_user');
  } else {
    res.render('index');
  }
});

router.get('/admin', (req, res) => {
  const userId = req.session.user_id;
  const userRole = req.session.user_role;
  if (userRole === 'admin') {
    res.render('homepage_admin');
  } else if (userRole === 'customer') {
    res.render('homepage_user');
  } else {
    res.render('index');
  }
})

module.exports = router;

