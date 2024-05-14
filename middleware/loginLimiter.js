const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many accounts created from this IP, please try again after an 60 seconds",
  },
  handler: (req, res, next) => {
    logEvents(
      `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
