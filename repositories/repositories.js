import sqlite3 from "sqlite3";
// import { v4 as uuidv4 } from "uuid";

let transaction;

// CONNECT TO DB
const db = new sqlite3.Database("database.db");

// CREATE USER TABLE
transaction = `CREATE TABLE IF NOT EXISTS users (fullname TEXT, email TEXT PRIMARY KEY, password TEXT, id TEXT)`;
db.run(transaction);

// CREATE MESSAGE TABLE
transaction = `CREATE TABLE IF NOT EXISTS messages (message TEXT, "from" TEXT, "to" TEXT, year INTEGER, month INTEGER, day INTEGER, hour INTEGER, minute INTEGER, second INTEGER)`;
db.run(transaction);

// QUERY ALL THE DATA
const readData = async () => {
  transaction = "SELECT  id, fullname, email, color FROM users";
  return new Promise((resolve, reject) => {
    db.all(transaction, (err, data) => {
      if (err) return reject(err.message);
      resolve(data);
    });
  });
};

// INSERTING INTO DB
const writeData = async (data) => {
  const { fullname, email, password, id, active, color } = data;
  transaction =
    "INSERT INTO users(fullname, email, password, id, color) VALUES (?,?,?,?,?)";
  return new Promise((resolve, reject) => {
    db.run(transaction, [fullname, email, password, id, color], (error) => {
      if (error) return reject(error.message);
      resolve("User Successfully Registered!");
    });
  });
};

const writeMessage = async (msg) => {
  transaction = `INSERT INTO messages(message, 'from', 'to', year, month, day, hour, minute, second) VALUES(?,?,?,?,?,?,?,?,?)`;
  return new Promise((resolve, reject) => {
    db.run(
      transaction,
      [
        msg.message,
        msg.from,
        msg.to,
        msg.date.year,
        msg.date.month,
        msg.date.day,
        msg.date.hour,
        msg.date.minute,
        msg.date.second,
      ],
      (err) => {
        if (err) {
          return reject(err);
        }
        console.log("message successfully stored");
        resolve("Message Successfully Stored!");
      }
    );
  });
};

const readMessages = () => {
  transaction = `SELECT * from messages`;

  return new Promise((resolve, reject) => {
    db.all(transaction, (err, data) => {
      if (err) {
        return reject(err.message);
      }
      resolve(data);
    });
  });
};

const activeSection = (data) => {
  transaction = `UPDATE users SET active = ? WHERE email = ?`;
  db.run(transaction, [data.status, data.email], (err) => {
    if (err) return console.error(err.message);
  });
};

// QUERY SINGLE DATA
const singleUser = (id) => {
  transaction = `SELECT fullname, email, active, color FROM users WHERE id = ?`;
  return new Promise((resolve, reject) => {
    db.get(transaction, id, (err, data) => {
      if (err) return reject(err.message);
      resolve(data);
    });
  });
};

// SIGNIN VALIDATION
const signInValidation = (email) => {
  transaction = `SELECT email, password, id FROM users WHERE email = ?`;
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
// transaction = "ALTER TABLE users DROP COLUMN active";
// db.run(`${transaction}`, (err) => {
//   if (err) return console.error(err.message);
//   console.log("Dropped");
// });

// transaction = "SELECT  * FROM messages";
// db.all(transaction, (err, rows) => {
//   if (err) return console.error(err.message);
//   console.log(rows);
//   // rows.forEach((row) => console.log(row));
// });

// writeData();

// DROP TABLE
// db.run("DROP TABLE users");

// UPDATE USER
// transaction = `UPDATE users SET color = ? WHERE email = ?`;
// db.run(transaction, ["#581d0a", "peace@gmail.com"], (err) => {
//   if (err) return console.error(err.message);
// });

// DELETE USER
// transaction = `DELETE FROM users WHERE email = ?`;
// db.run(transaction, "nathan@gmail.com", (err) => {
//   if (err) return console.error(err.message);
//   console.log("Deleted");
// });

// DELETE MESSAGES
// transaction = `DELETE FROM messages WHERE "to" = ?`;
// db.run(transaction, "9eb3df37-1b7e-4f54-95f2-dc528cf9a0f8", (err) => {
//   if (err) return console.error(err.message);
//   console.log("Deleted");
// });

export {
  readData,
  writeData,
  signInValidation,
  singleUser,
  activeSection,
  writeMessage,
  readMessages,
};
