const app = require("../app");
const Essay = require("../models/essay");

module.exports = (req, res) => {
  Essay.find({}).then(essays => {
    console.log(essays);
    res.end("ok");
  });
};

// app
//   .route("/")
//   .get((req, res) => {
//     Essay.find({ isReviewComplete: false })
//       .sort({ dateCreated: -1 })
//       .then(essays => {
//         if (req.query.sort === "points") Essay.statics.sortByPoints(essays).then(essaysSorted => res.json({ essays: essaysSorted }));
//         else res.json({ essays });
//       });
//   })
//   .post((req, res) => {
//     const essay = new Essay(req.body);
//     essay.dateCreated = new Date().toISOString();
//     essay.save().then(savedEssay => res.status(201).json({ essay: savedEssay }));
//   });

// app.use("/:id", (req, res, next) => {
//   Essay.findById(req.params.id).then(essay => {
//     if (!essay) {
//       res.status(404).end();
//     } else {
//       req.essay = essay;
//       next();
//     }
//   });
// });

// app
//   .route("/:id")
//   .get((req, res) => {
//     res.json({ essay: req.essay });
//   })
//   .put((req, res) => {
//     Object.keys(req.body).map(key => {
//       req.essay[key] = req.body[key];
//     });
//     req.essay.lastModified = new Date().toISOString();
//     req.essay.save().then(() => res.status(200).end());
//   })
//   .patch((req, res) => {
//     for (let p in req.body) {
//       req.essay[p] = req.body[p];
//     }
//     req.essay.lastModified = new Date().toISOString();
//     req.essay.save().then(() => res.status(200).end());
//   })
//   .delete((req, res) => {
//     req.essay.remove().then(() => res.status(204).end());
//   });
