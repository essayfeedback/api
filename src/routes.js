const express = require("express");
const router = express.Router();
const Essay = require("./model");

router.use("/:id", (req, res, next) => {
  Essay.findById(req.params.id, (err, essay) => {
    if (err) res.status(500).send(err);
    else req.essay = essay;
    next();
  });
});

router
  .route("/")
  .get((req, res) => {
    Essay.find({}, (err, essays) => {
      if (err) res.status(500).send(err);
      else res.json(essays);
    });
  })
  .post((req, res) => {
    const essay = new Essay(req.body);
    essay.save();
    res.status(201).json(essay);
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
  .delete((req, res) => {
    res.essay.remove(err => {
      if (err) res.status(500).send(err);
      else res.status(204).send("");
    });
  });

module.exports = router;
