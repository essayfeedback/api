const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
const cors = require("cors");
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
app.use(cors());
app.use(require("./logger"));
app.use("/api/essays", require("./src/routes/essays"));
app.use("/api/users", require("./src/routes/users"));
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`server ready at http://localhost:${PORT}`);
});
