require('dotenv').config();
const fs = require('fs');

const makeMap = require('./makeMap');
const makeRoomImage = require('./makeRoomImage');


const {
  DATA_FOLDER,
} = require('./constants');
const analyzeImage = require('./analyzeImage');

(async () => {
  console.log('Starting generation...');

  const data = await makeMap();
  const { rooms, features } = data;

  fs.writeFileSync(`${DATA_FOLDER}/output.json`, JSON.stringify(data, null, 2));

  for (const room of rooms) {
    const url = await makeRoomImage(room);
    fs.writeFileSync(`${DATA_FOLDER}/output.json`, JSON.stringify(data, null, 2));
  }
    

})();