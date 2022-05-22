const express = require("express");
const Datastore = require("nedb");
const app = express();

app.listen(3000, () => {
  console.log("listening at 3000");
});

app.use(express.static("public"));
app.use(express.json());

const database = new Datastore("./public/database/database.db");
database.loadDatabase();

app.get("/api", (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post("/api", (request, response) => {
  console.log("Server got a request!");
  const data = request.body;
  database.insert(data);

  response.json(data);
});
