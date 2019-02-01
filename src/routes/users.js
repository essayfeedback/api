const express = require("express");
const router = express.Router();
const User = require("../models/user");

router
  .route("/")
  .get((req, res) => {
    User.find({}, (err, users) => {
      res.json(users);
    });
  })
  .post((req, res) => {
    const user = new user(req.body);
    User.save();
    res.status(201).json(user);
  });

router.use("/:id", (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    req.user = user;
    next();
  });
});

router
  .route("/:id")
  .get((req, res) => res.json(req.user))
  .put((req, res) => {
    Object.keys(req.body).map(key => {
      req.user[key] = req.body[key];
    });
    req.user.save();
    res.json(req.user);
  })
  .patch((req, res) => {
    for (let p in req.body) {
      req.user[p] = req.body[p];
    }
    req.user.save();
    res.json(req.user);
  })
  .delete((req, res) => {
    res.User.remove(err => {
      res.status(204).send();
    });
  });

module.exports = router;
