const app = require("../app");
const User = require("../models/user");

app
  .route("/")
  .get((req, res) => {
    const sortBy = req.query.sort;
    const getUsers = User.find({});
    if (sortBy === "rating" || sortBy === "points") getUsers.sort({ [sortBy]: -1 });
    getUsers.exec().then(users => res.json({ users }));
  })
  .post((req, res) => {
    const user = new User(req.body);
    user.dateCreated = new Date().toISOString();
    user.save().then(savedUser => res.status(201).json({ user: savedUser }));
  });

app.use("/:uid*", (req, res, next) => {
  User.findOne({ uid: req.params.uid }).then(user => {
    if (!user) {
      res.status(404).end();
    } else {
      req.user = user;
      next();
    }
  });
});

app
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

app.get("/:uid/profile", (req, res) => {
  Promise.all([
    req.user.getEssaysReviewed(),
    req.user.getRating(),
    req.user.getEssaysPosted(),
    req.user.getEssaysReviewing(),
    req.user.getPoints()
  ]).then(([essaysReviewed, rating, essaysPosted, essaysReviewing, points]) => {
    res.json({
      profile: {
        essaysPosted,
        rating,
        essaysReviewedCount: essaysReviewed.length,
        essaysReviewing,
        points
      }
    });
  });
});

app.get("/:uid/photoURL", (req, res) => {
  res.json({ photoURL: req.user.photoURL });
});

app.get("/:uid/points", (req, res) => {
  req.user.getPoints().then(points => res.json({ points }));
});

app.post("/uid/rating", (req, res) => {
  const { rating, reviewerUID } = req.body;
  User.findOne({ uid: reviewerUID }).then(reviewer => {
    reviewer.addRating(rating, reviewerUID).then(() => {
      reviewer.lastModified = new Date().toISOString();
      res.status(200).end();
    });
  });
});

module.exports = app;
