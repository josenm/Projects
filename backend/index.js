const firebase = require("./firebase");
const express = require("express");
const parser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(parser.json());
app.use(
  parser.urlencoded({
    extended: false,
  })
);

app.use(cors(process.env.CORS_ORIGIN));

app.get("/status", function (req, res, next) {
  res.json({ status: "UP" });
});

app.get("/users", firebase.getDatabaseElements);
app.post("/users", firebase.signUser);
app.delete("/users/:id", firebase.deleteUserDB);
app.put("/users/:id", firebase.updateUser);

app.listen(process.env.PORT || 5000, () => {
  ////console.log("Running on port ", 5000);
});
