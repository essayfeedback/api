const express = require("express");
const router = express.Router();
const Essay = require("../models/Essay");

router
  .route("/")
  .get((req, res) => {
    Essay.find({ isReviewComplete: false })
      .sort({ dateCreated: -1 })
      .then(essays => {
        if (req.query.sort === "points") Essay.statics.sortByPoints(essays).then(essaysSorted => res.json({ essays: essaysSorted }));
        else res.json({ essays });
      });
  })
  .post((req, res) => {
    const essay = new Essay(req.body);
    essay.dateCreated = new Date().toISOString();
    essay.save().then(savedEssay => res.status(201).json({ essay: savedEssay }));
  });

router.use("/:id", (req, res, next) => {
  Essay.findById(req.params.id).then(essay => {
    if (!essay) {
      res.status(404).end();
    } else {
      req.essay = essay;
      next();
    }
  });
});

router
  .route("/:id")
  .get((req, res) => {
    res.json({ essay: req.essay });
  })
  .put((req, res) => {
    Object.keys(req.body).map(key => {
      req.essay[key] = req.body[key];
    });
    req.essay.lastModified = new Date().toISOString();
    req.essay.save().then(() => res.status(200).end());
  })
  .patch((req, res) => {
    for (let p in req.body) {
      req.essay[p] = req.body[p];
    }
    req.essay.lastModified = new Date().toISOString();
    req.essay.save().then(() => res.status(200).end());
  })
  .delete((req, res) => {
    req.essay.remove().then(() => res.status(204).end());
  });

module.exports = router;
