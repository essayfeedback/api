const bodyParser = require("body-parser");
const customLogger = require("./logger");

export default [bodyParser.json(), bodyParser.urlencoded({ extended: true }), customLogger];
