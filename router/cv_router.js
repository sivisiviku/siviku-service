const cv_controller = require("../controller/cv_controller");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./public/images");
  },
  filename: function (request, file, callback) {
    const file_arr = file.originalname.split(".");
    callback(null, `${file_arr[0]}-${Date.now()}.${file_arr[1]}`);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = (app) => {
  app.post("/create-cv", cv_controller.create);
  app.post("/upload-photo", upload.single("file"), cv_controller.upload_photo);
};
