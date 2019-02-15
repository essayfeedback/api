const mongoose = require("mongoose");
const Essay = require("../models/essay");

const Schema = mongoose.Schema;

const Rating = new Schema({
  rating: {
    type: Number,
    default: 0
  },
  raterUID: {
    type: String,
    required: true
  }
});

const User = new Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  photoURL: {
    type: String,
    default: ""
  },
  isAdmin: {
    type: Number,
    default: 0
  },
  ratings: {
    type: [Rating],
    default: []
  },
  dateCreated: {
    type: String,
    required: true
  },
  lastModified: {
    type: String,
    default: ""
  }
});

User.methods.getEssaysReviewed = function() {
  return Essay.find({ reviewerUID: this.uid, isReviewComplete: true }).exec();
};

User.methods.getEssaysReviewing = function() {
  return Essay.find({ reviewerUID: this.uid, isReviewComplete: false }).exec();
};

User.methods.getEssaysPosted = function() {
  return Essay.find({ ownerUID: this.uid }).exec();
};

User.methods.getPoints = function() {
  return new Promise(resolve => {
    this.getEssaysReviewed()
      .then(essays => essays.length)
      .then(points => this.ratings.reduce((acc, { rating }) => acc + rating, points))
      .then(points => resolve(points + 5));
  });
};

User.methods.getRating = function() {
  const totals = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
  if (totals === 0) return Promise.resolve(0);
  else return Promise.resolve(totals / this.ratings.length);
};

User.methods.addRating = function(rating, raterUID) {
  this.ratings.push({
    rating,
    raterUID
  });
  return this.save();
};

User.statics.getReviewers = function() {
  Essay.find({ reviewerUID: { $ne: "" } }).then(essays => {
    const reviewerUIDs = new Set(essays.map(({ reviewerUID }) => reviewerUID));
    return User.find({
      uid: {
        $all: [...reviewerUIDs]
      }
    }).exec();
  });
};

User.statics.getUsersCount = function() {
  return User.countDocuments().exec();
};

User.statics.sortbyPoints = function(essays) {
  return new Promise(resolve => {
    let ownersUIDs = new Set(essays.map(({ ownerUID }) => ownerUID));
    let ownersMap = {};
    User.find({ uid: { $all: [...ownersUIDs] } }).then(owners => {
      owners.forEach(({ uid, points }) => {
        ownersMap[uid] = points;
      });
      resolve(essays.sort((a, b) => ownersMap[a.ownerUID] - ownersMap[b.ownerUID]));
    });
  });
};

module.exports = mongoose.model("User", User);
