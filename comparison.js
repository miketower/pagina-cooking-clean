const panRange = document.querySelector('.pan-range');
const panView = panRange.closest('.pan-view');

function updateComparison() {
  const before = panRange.valueAsNumber;
  panView.style.setProperty('--split', `${before}%`);
  panRange.setAttribute('aria-valuetext', `${before} % antes, ${100 - before} % después`);
}

panRange.addEventListener('input', updateComparison);
window.addEventListener('pageshow', updateComparison);
updateComparison();
panRange.hidden = false;
