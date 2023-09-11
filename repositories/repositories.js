import { DEFAULT_HEADER } from "../util/util.js";
import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";
import { encrypt_password } from "../util/.password.js";

const readFile = async () => {
  return new Promise((resolve, reject) => {
    return fs.readFile("./database/.database.json", (error, data) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

const writeFile = async (data) => {
  const id = uuidv4();
  const database = await readFile();
  const info = JSON.parse(data);
  encrypt_password(id, info.password);
  database.push(info);
  return new Promise((resolve, reject) => {
    return fs.writeFile(
      "./database/.database.json",
      JSON.stringify(database),
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve("User successufully registered!");
      }
    );
  });
};

export { readFile, writeFile };
