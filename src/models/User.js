const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Essay = require("../models/Essay");

const User = new schema({
  rating: Number,
  uid: String
});

User.statics.getReviewers = function(cb) {
  return User.find({ numReviewed: { $gt: 0 } }, cb);
};

User.statics.getPosters = function(cb) {
  return User.find({ numReviewed: { $gt: 0 } }, cb);
};

User.methods.getNumReviewed = function() {
  return Essay.count({ reviewerUID: this.uid });
};

User.methods.getNumPosted = function() {
  return Essay.count({ ownerUID: this.uid });
};

User.methods.updateRating = function(newRating) {
  const numReviewed = User.getNumReviewed();
  this.rating = (this.rating * numReviewed + newRating) / (numReviewed + 1);
  return this.save();
};

module.exports = mongoose.model("User", User);
