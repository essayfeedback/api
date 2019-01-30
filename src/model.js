const mongoose = require("mongoose");
const schema = mongoose.Schema;

const essayModel = new schema({
  selectedAreas: [Boolean],
  selectedStage: Number,
  question: String,
  link: String,
  ownerUID: String,
  reviewerUID: String,
  status: Boolean
});

const userModel = new schema({
  numPosted: Number,
  numReviewed: Number,
  rating: Number,
  uid: String
});

module.exports = mongoose.model("Essay", essayModel);
