const mysql = require('mysql');

require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

db.connect ((err) => {
  if (err) {
    console.log("Couldn't connect to db: " + err);
  }
  console.log("Successfully connected to db");
});
// connection.query('SELECT 1', function (error, results, fields) {
  // if (error) throw error;
  // connected!
// });
// connection.query()
//db.end((err) => {
  
// });

module.exports = db;