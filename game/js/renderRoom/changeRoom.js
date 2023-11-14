import makeDialogue from '../makeDialogue.js';
import renderRoom from './renderRoom.js';

export default ({ exit, room }) => {
  const { 
    failureText,
    predecessorActions 
  } = exit;

  if (predecessorActions && predecessorActions.some(key => !window.gameState.conditions[key])) {
    makeDialogue({
      text: failureText,
      buttonText: 'OK'
    })

    return
  }


  const newRoom = window.gameState.data.rooms.find(r => r.id === room);
  window.gameState.room = newRoom;
  renderRoom(newRoom);
}