import sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";

let transaction;

// CONNECT TO DB
const db = new sqlite3.Database("database.db");

// CREATE TABLE
transaction = `CREATE TABLE IF NOT EXISTS users (fullname TEXT, email TEXT PRIMARY KEY, password TEXT, id TEXT, active TEXT )`;
db.run(transaction);

// QUERY ALL THE DATA
const readData = async () => {
  transaction = "SELECT  id, fullname, email, active FROM users";
  return new Promise((resolve, reject) => {
    db.all(transaction, (err, data) => {
      if (err) return reject(err.message);
      resolve(data);
    });
  });
};

// INSERTING INTO DB
const writeData = async (data) => {
  const info = JSON.parse(data);
  info["id"] = uuidv4();
  info["active"] = "false";

  const { fullname, email, password, id, active } = info;
  transaction =
    "INSERT INTO users(fullname, email, password, id, active) VALUES (?,?,?,?,?)";
  return new Promise((resolve, reject) => {
    db.run(transaction, [fullname, email, password, id, active], (err) => {
      if (err) return reject(err.message);
      resolve("User Successfully Registered!");
    });
  });
};

// QUERY SINGLE DATA
const singleUser = (id) => {
  transaction = `SELECT fullname, email, active FROM users WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.get(transaction, id, (err, data) => {
      if (err) return reject(err.message);
      resolve(data);
    });
  });
};

// SIGNIN VALIDATION
const signInValidation = (email) => {
  transaction = `SELECT * FROM users WHERE email = ?`;
  return new Promise((resolve, reject) => {
    db.get(transaction, email, (err, data) => {
      if (err) {
        reject(err.message);
        return;
      }
      resolve(data);
    });
  });
};

// ADD COLUMN TO TABLE
// transaction = "ALTER TABLE users ADD COLUMN";
// db.run(`${transaction} active TEXT`, (err) => {
//   if (err) return console.error(err.message);
//   console.log("Added");
// });

// transaction = "SELECT  * FROM users";
// db.all(transaction, (err, rows) => {
//   if (err) return console.error(err.message);
//   console.log(rows);
//   // rows.forEach((row) => console.log(row));
// });

// writeData();

// DROP TABLE
// db.run("DROP TABLE users");

// UPDATE
// transaction = `UPDATE users SET active = ?`;
// db.run(transaction, "true", (err) => {
//   if (err) return console.error(err.message);
// });

// DELETE
// transaction = `DELETE FROM users WHERE email = ?`;
// db.run(transaction, "peace@gmail.com", (err) => {
//   if (err) return console.error(err.message);
//   console.log("Deleted");
// });

export { readData, writeData, signInValidation, singleUser };
