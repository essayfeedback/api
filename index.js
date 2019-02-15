const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
const cors = require("cors");
const {
  mongodb: { username, password }
} = require("./secrets.json");

mongoose.connect(`mongodb://${username}:${encodeURIComponent(password)}@ds161804.mlab.com:61804/essayfeedback`, { useNewUrlParser: true });
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(require("./logger"));
app.use("/api/essays", require("./routes/essays"));
app.use("/api/users", require("./routes/users"));
app.listen(PORT, err => {
  if (err) throw err;
  console.info(`server ready at http://localhost:${PORT}`);
});

mongoose.set("debug", true);
mongoose.connection.on("connected", function() {
  console.info("Mongoose is connected");
});

mongoose.connection.on("error", function(err) {
  console.error("Mongoose connection error: " + err);
});

mongoose.connection.on("disconnected", function() {
  console.warn("Mongoose connection disconnected");
});

process.on("SIGINT", function() {
  mongoose.connection.close(function() {
    console.log("Mongoose connection disconnected through app termination");
    process.exit(0);
  });
});
