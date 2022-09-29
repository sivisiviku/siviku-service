const cv_model = require("../model/cv_model");
const dateformat = require("dateformat");

exports.create = async (req, res) => {
  try {
    let responseData = {};

    // INSERT BIO
    const insertedBio = await cv_model.create(
      `users_bio`,
      `users_id, first_name, last_name, occupation, photo, summary, created, updated, created_by, updated_by`,
      `1, "${req.body.firstName}", "${req.body.lastName}", "${req.body.occupation}", "${req.body.photo}", "${req.body.summary}", now(), now(), 1, 1`
    );

    // IF INSERT BIO SUCCESSFUL, PROCEED TO INSERT CONTACT
    if (insertedBio.data.insertId > 0) {
      responseData.users_bio_id = insertedBio.data.insertId;

      // INSERT CONTACT
      const insertedContact = await cv_model.create(
        `users_contact`,
        `users_id, address, phone, email, linkedin, created, updated, created_by, updated_by`,
        `1, "${req.body.contact.address}", "${req.body.contact.phone}", "${req.body.contact.email}", "${req.body.contact.linkedin}", now(), now(), 1, 1`
      );

      // IF INSERT CONTACT SUCCESSFUL, PROCEED TO INSERT LANGUAGES
      if (insertedContact.data.insertId > 0) {
        responseData.users_contact_id = insertedContact.data.insertId;

        // INSERT LANGUAGES
        const languageValues = req.body.languages.map((language) => [
          "1",
          language.name,
          language.level,
          dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
          dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
          "1",
          "1",
        ]);
        const insertedLanguages = await cv_model.create_bulk(
          `users_languages`,
          `users_id, name, level, created, updated, created_by, updated_by`,
          languageValues
        );

        // IF INSERT LANGUAGES SUCCESSFUL, PROCEED TO INSERT SKILLS
        if (insertedLanguages.data.affectedRows === languageValues.length) {
          responseData.languages_count = insertedLanguages.data.affectedRows;

          // INSERT SKILLS
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

          // IF INSERT SKILLS SUCCESSFUL, PROCEED TO INSERT EXPERIENCES
          if (insertedSkills.data.affectedRows === skillValues.length) {
            responseData.skills_count = insertedSkills.data.affectedRows;

            // INSERT EXPERIENCES ONE BY ONE
            req.body.experiences.forEach(async (experience) => {
              const insertedExperiences = await cv_model.create(
                `users_experiences`,
                `users_id, company_name, company_address, title, date_start, date_end, created, updated, created_by, updated_by`,
                `1, "${experience.companyName}", "${
                  experience.companyAddress
                }", "${experience.title}", "${dateformat(
                  experience.dateStart,
                  "yyyy-mm-dd HH:MM:ss"
                )}", "${dateformat(
                  experience.dateEnd,
                  "yyyy-mm-dd HH:MM:ss"
                )}", now(), now(), 1, 1`
              );

              // IF INSERT EXPERIENCE ABOVE SUCCESSFUL, PROCEED TO INSERT JOB DESCRIPTIONS
              if (insertedExperiences.data.insertId > 0) {
                // INSERT JOB DESCRIPTIONS
                const jobDescriptionValues = experience.jobDescriptions.map(
                  (jobDescription) => [
                    insertedExperiences.data.insertId,
                    "1",
                    jobDescription,
                    dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
                    dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
                    "1",
                    "1",
                  ]
                );
                const insertedJobDescriptions = await cv_model.create_bulk(
                  `users_job_descriptions`,
                  `users_experiences_id, users_id, job_description, created, updated, created_by, updated_by`,
                  jobDescriptionValues
                );

                // IF INSERT JOB DESCRIPTIONS FAIL, DELETE BIO, CONTACT, LANGUAGES, SKILLS, EXPERIENCES, JOB DESCRIPTIONS, EDUCATIONS, CERTIFICATIONS WITH USERS ID
                if (
                  insertedJobDescriptions.data.affectedRows !==
                  jobDescriptionValues.length
                ) {
                  // DELETE BIO, CONTACT, LANGUAGES, SKILLS, EXPERIENCES, JOB DESCRIPTIONS, EDUCATIONS, CERTIFICATIONS WITH USERS ID
                }
              } else {
                // DELETE BIO, CONTACT, LANGUAGES, SKILLS, EXPERIENCES, JOB DESCRIPTIONS, EDUCATIONS, CERTIFICATIONS WITH USERS ID
              }
            });

            responseData.experiences_count = req.body.experiences.length;

            // INSERT EDUCATIONS
            const educationValues = req.body.educations.map((education) => [
              "1",
              education.schoolName,
              education.schoolAddress,
              education.major,
              education.degree,
              dateformat(education.dateGraduated, "yyyy-mm-dd HH:MM:ss"),
              dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
              dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
              "1",
              "1",
            ]);
            const insertedEducations = await cv_model.create_bulk(
              `users_educations`,
              `users_id, school_name, school_address, major, degree, date_graduated, created, updated, created_by, updated_by`,
              educationValues
            );

            // IF INSERT EDUCATIONS SUCCESSFUL, PROCEED TO INSERT CERTIFICATIONS
            if (
              insertedEducations.data.affectedRows === educationValues.length
            ) {
              responseData.educations_count =
                insertedEducations.data.affectedRows;

              // INSERT EXPERIENCES ONE BY ONE
              const certificationValues = req.body.certifications.map(
                (certification) => [
                  "1",
                  certification,
                  dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
                  dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss"),
                  "1",
                  "1",
                ]
              );
              const insertedCertifications = await cv_model.create_bulk(
                `users_certifications`,
                `users_id, certification, created, updated, created_by, updated_by`,
                certificationValues
              );

              if (
                insertedCertifications.data.affectedRows ===
                certificationValues.length
              ) {
                responseData.certifications_count =
                  insertedCertifications.data.affectedRows;
                responseData.status = insertedCertifications.status;
              } else {
                // DELETE BIO, CONTACT, LANGUAGES, SKILLS, EXPERIENCES, JOB DESCRIPTIONS, EDUCATIONS, CERTIFICATIONS WITH USERS ID
              }
            } else {
              // DELETE BIO, CONTACT, LANGUAGES, SKILLS, EXPERIENCES, JOB DESCRIPTIONS, EDUCATIONS, CERTIFICATIONS WITH USERS ID
            }
          } else {
            // DELETE BIO, CONTACT, LANGUAGES, SKILLS, EXPERIENCES, JOB DESCRIPTIONS, EDUCATIONS, CERTIFICATIONS WITH USERS ID
          }
        } else {
          // DELETE BIO, CONTACT, LANGUAGES, SKILLS, EXPERIENCES, JOB DESCRIPTIONS, EDUCATIONS, CERTIFICATIONS WITH USERS ID
        }
      } else {
        // DELETE BIO, CONTACT, LANGUAGES, SKILLS, EXPERIENCES, JOB DESCRIPTIONS, EDUCATIONS, CERTIFICATIONS WITH USERS ID
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

exports.view = async (req, res) => {
  try {
    const usersBio = await cv_model.readBy(
      `users_bio`,
      `users_id=${req.params.id}`
    );
    const usersCertifications = await cv_model.readBy(
      `users_certifications`,
      `users_id=${req.params.id}`
    );
    const usersContact = await cv_model.readBy(
      `users_contact`,
      `users_id=${req.params.id}`
    );

    const usersEducations = await cv_model.readBy(
      `users_educations`,
      `users_id=${req.params.id}`
    );

    for (let i = 0; i < usersEducations.data.length; i++) {
      const newDate = new Date(usersEducations.data[i].date_graduated);
      usersEducations.data[i].date_graduated = newDate.getFullYear();
    }

    const usersExperiences = await cv_model.readBy(
      `users_experiences`,
      `users_id=${req.params.id}`
    );

    for (let i = 0; i < usersExperiences.data.length; i++) {
      usersExperiences.data[i].date_start = formatDate(
        usersExperiences.data[i].date_start
      );
      usersExperiences.data[i].date_end = formatDate(
        usersExperiences.data[i].date_end
      );
      const jobDescriptions = await cv_model.readBy(
        `users_job_descriptions`,
        `users_experiences_id=${usersExperiences.data[i].users_experiences_id}`
      );
      usersExperiences.data[i].job_descriptions = jobDescriptions.data;
    }

    const usersLanguages = await cv_model.readBy(
      `users_languages`,
      `users_id=${req.params.id}`
    );
    const usersSkills = await cv_model.readBy(
      `users_skills`,
      `users_id=${req.params.id}`
    );

    const data = {
      users_bio: usersBio.data[0],
      users_certifications: usersCertifications.data,
      users_contact: usersContact.data[0],
      users_educations: usersEducations.data,
      users_experiences: usersExperiences.data,
      users_languages: usersLanguages.data,
      users_skills: usersSkills.data,
    };

    return res.send(data);
  } catch (err) {
    return res.send({
      status: "error",
      message: err.message,
      data: null,
    });
  }
};

exports.view_bio = async (req, res) => {
  try {
    const usersBio = await cv_model.readBy(
      `users_bio`,
      `users_id=${req.params.id}`
    );

    usersBio.data = usersBio.data[0];

    return res.send(usersBio.data);
  } catch (err) {
    return res.send({
      status: "error",
      message: err.message,
      data: null,
    });
  }
};

function formatDate(date) {
  const newDate = new Date(date);
  const monthDate = newDate.getMonth() + 1;
  const yearDate = newDate.getFullYear();
  return `${monthDate}/${yearDate}`;
}
