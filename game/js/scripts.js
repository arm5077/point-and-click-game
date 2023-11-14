import renderRoom from "./renderRoom/renderRoom.js";
import setUpHints from "./setUpHints.js";
import makeDialogue from './makeDialogue.js';

window.gameState = {};
const runway = document.querySelector('.runway');

runway.style.height = `${window.innerHeight}px`;
window.addEventListener('resize', () => {
  runway.style.height = `${window.innerHeight}px`;
});

(async () => {
  const data = await fetch('./data/output.json')
    .then(response => response.json());

  const startingRoom = data.rooms.find(d => d.isStart);
  window.gameState.data = data;
  window.gameState.room = startingRoom;
  window.gameState.conditions = {};

  setUpHints();
  renderRoom(startingRoom)
  makeDialogue({
    text: data.intro,
    buttonText: 'Begin',
  })

})();

