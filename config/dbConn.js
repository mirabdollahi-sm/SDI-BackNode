const { createPool } = require("mysql");

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "@Dmin1234",
});

module.exports = pool;
