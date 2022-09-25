const cv_model = require("../model/cv_model");

exports.create = async (req, res) => {
  try {
    return res.send(
      await cv_model.create(
        `users_bio`,
        `users_id, first_name, last_name, photo, created, updated, created_by, updated_by`,
        `1, "${req.body.firstName}", "${req.body.lastName}", "${req.body.photo}", now(), now(), 1, 1`
      )
    );
  } catch (err) {
    return res.send({
      status: "error",
      message: err.message,
      data: null,
    });
  }
};

exports.upload_photo = async (req, res) => {
  try {
    console.log(req.file);
    return res.send(
      await cv_model.update(
        `users_bio`,
        `photo = "http://localhost:8081/images/${req.file.filename}"`,
        `users_bio_id=${req.body.usersBioId}`
      )
    );
  } catch (err) {
    return res.send({
      status: "error",
      message: err.message,
      data: null,
    });
  }
};
