const getLoggerForStatusCode = function(statusCode) {
  if (statusCode >= 500) {
    return console.error.bind(console);
  }
  if (statusCode >= 400) {
    return console.warn.bind(console);
  }
  return console.log.bind(console);
};

const logger = function(req, res, next) {
  console.info(req.method + " " + req.originalUrl);
  const cleanup = function() {
    res.removeListener("finish", logFn);
    res.removeListener("close", abortFn);
    res.removeListener("error", errorFn);
  };
  const logFn = function() {
    cleanup();
    const logger = getLoggerForStatusCode(res.statusCode);
    logger(res.statusCode + " " + res.statusMessage + "; " + (res.get("Content-Length") || 0) + "b sent");
  };
  const abortFn = function() {
    cleanup();
    console.warn("Request aborted by the client");
  };
  const errorFn = function(err) {
    cleanup();
    console.error("Request pipeline error: " + err);
  };
  res.on("finish", logFn); // successful pipeline (regardless of its response)
  res.on("close", abortFn); // aborted pipeline
  res.on("error", errorFn); // pipeline internal error
  next();
};

module.exports = logger;
