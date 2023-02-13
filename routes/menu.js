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


router.post('/admin/:id/delete', (req, res) => {
  const userId = req.session.user_id;
  const userRole = req.session.user_role;

  if (userRole === 'admin') {
    const deletedId = req.params.id;

    console.log("TEST deletedId, userID, userRole ", deletedId, userId, userRole);
    userQueries.deleteItem(deletedId)
    .then(item => {
      console.log("this is the item deleted: ", item)
      res.json({ item });
    })
    .catch(err => {
      res
        .status(500)
        .json({result: "error"});
        // .json({ error: err.message });
    });
  } else {
    return res.send("Must be logged in to delete");
  }
})

module.exports = router;

