const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const {
  mongodb: { username, password }
} = require("./secrets.json");

mongoose.connect(
  `mongodb://${username}:${encodeURIComponent(password)}@ds161804.mlab.com:61804/essayfeedback`,
  { useNewUrlParser: true }
);
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", require("./src/routes"));
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`server ready at http://localhost:${PORT}`);
});
