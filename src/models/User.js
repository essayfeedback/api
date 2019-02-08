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

User.methods.getEssaysReviewed = function() {
  return Essay.find({ reviewerUID: this.uid, isReviewComplete: true }).exec();
};

User.methods.getEssaysReviewing = function() {
  return Essay.find({ reviewerUID: this.uid, isReviewComplete: false }).exec();
};

User.methods.getEssaysPosted = function() {
  return Essay.find({ ownerUID: this.uid }).exec();
};

User.methods.getRating = function() {
  const totals = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
  if (totals === 0) return 0;
  else return totals / this.ratings.length;
};

User.methods.addRating = function(rating, raterUID) {
  this.ratings.push({
    rating,
    raterUID
  });
  return this.save();
};

User.statics.getReviewers = function() {
  Essay.find({ reviewerUID: { $ne: "" } }, (err, essays) => {
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

module.exports = mongoose.model("User", User);
