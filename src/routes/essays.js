const express = require("express");
const router = express.Router();
const Essay = require("../models/Essay");

router
  .route("/")
  .get((req, res) => {
    Essay.find({ isReviewComplete: false }, (err, essays) => {
      res.json(essays);
    });
  })
  .post((req, res) => {
    const essay = new Essay(req.body);
    essay.save();
    res.status(201).json(essay);
  });

router.use("/:id", (req, res, next) => {
  Essay.findById(req.params.id, (err, essay) => {
    req.essay = essay;
    next();
  });
});

router
  .route("/:id")
  .get((req, res) => res.json(req.essay))
  .put((req, res) => {
    Object.keys(req.body).map(key => {
      req.essay[key] = req.body[key];
    });
    req.essay.save();
    res.json(req.essay);
  })
  .patch((req, res) => {
    for (let p in req.body) {
      req.essay[p] = req.body[p];
    }
    req.essay.save();
    res.json(req.essay);
  })
  .delete((req, res) => {
    res.essay.remove(err => {
      res.status(204).json({});
    });
  });

module.exports = router;