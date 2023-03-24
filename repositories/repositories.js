import fs from 'node:fs';

const readFile = async () => {

  fs.readFile('./database/data.json', (err, data) => {
    if (err) throw err;
    return data
  });

}

readFile()
export default readFile



