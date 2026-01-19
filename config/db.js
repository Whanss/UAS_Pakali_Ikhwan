const mysql = require("mysql2");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // Tambahkan bagian SSL ini
  ssl: {
    minVersion: "TLSv1.2",
    ca: fs.readFileSync(process.env.DB_CA_PATH),
    rejectUnauthorized: true,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
