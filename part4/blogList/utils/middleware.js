const logger = require("./logger");
const morgan = require("morgan");

morgan.token("body", (req) => JSON.stringify(req.body));

const requestLogger = morgan((tokens, req, res) => {
  const parts = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms"
  ];

  if (req.method === "POST") {
    parts.push("- body:", tokens.body(req, res));
  }

  return parts.join(" ");
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = { requestLogger, unknownEndpoint, errorHandler };
