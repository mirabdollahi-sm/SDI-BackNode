
const { createPool } = require('mysql');

const pool = createPool({
    host: "127.0.0.1",
    user: "root",
    password: "@Dmin123",
})

module.exports = pool;