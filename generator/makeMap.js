const OpenAI = require("openai");
const openai = new OpenAI();

// Remove after debugging
const fs = require('fs');

const {
  DATA_FOLDER,
  SET_UP_NARRATIVE_PROMPT,
  CREATE_ROOMS_PROMPT,
  CHECK_ROOMS_PROMPT,
  CREATE_ACTIONS_PROMPT,
  UPDATE_EXITS_PROMPT,
  CREATE_ENDING_PROMPT,
} = require('./constants');

const model = 'gpt-4-1106-preview';
const response_format = { type: "json_object" };
//const temperature = 1.5;

let json = '{}';

function makeMessage (prompt) {
  const content = `
    The current JSON is:
    \`\`\`
      ${JSON.stringify(JSON.parse(json), null, 2)}
    \`\`\`
    
    ${prompt}
  `
  return {
    "role": "user", 
    content,
  }
}

function runAI (messages) {
  fs.writeFileSync(`${DATA_FOLDER}/01-messages.json`, JSON.stringify(messages, null, 2));
  return openai.chat.completions.create({
    model,
    response_format,
    messages,
  }); 
}

module.exports = async () => {
  const messages = [
    makeMessage(SET_UP_NARRATIVE_PROMPT)
  ];

  console.log('Generating narrative prompt...');

 

  const response = await runAI(messages)
  .then(res => {
    json = res.choices[0].message.content;
    fs.writeFileSync(`${DATA_FOLDER}/01-welcome.json`, json);
    //fs.writeFileSync(`${DATA_FOLDER}/01-messages.json`, JSON.stringify(messages, null, 2));

    console.log('Generating rooms...');
    //messages.push(res.choices[0].message);
    // messages.push(makeMessage(CREATE_ROOMS_PROMPT));
    // return runAI(messages);
    return runAI([makeMessage(CREATE_ROOMS_PROMPT)])
  }).then(res => {
    json = res.choices[0].message.content;
    fs.writeFileSync(`${DATA_FOLDER}/02-rooms.json`, json);
    // fs.writeFileSync(`${DATA_FOLDER}/02-messages.json`, JSON.stringify(messages, null, 2));

    console.log('Checking rooms...');
    //messages.push(res.choices[0].message);
    // messages.push(makeMessage(CHECK_ROOMS_PROMPT));
    // return runAI(messages);
    return runAI([makeMessage(CHECK_ROOMS_PROMPT)])
  }).then(res => {
    json = res.choices[0].message.content;
    fs.writeFileSync(`${DATA_FOLDER}/03-checking-rooms.json`, json);
    // fs.writeFileSync(`${DATA_FOLDER}/03-messages.json`, JSON.stringify(messages, null, 2));

    console.log('Generating actions...');
    //messages.push(res.choices[0].message);
    //messages.push(makeMessage(CREATE_ACTIONS_PROMPT));
    return runAI([makeMessage(CREATE_ACTIONS_PROMPT)])
  }).then(res => {
    json = res.choices[0].message.content;
    fs.writeFileSync(`${DATA_FOLDER}/04-actions.json`, json);
    // fs.writeFileSync(`${DATA_FOLDER}/04-messages.json`, JSON.stringify(messages, null, 2));

    console.log('Updating exits...');
    //messages.push(res.choices[0].message);
    //messages.push(makeMessage(UPDATE_EXITS_PROMPT));
    return runAI([makeMessage(UPDATE_EXITS_PROMPT)])
  }).then(res => {
    json = res.choices[0].message.content;
    fs.writeFileSync(`${DATA_FOLDER}/05-exits.json`, json);
    // fs.writeFileSync(`${DATA_FOLDER}/05-messages.json`, JSON.stringify(messages, null, 2));

    console.log('Checking rooms again...');
    //messages.push(res.choices[0].message);
    // messages.push(makeMessage(CHECK_ROOMS_PROMPT));
    // return runAI(messages);
    return runAI([makeMessage(CHECK_ROOMS_PROMPT)])
  }).then(res => {
    json = res.choices[0].message.content;
    fs.writeFileSync(`${DATA_FOLDER}/06-checking-rooms-again.json`, json);
    // fs.writeFileSync(`${DATA_FOLDER}/06-messages.json`, JSON.stringify(messages, null, 2));

    console.log('Creating final message...');
    //messages.push(res.choices[0].message);
    //messages.push(makeMessage(CREATE_ENDING_PROMPT));
    //return runAI(messages);
    return runAI([makeMessage(CREATE_ENDING_PROMPT)])
  });

  console.log('final response', response.usage);

  const dataRaw = response.choices[0].message.content;
  const data = JSON.parse(dataRaw);


  return data;
}