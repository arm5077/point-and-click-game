const OpenAI = require("openai");
const openai = new OpenAI();

const { imageAnalysisPrompt } = require('./constants');

module.exports = async ({ room, url }) => {
    console.log(`Analyzing image for ${room.name}`)
    const prompt = `
      ${imageAnalysisPrompt}

      Here's the JSON for the room.

      ${JSON.stringify(room)}
    `;
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 4096,
      messages: [
        {
          "role": "user", 
          "content": [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url,
              },
            },
          ],
        },
      ]       
    });

    const dataRaw = response.choices[0].message.content;
    
    const data = JSON.parse(dataRaw);

    const { exits, actions } = data;

    Object.entries(exits).forEach(([key, exit]) => {
      room.exits[key] = {
        ...room.exits[key],
        ...exit
      }
    });

    Object.entries(actions).forEach(([key, action]) => {
      room.actions[key] = {
        ...room.actions[key],
        ...action
      }
    });
}