const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Essay = new schema({
  selectedAreas: [Boolean],
  selectedStage: Number,
  question: String,
  link: String,
  ownerUID: String,
  reviewerUID: String,
  isReviewComplete: Boolean
});

Essay.statics.getNumEssays = function() {
  return Essay.count();
};

Essay.statics.getNumReviewed = function() {
  return Essay.count({ isReviewComplete: true });
};

Essay.statics.getPendingReview = function() {
  return Essay.count({ isReviewComplete: false });
};

module.exports = mongoose.model("Essay", Essay);
