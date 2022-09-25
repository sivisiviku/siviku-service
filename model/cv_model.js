const database = require("../config/database");
const query = require("../helper/query");

exports.create = async (table, columns, values) => {
  const result = await query.execute(
    database,
    `insert into ${table}(${columns}) values(${values})`
  );
  return result;
};

exports.update = async (table, set, where) => {
  const result = await query.execute(
    database,
    `update ${table} set ${set} where ${where}`
  );
  return result;
};
