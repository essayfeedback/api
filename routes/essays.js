const app = require("../app");
const Essay = require("../models/essay");

function getEssays(req, res) {
  Essay.find({ isReviewComplete: false })
    .sort({ dateCreated: -1 })
    .then(essays => {
      if (req.query.sort === "points") Essay.statics.sortByPoints(essays).then(essaysSorted => res.json({ essays: essaysSorted }));
      else res.json({ essays });
    });
}

function createEssay(req, res) {
  const essay = new Essay(req.body);
  essay.dateCreated = new Date().toISOString();
  essay.save().then(savedEssay => res.status(201).json({ essay: savedEssay }));
}

function getEssay(req, res) {
  res.json({ essay: req.essay });
}

function patchEssay(req, res) {
  putEssay(req, res);
}

function putEssay(req, res) {
  Object.keys(req.body).map(key => {
    req.essay[key] = req.body[key];
  });
  req.essay.lastModified = new Date().toISOString();
  req.essay.save().then(() => res.status(200).end());
}

function deleteEssay(req, res) {
  req.essay.remove().then(() => res.status(204).end());
}

app.get("*", async (req, res) => {
  if (req.path === "/" || req.path === "") {
    if (req.method === "GET") getEssays(req, res);
    if (req.method === "POST") createEssay(req, res);
  } else {
    const essay = await Essay.findById(req.params.id).exec();
    if (essay) {
      req.essay = essay;
      if (req.method === "GET") getEssay(req, res);
      if (req.method === "PATCH") patchEssay(req, res);
      if (req.method === "PUT") putEssay(req, res);
      if (req.method === "DELETE") deleteEssay(req, res);
    } else {
      res.status(404).end();
    }
  }
});

module.exports = app;
