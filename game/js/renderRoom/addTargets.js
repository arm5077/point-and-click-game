import moveTooltip from "../moveTooltip.js";
import changeRoom from './changeRoom.js';
import doAction from './doAction.js';

export default ({items, type}) => {
  const interactiveLayer = document.querySelector('.interactive-layer');
  const tooltip = document.querySelector('.tooltip');

  for (const [id, item] of Object.entries(items)) {  
    const { predecessorActions, hidden, direction = '' } = item;
    
    if (predecessorActions) {
      const predecessorActionsCompleted = predecessorActions.every(key => key in window.gameState.conditions);
      if (hidden && !predecessorActionsCompleted) {
        continue;
      }
    }
    
    if (window.gameState.conditions[id]) {
      continue;
    }

    const target = document.createElement('div');
    target.classList.add('interaction-point', type, direction || 'no-direction');
    if (type === 'actions') {
      target.style.top = `${item.top}%`;
      target.style.left = `${item.left}%`; 
    }

    const label = `
      <div class="label">
        <div class="label-inner">
          ${item.name}
        </div>
      </div>
    `

    target.innerHTML = type === 'actions' 
      ? `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M44.8 16V9.6H41.6V6.4H38.4V3.2H32V0H16V3.2H9.6V6.4H6.4V9.6H3.2V16H0V32H3.2V38.4H6.4V41.6H9.6V44.8H16V48H32V44.8H38.4V41.6H41.6V38.4H44.8V32H48V16H44.8Z" fill="white"/>
          <path d="M13.5 28.875V24.375H15.75V26.625H18V10.5H20.25V22.125H25.125V17.625H27.375V21.75H31.875V17.625H34.125V33.375H31.875V35.625H20.25V33.375H18V31.125H15.75V28.875H13.5Z" fill="white"/>
          <path d="M13.5191 28.9056H15.7881V31.2528H13.5191V28.9056ZM15.8663 26.5584H18.1353L18.1352 10.5972H15.8662V22.0986H13.5189V24.3677H15.8662C15.8663 24.3676 15.8663 26.5583 15.8663 26.5583V26.5584ZM13.5191 24.3677H11.25V28.9839H13.5191V24.3677ZM22.6733 10.5972H20.4042V22.0204H25.0204V17.4824H22.6732L22.6733 10.5972ZM15.8663 31.3311V33.6002H18.1353V31.3311H15.8663ZM27.2895 15.2135H25.0204V17.4825H27.2895V15.2135ZM20.4043 8.25H18.1352V10.5191H20.4043V8.25ZM31.984 15.2135V17.4825H34.253V15.2135H31.984ZM18.1353 33.5219V35.8691H20.4043V33.5219H18.1353ZM27.3677 17.4042V21.9422H31.984V17.4042H27.3677ZM34.2529 17.4042V33.5219H36.522L36.5219 17.4042H34.2529ZM31.9839 35.8691H34.2529V33.5219H31.9839V35.8691ZM20.4042 35.8691V40.4853H31.9839V35.8691H20.4042Z" fill="black"/>
        </svg>
        ${label}
      `
      : `
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M44.8 16V9.6H41.6V6.4H38.4V3.2H32V0H16V3.2H9.6V6.4H6.4V9.6H3.2V16H0V32H3.2V38.4H6.4V41.6H9.6V44.8H16V48H32V44.8H38.4V41.6H41.6V38.4H44.8V32H48V16H44.8Z" fill="white"/>
          <path d="M26.5052 7.5V9.94836H24.0568V19.9104H9.19822V17.462H21.6085L21.6084 7.5H26.5052ZM6.75 27.3396H9.19836V19.9103H6.75V27.3396ZM26.5896 37.3016H29.0379V34.8533L26.5896 34.8534V37.3016ZM24.0569 27.424H9.19829V29.8724H21.6086L21.6084 39.75H26.505V37.3016H24.0568V27.424H24.0569ZM38.9999 19.9103H36.5515V22.3587H38.9999V19.9103ZM29.0379 34.8533H31.4862V32.3206H29.0379V34.8533ZM36.5516 27.3396H38.9999V24.8913H36.5516V27.3396ZM34.1034 15.0137H31.5706V17.4621H34.019V19.9105H36.4674V17.4621H34.1035C34.1034 17.462 34.1034 15.0137 34.1034 15.0137H34.1034ZM38.9999 22.443V24.8914H41.4483V22.443H38.9999ZM34.0189 29.8723H31.5706V32.3207H34.1033L34.0189 29.8723H36.4673V27.424H34.0189L34.0189 29.8723ZM26.5896 9.94829V12.481H29.038V9.94829H26.5896ZM29.038 14.9293H31.4864V12.4809H29.038V14.9293Z" fill="black"/>
          <path d="M9.40332 27.375V19.875H24.0283V10.125H26.6533V12.375H28.9033V15H31.5283V17.625H33.7783V19.875H36.4033V22.125H39.0283V24.75H36.4033V27.375H33.7783V30H31.5283V32.25H28.9033V34.875H26.6533V37.125H24.0283V27.375H9.40332Z" fill="white"/>
        </svg>
        ${label}
      `;
    
    
    interactiveLayer.appendChild(target);
    
    target.addEventListener('mousemove', e => {        
      tooltip.classList.remove('hidden');
      moveTooltip({text: item.name, e});
    });

    target.addEventListener('mouseout', () => {        
      tooltip.classList.add('hidden');
    });

    target.addEventListener('click', () => {
      tooltip.classList.add('hidden');
      if (type === 'exits') {
        changeRoom({
          room: id,
          exit: item
        });
      }

      if (type === 'actions') {
        doAction({
          id,
          action: item
        });
      }
    });
  }
}