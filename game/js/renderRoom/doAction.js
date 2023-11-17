import makeDialogue from "../makeDialogue.js";
import renderRoom from "./renderRoom.js";

export default ({id, action}) => {
  const { 
    result,
    failureText,
    predecessorActions 
  } = action;

  if (predecessorActions && predecessorActions.some(key => !window.gameState.conditions[key])) {
    makeDialogue({
      text: failureText,
      buttonText: 'OK'
    })

    return
  }

  window.gameState.conditions[id] = true;
  makeDialogue({
    text: result,
    buttonText: 'OK'
  }, () => {
    if (action.winningAction) {
      makeDialogue({
        text: `
          ${window.gameState.data.winningText}
          <br /> <br />
          You have won!
        `,
      });
    }
  });

  renderRoom();
}