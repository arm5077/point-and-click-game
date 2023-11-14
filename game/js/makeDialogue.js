export default ({ text, buttonText }, callback) => {
  const dialogueBoxWrapper = document.querySelector('.dialogue-box-wrapper');
  const dialogueBox = dialogueBoxWrapper.querySelector('.dialogue-box-inner');

  dialogueBox.innerHTML = `
    <span class="text">
      ${text}
    </span>
    ${
      buttonText ? `
        <button>
          ${buttonText}
        </button>
      ` : ''
    }
  `

  const dialogueButton = dialogueBox.querySelector('button');
  if (dialogueButton) {
    dialogueButton.addEventListener('click', () => {
      dialogueBoxWrapper.classList.remove('active');  
      if (callback) {
        callback();
      }
    })  
  }
  
  dialogueBoxWrapper.classList.add('active');
  
}