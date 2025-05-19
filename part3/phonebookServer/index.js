const express = require("express");
const morgan = require("morgan");
const app = express();
require("dotenv").config();
const Person = require("./models/person");

app.use(express.json());

app.use(express.static("dist"));

morgan.token("body", (req) => JSON.stringify(req.body || {}));

app.use(
  morgan((tokens, req, res) => {
    let array = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms"
    ];
    if (req.method === "POST") {
      array.push("- body:", tokens.body(req, res));
    }
    return array.join(" ");
  })
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      error: "The name or number is missing"
    });
  }

  Person.findOne({ name: name })
    .then((alreadyExists) => {
      if (alreadyExists) {
        return res.status(400).json({
          error: "The name already exists in the phonebook"
        });
      }
      const person = new Person({
        name: name,
        number: number
      });
      person
        .save()
        .then((savedPerson) => res.json(savedPerson))
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  if (!body.number) {
    return res.status(400).json({ error: "Number is required" });
  }
  Person.findById(id)
    .then((person) => {
      if (!person) {
        res.status(404).end();
      }
      person.number = body.number;
      return person.save().then((changedPerson) => {
        res.json(changedPerson);
      });
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  const now = new Date();
  const length = persons.length;

  const html = `
    <html>
      <head><title>Current Date and phonebook entries</title></head>
      <body>
        <p>Phonebook has info for ${length}</p>
        <p>${now}</p>
      </body>
    </html>
  `;
  res.send(html);
});

const errorHandler = (error, req, res, next) => {
  console.log(error);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
