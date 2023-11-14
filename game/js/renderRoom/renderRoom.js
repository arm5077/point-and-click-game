import addTargets from "./addTargets.js";

const renderRoom = (room = window.gameState.room) => {
  console.log(window.gameState.conditions)
  const { exits, actions } = room;

  const image = document.querySelector('.game-screen img');
  const title = document.querySelector('.room-title');
  const interactiveLayer = document.querySelector('.interactive-layer');

  image.src = room.imageURL;
  title.textContent = room.name;

  interactiveLayer.innerHTML = '';
  addTargets({ 
    type: 'exits',
    items: exits
  });
  
  addTargets({ 
    type: 'actions',
    items: actions
  });
}

export default renderRoom;