const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Essay = require("../models/Essay");

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
  }
});

User.methods.getEssaysPosted = function(cb) {
  return Essay.find({ ownerUID: this.uid }, cb);
};

User.methods.getEssaysReviewed = function(cb) {
  return Essay.find({ reviewerUID: this.uid, isReviewComplete: true }, cb);
};

User.methods.getEssaysReviewedCount = function() {
  return Essay.count({ reviewerUID: this.uid, isReviewComplete: true });
};

User.methods.getEssaysPostedCount = function() {
  return Essay.count({ ownerUID: this.uid });
};

User.methods.getRatingAvg = function() {
  const totals = this.ratings.reduce((acc, curr) => acc + curr, 0);
  const avg = totals / this.ratings.length;
  return avg;
};

User.methods.addRating = function(rating, raterUID) {
  this.ratings.push({
    rating,
    raterUID
  });
  this.save();
};

User.statics.getReviewers = function(cb) {
  Essay.find({ reviewerUID: { $ne: "" } }, (err, essays) => {
    const reviewerUIDs = new Set(essays.map(({ reviewerUID }) => reviewerUID));
    // TODO double check
    return User.find(
      {
        uid: [...reviewerUIDs]
      },
      cb
    );
  });
};

User.statics.getReviewersCount = function() {
  Essay.find({ reviewerUID: { $ne: "" } }, (err, essays) => {
    return new Set(essays).size;
  });
};

User.statics.getUsersCount = function() {
  return User.count();
};

module.exports = mongoose.model("User", User);
