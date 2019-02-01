const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Essay = require("../models/Essay");

const User = new schema({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  photoURL: String,
  rating: {
    type: Number,
    default: 0
  },
  numRatings: {
    type: Number,
    default: 0
  }
});

User.methods.getEssaysPosted = function(cb) {
  return Essay.find({ ownerUID: this.uid }, cb);
};

User.methods.getEssaysReviewedNum = function() {
  return Essay.count({ reviewerUID: this.uid, isReviewComplete: true });
};

User.methods.getEssaysPostedNum = function() {
  return Essay.count({ ownerUID: this.uid });
};

User.methods.updateRating = function(newRating) {
  this.rating = (this.rating * this.numRatings + newRating) / (this.numRatings + 1);
  this.numRatings += 1;
  return this.save();
};

User.statics.getReviewersNum = function() {
  Essay.find({ reviewerUID: { $ne: "" } }, { reviewerUID: 1 }).then(function(err, essays) {
    return new Set(essays.map(({ reviewerUID }) => reviewerUID)).size;
  });
};

User.statics.getUsersNum = function() {
  return User.count();
};

module.exports = mongoose.model("User", User);
