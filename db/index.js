const mongoose = require("mongoose");

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

module.exports = mongoose;
