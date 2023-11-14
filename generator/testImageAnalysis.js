const OpenAI = require("openai");
const openai = new OpenAI();

module.exports = async () => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    max_tokens: 4096,
    messages: [
      {
        "role": "user", 
        "content": [
          { type: "text", text: 'Describe what this logo is and its colors in a sonnet' },
          {
            type: "image_url",
            image_url: {
              detail: "low",
              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2880px-Google_2015_logo.svg.png',
            },
          },
        ],
      },
    ]       
  });

  console.log(JSON.stringify(response, null, 2))
}