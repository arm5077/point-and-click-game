const checkMapForErrors = require('./checkMapForErrors');
const OpenAI = require("openai");
const openai = new OpenAI();


const {
  prompt,
} = require('./constants');

const model = 'gpt-4-1106-preview';
const response_format = { type: "json_object" };
//const temperature = 1.5;

module.exports = async () => {
  const messages = [
    {
      "role": "user", 
      "content": prompt,
    }
  ];
  const response = await openai.chat.completions.create({
    model,
    response_format,
    messages,     
  });

  console.log('final response', response.usage);

  const dataRaw = response.choices[0].message.content;
  const data = JSON.parse(dataRaw);

  const checkedData = checkMapForErrors(data);

  return checkedData;
}