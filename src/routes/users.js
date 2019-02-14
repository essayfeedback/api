const express = require("express");
const router = express.Router();
const User = require("../models/User");

router
  .route("/")
  .get((req, res) => {
    const sortBy = req.query.sort;
    const getUsers = User.find({});
    if (sortBy === "rating" || sortBy === "points") getUsers.sort({ [sortBy]: -1 });
    getUsers.exec().then(users => res.json({ users }));
  })
  .post((req, res) => {
    const user = new User(req.body);
    user.save().then(savedUser => res.status(201).json({ user: savedUser }));
  });

router.use("/:uid*", (req, res, next) => {
  User.findOne({ uid: req.params.uid }).then(user => {
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
  .get((req, res) => {
    res.json({ user: req.user });
  })
  .put((req, res) => {
    Object.keys(req.body).map(key => {
      req.user[key] = req.body[key];
    });
    req.user.lastModified = new Date().toISOString();
    req.user.save().then(() => res.status(200).end());
  })
  .patch((req, res) => {
    for (let p in req.body) {
      req.user[p] = req.body[p];
    }
    req.user.lastModified = new Date().toISOString();
    req.user.save().then(() => res.status(200).end());
  })
  .delete((req, res) => {
    req.user.remove().then(() => res.status(204).end());
  });

router.get("/:uid/profile", (req, res) => {
  const getReviewed = req.user.getEssaysReviewed();
  const getRating = req.user.getRating();
  const getEssaysPosted = req.user.getEssaysPosted();
  const getEssaysReviewing = req.user.getEssaysReviewing();
  const getPoints = req.user.getPoints();
  Promise.all([getReviewed, getRating, getEssaysPosted, getEssaysReviewing, getPoints]).then(
    ([essaysReviewed, rating, essaysPosted, essaysReviewing, points]) => {
      res.json({
        profile: {
          essaysPosted,
          rating,
          essaysReviewedCount: essaysReviewed.length,
          essaysReviewing,
          points
        }
      });
    }
  );
});

router.get("/:uid/photoURL", (req, res) => {
  res.json({ photoURL: req.user.photoURL });
});

router.get("/:uid/points", (req, res) => {
  req.user.getPoints().then(points => res.json({ points }));
});

router.post("/uid/rating", (req, res) => {
  const { rating, reviewerUID } = req.body;
  const reviewer = User.findOne({ uid: reviewerUID }).exec();
  reviewer.addRating(rating, reviewerUID);
  reviewer.lastModified = new Date().toISOString();
  res.status(200).end();
});

module.exports = router;
