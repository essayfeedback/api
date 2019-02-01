const express = require("express");
const router = express.Router();
const User = require("../models/user");

router
  .route("/")
  .get((req, res) => {
    User.find({}, (err, users) => res.json(users));
  })
  .post((req, res) => {
    const user = new User(req.body);
    user.save().then(savedUser => res.status(201).json(savedUser));
  });

router.use("/:uid", (req, res, next) => {
  User.findOne({ uid: req.params.uid }, (err, user) => {
    req.user = user;
    next();
  });
});

router
  .route("/:uid")
  .get((req, res) => res.json(req.user))
  .put((req, res) => {
    Object.keys(req.body).map(key => {
      req.user[key] = req.body[key];
    });
    req.user.save();
    res.status(200).end();
  })
  .patch((req, res) => {
    for (let p in req.body) {
      req.user[p] = req.body[p];
    }
    req.user.save();
    res.status(200).end();
  })
  .delete((req, res) => {
    res.user.remove(err => {
      res.status(204).end();
    });
  });

module.exports = router;
