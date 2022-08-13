const { log } = require("console");
const express = require("express");
const Datastore = require("nedb");
const path = require("path");
const app = express();
require("dotenv").config();

// set port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening at ${PORT}`));

app.use(express.static("public"));
app.use(express.json());

// set path to static files
app.get("/", (req, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});

app.get("/auth", (req, res) => {
  res.sendFile("./public/auth.html", { root: __dirname });
});

app.get("/home", (req, res) => {
  if (!userData) {
    res.status(404).sendFile("./public/404.html", { root: __dirname });
  } else {
    res.sendFile("./public/home.html", { root: __dirname });
  }
});

app.get("/dashboard", (req, res) => {
  res.sendFile("./public/dashboard.html", { root: __dirname });
});

// create and load database
const database = new Datastore("./database/database.db");
database.loadDatabase();

// INSERT USERS
app.get("/createUser", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});
app.post("/createUser", (request, response) => {
  console.log("Server got a request!");
  const data = request.body;
  database.insert(data);
  response.json(data);
});

// SAVE USER DATA
let userData;
app.get("/saveData", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    const user = userData;
    response.json(user);
  });
});
app.post("/saveData", (request, response) => {
  console.log("Server got a request!");
  userData = request.body;
  console.log(userData);
  response.json(userData);
});

// INSERT RECORDS
app.get("/insertRecord", (request, response) => {
  database.find({ username: userData.username }, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});
app.post("/insertRecord", (request, response) => {
  console.log("Server got a request!");
  const data = request.body;
  console.log("data", data);
  database.update(data);
  response.json(data);
});

// ERROR 404 PAGE
app.use((req, res) => {
  res.status(404).sendFile("./public/404.html", { root: __dirname });
});
