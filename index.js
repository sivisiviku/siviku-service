const express = require("express");
const multer = require("multer");

const app = express();

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./uploads");
  },
  filename: function (request, file, callback) {
    const file_arr = file.originalname.split(".");
    callback(null, `${file_arr[0]}-${Date.now()}.${file_arr[1]}`);
  },
});

const upload = multer({
  storage: storage,
});

app.post("/create-cv", upload.single("file"), (req, res) => {
  res.json({ file: req.file });
});

app.listen(8081, () => console.log("Running on localhost:8081"));
