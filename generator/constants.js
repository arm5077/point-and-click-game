const IMAGE_FOLDER = './game/images';
const DATA_FOLDER = './game/data';

const NUMBER_OF_ROOMS = 10;

const PREAMBLE = `
  You are creating a point-and-click adventure game. Your job is to construct a JSON array of the various settings in this game, as well as the objects in each room. 
  
  The adventure should have at least ${NUMBER_OF_ROOMS} settings.

  Most settings should have at least two exits to another setting. 
  Many rooms have three or more exits. 
  Every room has at least one exit. 
  If one room lists another room as an exit, that room should list the previous room as an exit as well. 
  All rooms should be connected to the larger network of rooms — there should not be islands.

  All text descriptions will be used to create images, so make them as detailed as possible.

  The adventurer must complete a specific, single action to win. 
  
  Many rooms have actions, though not all of them are important or do anything that furthers the plot. 
  
  Some actions rely on other actions to happen first. If this is the case, the actions should be linked together in a way that makes sense. Some actions require more than one actions to be completed first.
`;

const SETTING = `
  The setting is a haunted house. 
`

const SAMPLE_JSON = `
  Write the JSON as follows:

  \`\`\`
  {
    "intro": "<<2-3 sentences setting up the adventure for the player, and explaining the overall goal (without giving too much away)>>.>>",
    "rooms": [
      {
        "id": "<<a unique identifier for this room>>",
        "name": "<<the name of the room>>",
        "description": "<<a detailed description of the room. It should describe the objects in the room, and describe the exits to other rooms.>>",
        "isStart": <<boolean determining if this is the start of the adventure or not>>,
        "exits": {
          "<<the room id of the room connected to this one>. It must exist elsewhere in the game.>": {
            name: "<<name of the exit>",
            hidden: <<boolean that describes if the exit should be hidden until precessorActions are complete. In some cases, this is unnecessary (a locked door, for instance, is still something the user can see and try to open.) But in other cases (a secret passage) the exit would be hidden until the action is complete. If there are no predecessor actions, this is always false.>>,
            predecessorActions: ["<<ids of any actions necessary to use this exit. This action must exist elsewhere in the game."],
            failureText: "<<text describing what happens if you try to exit before completing the predecessor actions.>>",
          }
        },
        "actions": {
          "<<unique id for the action>>": {
            predecessorActions: ["<<ids of any actions that must be completed before this action is intitiated. This action must exist elsewhere in the game."]
            hidden: <<boolean that describes if the action should be hidden until precessorActions are complete — only hide the action if it makes narrative sense.>>,
            name: "<<REQUIRED: a short description of the action>, with the first letter capitalized>>"
            result: "<<REQUIRED: a short description of what happens when the action is triggered. If a portable object is described, the player takes it.>>"
            failureText: "<<text describing what happens if you try to do the action before completing the predecessor actions.>>",
          }
        }
      }
    ],
    "winningAction": {
      id: "<<the unique id for the action>>",
      endingText: "<<1-2 sentences describing what happens (and concluding the game)>>"
    },
  }
  \`\`\`

  Notes: 
  Things to look for:
  - Make sure every action with \`predecessorActions\` array also has a \`failureText\` property. If it doesn't, write a new \`failureText\` property.
  - If a room's action discusses revealing an exit somewhere, make sure that exit is included in the room's \`exits\` array (with the proper \`predecessorActions\` and \`hidden\` variables) and that the destination room exists in the \`rooms\` array.
`;

const roomPrompt = `
  Please create a pixel-art image of the following setting, reminiscent of point-and-click adventures of the 1990s. Make sure all features and exits are represented. There should be no user interface or text of any kind displayed. Do not create anythign that would violate OpenAI's policies.
`;

const featurePrompt = `
  Please create a pixel-art image of the following item, reminiscent of point-and-click adventures of the 1990s. It should be close-up and focus on the item itself, and not have and user-interface text surrounding it.
`;

const imageAnalysisPrompt = `
  Take the following JSON file and image url, and find the locations of all room exits and all actions. 

  ONLY RETURN THE JSON OBJECT. DO NOT wrap in backticks or mention that it is JSON.

  Return JSON in the following format.

  {
    "exits": {
      "<<the id of the room the exit leads to>>": {
        "left": "<<the horizontal position of the feature, as a percentage of the entire image from 0-100, with 0 being the left-most edge>>,
        "top": "<<vertical position of the feature, as a percentage of the entire image from 0-100, with 0 being the top-most edge>>,
      }
    },
    actions: {
      "<<the id of the action>>": {
        "left": "<<the horizontal position of the action, as a percentage of the entire image from 0-100, with 0 being the left-most edge>>,
        "top": "<<vertical position of the action, as a percentage of the entire image from 0-100, with 0 being the top-most edge>>,
      }
    }
  }
`;


const prompt = `
  ${PREAMBLE}
  ${SETTING}
  ${SAMPLE_JSON}
`;

module.exports = {
  IMAGE_FOLDER,
  DATA_FOLDER,
  NUMBER_OF_ROOMS,
  PREAMBLE,
  SETTING,
  SAMPLE_JSON,
  prompt,
  roomPrompt,
  featurePrompt,
  imageAnalysisPrompt,
};