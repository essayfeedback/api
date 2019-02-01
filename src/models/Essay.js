const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Essay = new schema({
  selectedAreas: {
    type: [Boolean],
    required: true
  },
  selectedStage: {
    type: Number,
    required: true
  },
  question: String,
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

Essay.statics.getNum = function() {
  return Essay.count();
};

Essay.statics.getReviewedNum = function() {
  return Essay.count({ isReviewComplete: true });
};
Essay.statics.getPendingReviewNum = function() {
  return Essay.count({ isReviewComplete: false });
};

module.exports = mongoose.model("Essay", Essay);
