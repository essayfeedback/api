const bodyParser = require("body-parser");
const customLogger = require("./logger");

module.exports = [bodyParser.json(), bodyParser.urlencoded({ extended: true }), customLogger];
