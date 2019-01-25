const mongoose = require("mongoose");
const schema = mongoose.Schema;

const model = new schema({
  areas: [Boolean],
  stage: String,
  question: String,
  link: String,
  customArea: String
});

module.exports = mongoose.model("Essay", model);
