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

const fileFilter = function (req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error();
    error.code = "LIMIT_FILE_TYPES";
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 200000,
  },
});

module.exports = (app) => {
  app.post("/create-cv", cv_controller.create);
  app.post("/upload-photo", upload.single("file"), cv_controller.upload_photo);
  app.get("/view-cv/:id", cv_controller.view);
  app.get("/view-bio/:id", cv_controller.view_bio);
  app.post("/delete", cv_controller.delete);
};
