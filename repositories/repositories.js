import fs from "node:fs";
import { v4 as uuidv4 } from "uuid";

const readFile = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile("./database/.database.json", (error, data) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

const writeFile = async (data) => {
  const database = await extended(data);

  return new Promise((resolve, reject) => {
    fs.writeFile(
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

const extended = async (data) => {
  const database = await readFile();
  const info = JSON.parse(data);

  info["id"] = uuidv4();
  info["active"] = false;

  database.push(info);
  return database;
};

export { readFile, writeFile };
