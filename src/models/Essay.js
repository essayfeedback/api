const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Essay = new Schema({
  selectedAreas: {
    type: [Boolean],
    required: true
  },
  selectedStage: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    default: ""
  },
  link: {
    type: String,
    required: true
  },
  ownerUID: {
    type: String,
    required: true
  },
  reviewerUID: {
    type: String,
    default: ""
  },
  isReviewComplete: {
    type: Boolean,
    default: false
  }
});

Essay.statics.getCount = function() {
  return Essay.countDocuments().exec();
};

Essay.statics.getReviewedCount = function() {
  return Essay.countDocuments({ isReviewComplete: true }).exec();
};

Essay.statics.getPendingReviewCount = function() {
  return Essay.countDocuments({ isReviewComplete: false }).exec();
};

module.exports = mongoose.model("Essay", Essay);
