const { Router } = require('express');
const express = require('express');
const router  = express.Router();

const foodQueries = require('../db/queries/foods');

router.get('/', (req, res) => {
  const userId = req.session.user_id;
  const userRole = req.session.user_role;
  // console.log("UserID", userId);
  // console.log("UserRole", userRole);
  if (userRole === 'admin') {
    res.redirect('../menu/admin')
  } else if (userRole === 'customer') {
    res.render('homepage_user');
  } else {
    res.redirect('../');
  }
});

router.get('/admin', (req, res) => {
  const userId = req.session.user_id;
  const userRole = req.session.user_role;
  if (userRole === 'admin') {
    res.render('homepage_admin');
  } else if (userRole === 'customer') {
    res.redirect('../menu')
  } else {
    res.redirect('../');
  }
})


router.post('/admin/:id/edit', (req, res) => {
  const userId = req.session.user_id;
  const userRole = req.session.user_role;

  if (userRole === 'admin') {
    const deletedId = req.params.id;

    console.log("TEST deletedId, userID, userRole ", deletedId, userId, userRole);
    foodQueries.toggleItem(deletedId)
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
// https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGhlYWx0aHklMjBmb29kfGVufDB8fDB8fA%3D%3D&w=1000&q=80
router.post('/admin/add', (req, res) => {
  console.log("testing", req.body);
  const name = req.body.name;
  const description = req.body.description;
  const imageUrl = req.body.image;
  const price = Number(req.body.price);

  if (!name || !description || !imageUrl || !price) {
    res.status(400).json({ error: 'invalid request: no data entered in a input field.'});
    return;
  } else {
    const userId = req.session.user_id;
    const userRole = req.session.user_role;
    if (userRole === 'admin') {
      console.log("price", price)
      const food = {name, description, imageUrl, price, userId};
      foodQueries.addFoodItem(food)
        .then(item => {
          console.log("inserted", item);
          res.json({ item });
        })
    }
  }
});

module.exports = router;

