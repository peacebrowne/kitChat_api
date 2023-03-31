import fs from 'node:fs';
import valid from '../valid/valid.js';

let database;

const readFile = async () => {

  fs.readFile('./database/data.json', (err, data) => {
    if (err) throw err;
    database = JSON.parse(data)
  });

}

readFile()

const writeFile = async data => {

  const response = await valid.email(data.email)

  if(response) return
  
  database.push(data)
  fs.writeFile('./database/data.json', JSON.stringify(database), (err) => {
    if (err) throw err;
    console.log('The file has been saved!', data);
  });

}

export {
  readFile,
  writeFile
} 



