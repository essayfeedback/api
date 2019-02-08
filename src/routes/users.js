const express = require("express");
const router = express.Router();
const User = require("../models/User");

router
  .route("/")
  .get((req, res) => {
    User.find({}, (err, users) => res.json({ users }));
  })
  .post((req, res) => {
    const user = new User(req.body);
    user.save().then(savedUser => res.status(201).json({ user: savedUser }));
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

router.get("/:uid/profile", (req, res) => {
  const postedCount = req.user.getEssaysPostedCount();
  const reviewedCount = req.user.getEssaysReviewedCount();
  const rating = req.user.getRatingAvg();
  res.json({
    profile: {
      postedCount,
      reviewedCount,
      rating
    }
  });
});

router.post("/uid/rating", (req, res) => {
  const { rating, reviewerUID } = req.body;
  const reviewer = User.findOne({ uid: reviewerUID });
  reviewer.addRating(rating, reviewerUID);
  res.status(200).end();
});

module.exports = router;
