const cv_model = require("../model/cv_model");
const dateformat = require("dateformat");

exports.create = async (req, res) => {
  try {
    let responseData = {};
    const insertedBio = await cv_model.create(
      `users_bio`,
      `users_id, first_name, last_name, occupation, photo, summary, created, updated, created_by, updated_by`,
      `1, "${req.body.firstName}", "${req.body.lastName}", "${req.body.occupation}", "${req.body.photo}", "${req.body.summary}", now(), now(), 1, 1`
    );
    if (insertedBio.data.insertId > 0) {
      responseData.users_bio_id = insertedBio.data.insertId;
      const insertedContact = await cv_model.create(
        `users_contact`,
        `users_id, address, phone, email, linkedin, created, updated, created_by, updated_by`,
        `1, "${req.body.contact.address}", "${req.body.contact.phone}", "${req.body.contact.email}", "${req.body.contact.linkedin}", now(), now(), 1, 1`
      );
      if (insertedContact.data.insertId > 0) {
        responseData.users_contact_id = insertedContact.data.insertId;
        const languageValues = req.body.languages.map((language) => [
          "1",
          language,
          dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
          dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
          "1",
          "1",
        ]);
        const insertedLanguages = await cv_model.create_bulk(
          `users_languages`,
          `users_id, language, created, updated, created_by, updated_by`,
          languageValues
        );
        if (insertedLanguages.data.affectedRows === languageValues.length) {
          responseData.languages_count = insertedLanguages.data.affectedRows;
          const skillValues = req.body.skills.map((skill) => [
            "1",
            skill.name,
            skill.level,
            dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
            dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
            "1",
            "1",
          ]);
          const insertedSkills = await cv_model.create_bulk(
            `users_skills`,
            `users_id, name, level, created, updated, created_by, updated_by`,
            skillValues
          );
          if (insertedSkills.data.affectedRows === skillValues.length) {
            responseData.skills_count = insertedSkills.data.affectedRows;
            //insert experience
            responseData.status = insertedSkills.status; // should be called at the very end of insertion process
          }
        }
      } else {
        // delete last inserted bio
      }
    }
    return res.send(responseData);
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
