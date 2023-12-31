import sqlite3 from "sqlite3";

let transaction;

// CONNECT TO DB
const db = new sqlite3.Database("database.db");

// CREATE USER TABLE
transaction = `CREATE TABLE IF NOT EXISTS users (
                fullname TEXT NOT NULL, email TEXT PRIMARY KEY NOT NULL, password TEXT NOT NULL, id TEXT NOT NULL, color TEXT NOT NULL
              );`;
db.run(transaction);

// CREATE MESSAGE TABLE
transaction = `CREATE TABLE IF NOT EXISTS messages ( 
                message TEXT NOT NULL, "from" TEXT NOT NULL, "to" TEXT NOT NULL,  id INTEGER PRIMARY KEY NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                );`;
db.run(transaction);

// QUERY ALL THE DATA
const readData = async () => {
  transaction = "SELECT  id, fullname, color FROM users";
  return new Promise((resolve, reject) => {
    db.all(transaction, (err, data) => {
      if (err) return reject(err.message);
      resolve(data);
    });
  });
};

// INSERTING INTO DB
const writeData = async (data) => {
  const { fullname, email, password, id, color } = data;

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
  transaction = `INSERT INTO messages(message, 'from', 'to') VALUES(?,?,?)`;
  return new Promise((resolve, reject) => {
    db.run(transaction, [msg.message, msg.from, msg.to], (err) => {
      if (err) {
        return reject(err);
      }
      resolve("Message Successfully Stored!");
    });
  });
};

const readMessages = () => {
  transaction = `SELECT * from messages ORDER BY id DESC`;
  return new Promise((resolve, reject) => {
    db.all(transaction, (err, data) => {
      if (err) {
        return reject(err.message);
      }
      resolve(data);
    });
  });
};

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

export {
  readData,
  writeData,
  signInValidation,
  singleUser,
  writeMessage,
  readMessages,
  // previousMessages,
};
