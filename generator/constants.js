const IMAGE_FOLDER = './game/images';
const DATA_FOLDER = './game/data';

const NUMBER_OF_ROOMS = 6;


/*
const SETTING = `
 You are a young child in a fantasy adventure (King Arthur setting) who has been sent to the market to get three items: 
 
 1. A bunch of eggs
 2. Some rope
 3. A gift for your grandmother.

 You cannot go home until you get these three things.

  You might encounter a man selling magic beans. If you buy them, you lose the game.

  You can steal the eggs, but if you steal the rope, you're caught and lose the game.

  You can also buy things if you find coins or other goods to trade. 

  When you have all the things, you can return to the start of the game and complete a "Leave the market" action.
`
*/

const SETTING = `
  You're in a cyberpunk dystopia. 

  The player is a white-hat hacker — one of those good hackers. They are trying to reconnect with their daughter — named HAIM — who  has fallen in with the wrong crowd and is involved in phishing scheme. 
  Low-level stuff.

  The player needs to find their daughter to save her from this bad crowd.

  In the player's phsyical body, they're paralyzed from the waist down. They exert their will on the world through their computer.

  In order to win, the player needs to: 

  1. Find her location in cyberspace by talking to people and looking for leads;
  2. Solve cryptographic puzzles to hack the bad crowd's firewalls to speak with her.
  3. Convince the daughter to sever ties with the bad crowd.

  The bad people who are running with the player's daughter don't want her to reconnect with her dad and will harm the player if provoked.


`;

const SET_UP_NARRATIVE_PROMPT = `
  You are creating a point-and-click adventure game. We will be creating a JSON file to power this game over multiple steps.

  ${ SETTING }

  First, let's set up the narrative of the game. Decide what the set-up of the adventure is, and how the player wins.

  Create a JSON file of the following schema: 

  \`\`\`
    {
      "intro": "<<2-3 sentences setting up the adventure for the player, and explaining the overall goal (without giving too much away).>>",
      "how-to-win": "<<Play-by-play on how to win the game, mentioning locations and actions.>>"
    }
  \`\`\`

`

const CREATE_ROOMS_PROMPT = `
  Now, we will add rooms to the game. 

  The adventure should have around ${NUMBER_OF_ROOMS} settings.

  Most settings should have at least two exits to another setting. 
  Many rooms have three or more exits. 
  Every room has at least one exit. 
  No room has more than 4 exits.
  Each exit is assigned a cardinal direction – North, South, East or West. Two exits can't have the same direction in the same room.
  If one room lists another room as an exit, that room should list the previous room as an exit as well. 
  All rooms should be connected to the larger network of rooms — there should not be islands.

  All text descriptions will be used to create images, so make them as detailed as possible.

  Add a \`rooms\` property to the previously generated JSON. It should be formatted as follows:

  \`\`\`    
    "rooms": [
      {
        "id": "<<a unique identifier for this room>>",
        "name": "<<the name of the room>>",
        "description": "<<a detailed description of the room. It should describe the objects in the room, and describe the exits to other rooms.>>",
        "isStart": <<boolean determining if this is the start of the adventure or not>>,
        "exits": {
          "<<the room id of the room connected to this one>. It must exist elsewhere in the game.>": {
            name: "<<name of the exit, to be displayed to the user>",
            direction: "<<Must be either north, south, east or west — nothing else>>",
          },
        },
      }
    ],
  }
  \`\`\`   
`;

const CHECK_ROOMS_PROMPT = `
  Now, let's make sure every exit connects to a room.

  Go through each room. Check the \`exits\` object. Make sure there is a room with that key in the JSON file. 

  If there's not, create a new room matching the ID, using the same JSON format as before — minimizing exits to other rooms.

  Return the entire edited JSON file, incorporating all the edits from above.
`

const CREATE_ACTIONS_PROMPT = `
  Now, we will add actions to rooms. 

  Actions can do a bunch of things — they can reveal hidden exits, they can reveal items the player picks up, or they can advance the plot. 
  Sometimes they're just silly, or don't do much of anything!

  Some actions require other actions to be completed first before they become available. But these "predecessor actions" should always make narrative sense.

  For each room, decide which actions it should get. 
  (Not every room needs them.) Avoid things like "Find secret passage"... try actions like "Examine the strange bookshelf" which would result in the secret passage being revealed.
 
  And finally, choose which action triggers the game ending. 
  This action should feel appropriately epic and only happen after you've completed other tasks.

  Add an \`actions\` property to the previously generated JSON for each room.

  It should be formatted like the following:

  \`\`\`
    {
      <... Existing room data ...>,
      "actions": {
        "<< The action's unique id >>": {
          "name": "A short description of the action, with the first letter capitalized",
          "predecessorActions": [
            "<< An array of action ids denoting all the actions that must be completed first >>",
          ],
          "result": "<< Text that describes what happens after the player successfully completes the action> >",
          "failureText: "<< Text that describes what happens if the play hasn't completed all the necessary predecessor actions. >>",
          "hidden": << Boolean determining whether the action should be hidden until all the predecessor actions have been completed. Be sparing with this and employ only when it makes narrative sense. This is always false if there are no predecessor actions for this action. >>,
          "winningAction": << Boolean determining whether this action causes the player to win the game >>,
          "losingAction": << Boolean determining whether this action causes the player to lose the game >>,
        }
      }
    }
  \`\`\`

  Return the entire edited JSON file, incorporating all the edits from above.
`;

const UPDATE_EXITS_PROMPT = `
  Now, we want to link a few room exits with actions — barring the player from using a given exit until the action has been completed.

  For instance, the player might need to find a key before they can go through a locked door. 
  
  Or they might need to discover a secret exit before they can go through it.

  For every room, decide whether any of the exits need actions to be completed first. 

  And decide whether the exit should be hidden until the action is finished.

  One warning: Make sure the player can actually complete the action. For instance, you don't want to put an action that reveals the entrance to a room INSIDE that very room — the player would never be able to get there!

  And don't bar too many exits. It gets annoying fast! One or two times in a game is plenty.

  Modify the JSON using the following format:

  \`\`\`

  {
    << Existing room data >>
    predecessorActions: [
      "<< An array of action ids denoting all the actions that must be completed first before the exit becoems available >>",
    ],
    failureText: "<< Text that describes what happens if the player tries to use the exit, but hasn't finished all the required actions yet. >>",
    "hidden": << Boolean determining whether the exit should be hidden until all the predecessor actions have been completed. >>,
  }

  \`\`\`

  Return the entire edited JSON file, incorporating all the edits from above.
`

const CREATE_ENDING_PROMPT = `
Now, create the text that displays at the conclusion of the adventure. 

It should narrate what happens next and how the game concludes in 1-2 sentences.

Add the following property to the JSON file:

\`\`\`
  winningText: "<< The text describing the end of the adventure, >>"
\`\`\`

Return the entire edited JSON file, incorporating all the edits from above. Verify it follows this schema:

\`\`\`
{
  "intro": string,
  "how-to-win": string,
  "rooms": array,
  "winningText": string
}
\`\`\`
`

/// THIS IS OLD GARBAGE



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
  SET_UP_NARRATIVE_PROMPT,
  CREATE_ROOMS_PROMPT,
  CHECK_ROOMS_PROMPT,
  CREATE_ACTIONS_PROMPT,
  UPDATE_EXITS_PROMPT,
  CREATE_ENDING_PROMPT,

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