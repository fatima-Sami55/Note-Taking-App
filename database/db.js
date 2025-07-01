require('dotenv').config();
const mysql = require('mysql2');

// Create connection
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true
});

// Connect
db.connect((err) => {
  if (err) {
    console.error("❌ Failed to connect to MySQL:", err.message);
    process.exit(1);
  } else {
    console.log("✅ MySQL Connected");
  }
});

module.exports = db;
