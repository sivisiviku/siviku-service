require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

require("./router/cv_router")(app);

app.use(function (err, req, res, next) {
  if (err.code === "LIMIT_FILE_TYPES") {
    res.status(422).json({ error: "Only images are allowed" });
    return;
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(422).json({
      error: `Max file size is 200Kb`,
    });
    return;
  }
});

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Running on ${process.env.HOST}:${process.env.PORT}`);
});
