// packages
const express = require("express");
const app = express();
// modules
const middleware = require("../middleware");
const mongoose = require("../db");

const {
  mongodb: { username, password }
} = require("./secrets.json");

mongoose.connect(`mongodb://${username}:${encodeURIComponent(password)}@ds161804.mlab.com:61804/essayfeedback`, { useNewUrlParser: true });
app.use(...middleware);

module.exports = app;
