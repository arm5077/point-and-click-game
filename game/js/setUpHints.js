const interactiveLayer = document.querySelector('.interactive-layer');

export default () =>  {
  const hintsButton = document.querySelector('.hints-button');
  hintsButton.addEventListener('click', () => {
    if (window.gameState.hintsOn) {
      window.gameState.hintsOn = false;
      interactiveLayer.classList.remove('hints-on');
      hintsButton.classList.remove('hints-on');
    } else {
      window.gameState.hintsOn = true;
      interactiveLayer.classList.add('hints-on');
      hintsButton.classList.add('hints-on');
    }
  });

}