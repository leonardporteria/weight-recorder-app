const express = require("express");
const Datastore = require("nedb");
const app = express();

app.listen(3000, () => console.log("listening at 3000"));

app.use(express.static("public"));
app.use(express.json());

const database = new Datastore("./public/database/database.db");
database.loadDatabase();

app.get("/", (req, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});

app.get("/auth", (req, res) => {
  res.sendFile("./public/auth.html", { root: __dirname });
});

app.get("/home", (req, res) => {
  res.sendFile("./public/home.html", { root: __dirname });
});

app.get("/dashboard", (req, res) => {
  res.sendFile("./public/dashboard.html", { root: __dirname });
});

// GET REQUEST
app.get("/api", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

// POST REQUEST
app.post("/api", (request, response) => {
  console.log("Server got a request!");
  const data = request.body;
  database.insert(data);

  response.json(data);
});

// ERROR 404 PAGE
app.use((req, res) => {
  res.status(404).sendFile("./public/404.html", { root: __dirname });
});
