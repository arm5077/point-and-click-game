const https = require('https');
const fs = require('fs');
const OpenAI = require("openai");
const openai = new OpenAI();
const analyzeImage = require('./analyzeImage');

const {
  IMAGE_FOLDER,
  roomPrompt,
} = require('./constants');

module.exports = async (room) => {
    const { id, description } = room;
    const filename = `${IMAGE_FOLDER}/room-${id}.png`;
    room.imageURL = `./images/room-${id}.png`;

    console.log(`Making room ${id}`);
    const image = await openai.images.generate({ 
      model: "dall-e-3", 
      size: "1792x1024",
      prompt: `${roomPrompt} Here's the description: ${description}`
    });

    const { url } = image.data[0];
    
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
    });

    await analyzeImage({room, url});

    return url;

}