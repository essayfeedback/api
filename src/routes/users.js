const express = require("express");
const router = express.Router();
const User = require("../models/User");

router
  .route("/")
  .get((req, res) => {
    User.find({}, (err, users) => res.json({ users }));
  })
  .post((req, res) => {
    User.find({ uid: req.body.uid }, function(err, existingUsers) {
      if (existingUsers.length === 0) {
        const user = new User(req.body);
        user.save().then(savedUser => res.status(201).json({ user: savedUser }));
      } else {
      }
    });
  });

router.use("/:uid*", (req, res, next) => {
  User.findOne({ uid: req.params.uid }, (err, user) => {
    if (!user) {
      res.status(404).end();
    } else {
      req.user = user;
      next();
    }
  });
});

router
  .route("/:uid")
  .get((req, res) => res.json({ user: req.user }))
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
    req.user.remove(err => {
      res.status(204).end();
    });
  });

router.get("/:uid/posted", (req, res) => {});
router.get("/:uid/posted/count", (req, res) => {
  const count = req.user.getEssaysPostedCount();
  res.json({
    count
  });
});
router.get("/:uid/reviewed", (req, res) => {});
router.get("/:uid/reviewed/count", (req, res) => {
  const count = req.user.getEssaysReviewedCount();
  res.json({
    count
  });
});

module.exports = router;
