const { Router } = require('express');
const express = require('express');
const router  = express.Router();

const foodQueries = require('../db/queries/foods');

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
    const toggleItemId = req.params.id;

    foodQueries.getToggleValue(toggleItemId)
    .then(toggleStatus => {
      let status = 'off';
      if (toggleStatus.toggle === 'off') {
        status = 'on';
      }
      console.log("status", status)

      foodQueries.toggleItem(toggleItemId, status)
      .then(toggle => {
        console.log("toggleService", toggle)
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

