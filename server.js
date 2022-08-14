// ==================================================
// IMPORTS
// ==================================================
const express = require("express");
const Datastore = require("nedb");
const app = express();
require("dotenv").config();

// ==================================================
// VARIABLES
// ==================================================
const PORT = process.env.PORT || 3000;
let USER_DATA;

// ==================================================
// EXPRESS APP RENDERING
// ==================================================
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
  // check if there is user already logged in
  if (!USER_DATA) {
    res.status(404).sendFile("./public/404.html", { root: __dirname });
  } else {
    res.sendFile("./public/home.html", { root: __dirname });
  }
});

app.get("/dashboard", (req, res) => {
  res.sendFile("./public/dashboard.html", { root: __dirname });
});

// ==================================================
// DATABASE [NeDB]
// ==================================================
const database = new Datastore("./database/database.db");
database.loadDatabase();

// ==================================================
// APIs
// ==================================================
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

app.get("/saveData", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    const user = USER_DATA;
    response.json(user);
  });
});
app.post("/saveData", (request, response) => {
  console.log("Server got a request!");
  USER_DATA = request.body;
  console.log(USER_DATA);
  response.json(USER_DATA);
});

// INSERT RECORDS
app.get("/record", (request, response) => {
  database.find({ username: USER_DATA.username }, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data[0].record);
  });
});
app.post("/record", (request, response) => {
  console.log("Server got a request!");
  const data = request.body;
  console.log("data", data);
  database.update(
    { username: USER_DATA.username },
    { $push: { record: data } }
  );
  response.json(data);
});

// ==================================================
// ERROR 404 PAGE
// ==================================================
app.use((req, res) => {
  res.status(404).sendFile("./public/404.html", { root: __dirname });
});
