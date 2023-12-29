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
  const { fullname, email, password, id, color } = data;
  console.log(data);

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

// const previousMessages = (userID, friendID) => {
//   transaction = `SELECT * FROM messages WHERE "from" = ? AND "to" = ? OR "from" = ? AND "to" = ? ORDER BY id DESC`;
//   return new Promise((resolve, reject) => {
//     db.get(transaction, [userID, friendID, friendID, userID], (err, data) => {
//       if (err) {
//         return reject(err.message);
//       }
//       console.log(data);
//       resolve(data);
//     });
//   });
// };

// previousMessages(
//   "4fceb844-3588-4b90-a3fb-7cecda33c619",
//   "4ddbb7b9-e881-46d5-ac34-69c6ccf6cffc"
// );

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
// transaction = "ALTER TABLE messages ADD COLUMN id";
// transaction = "ALTER TABLE messages DROP COLUMN timestamp";
// db.run(`${transaction}`, (err) => {
//   if (err) return console.error(err.message);
//   console.log("Added");
// });

// transaction = "SELECT  * FROM messages";
// db.all(transaction, (err, rows) => {
//   if (err) return console.error(err.message);
//   console.log(rows);
//   // rows.forEach((row) => console.log(row));
// });

// writeData();

// DROP TABLE
// db.run("DROP TABLE messages");

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

// DELETE MESSAGES/
// transaction = `DELETE FROM messages`;
// db.run(transaction, (err) => {
//   if (err) return console.error(err.message);
//   console.log("Deleted");
// });

export {
  readData,
  writeData,
  signInValidation,
  singleUser,
  writeMessage,
  readMessages,
  // previousMessages,
};
