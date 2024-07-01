/** Database setup for BizTime. */

const { Client } = require("pg");
require('dotenv').config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbname = process.env.DB_NAME;

let DB_URI;

// If we're running in test "mode", use our test db
// Make sure to create both databases!
if (process.env.NODE_ENV === "test") {
  DB_URI = `postgresql://${username}:${password}@localhost:5432/${dbname}_test`;
} else {
  DB_URI = process.env.DATABASE_URL || `postgresql://${username}:${password}@localhost:5432/${dbname}`;
}

console.log('DB_URI:', DB_URI);

let db = new Client({
  connectionString: DB_URI
});

db.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Connection error', err));;

module.exports = db;