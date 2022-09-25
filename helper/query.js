exports.execute = (database, statement) => {
  return new Promise((resolve, reject) => {
    database.query(statement, (err, rows) => {
      if (err) {
        resolve({
          status: "error",
          message: err,
          data: null,
        });
      } else {
        resolve({
          status: "success",
          message: null,
          data: rows,
        });
      }
    });
  });
};
