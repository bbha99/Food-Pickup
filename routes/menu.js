const express = require('express');
const router  = express.Router();

const foodQueries = require('../db/queries/foods');

// Displays the user homepage
router.get('/', (req, res) => {
  const userId = req.session.user_id;
  const userRole = req.session.user_role;

  if (userRole === 'admin') {
    res.redirect('../menu/admin')
  } else if (userRole === 'customer') {
    res.render('homepage_user');
  } else {
    res.redirect('../');
  }
});

// Displays the admin homepage
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

// Edits the toggle state of an item
router.post('/admin/:id/edit', (req, res) => {
  const userId = req.session.user_id;
  const userRole = req.session.user_role;

  if (userRole === 'admin') {
    const toggleItemId = req.params.id;

    foodQueries.getToggleValue(toggleItemId)
    .then(toggleStatus => {
      let status = 'off';
      if (toggleStatus.toggle === 'off') {
        status = 'on';
      }

      foodQueries.toggleItem(toggleItemId, status)
      .then(toggle => {
        res.json({ toggle });
      })
      .catch(err => {
        res
          .status(500)
          .json({result: "error"});
      });
    })
    .catch(err => {
      res
        .status(500)
        .json({result: "error"});
    });
  } else {
    return res.send("Must be logged in to delete");
  }
})

// Adds a new food item to the database
router.post('/admin/add', (req, res) => {
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
      const food = {name, description, imageUrl, price, userId};
      foodQueries.addFoodItem(food)
        .then(item => {
          res.json({ item });
        })
    }
  }
});

module.exports = router;

