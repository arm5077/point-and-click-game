export default ({text, e}) => {
  const tooltip = document.querySelector('.tooltip');
  const innerTooltip = tooltip.querySelector('.tooltip-inner');
  innerTooltip.textContent = text;
  const x = e.clientX;
  const y = e.clientY;
  const halfwayX = window.innerWidth / 2;
  const halfwayY = window.innerHeight / 2;
  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;
  if (x > halfwayX) {
    tooltip.style.left = `${x - tooltipWidth - 24}px`;
  } else {
    tooltip.style.left = `${x + 24}px`;
  }
  if (y > halfwayY) {
    tooltip.style.top = `${y - tooltipHeight - 24}px`;
  } else {
    tooltip.style.top = `${y + 24}px`;
  }
}