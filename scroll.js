const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const items = Array.from(document.querySelectorAll('[data-scroll-distance]'), element => ({
  element,
  distance: Number(element.dataset.scrollDistance),
  offset: 0,
}));
let frame = 0;

function updateMotion() {
  frame = 0;
  const viewportHeight = window.innerHeight;
  const offsets = items.map(({ element, distance, offset }) => {
    if (reducedMotion.matches) return 0;

    const bounds = element.getBoundingClientRect();
    const top = bounds.top - offset;
    const progress = Math.min(1, Math.max(0, (viewportHeight - top) / (viewportHeight + bounds.height)));
    const eased = progress * progress * (3 - 2 * progress);
    return distance * (1 - 2 * eased);
  });

  items.forEach((item, index) => {
    item.offset = offsets[index];
    item.element.style.setProperty('--scroll-shift', `${item.offset}px`);
  });
}

function scheduleMotion() {
  if (!frame) frame = window.requestAnimationFrame(updateMotion);
}

window.addEventListener('scroll', scheduleMotion, { passive: true });
window.addEventListener('resize', scheduleMotion);
window.addEventListener('pageshow', scheduleMotion);
if (reducedMotion.addEventListener) {
  reducedMotion.addEventListener('change', scheduleMotion);
} else {
  reducedMotion.addListener(scheduleMotion);
}
scheduleMotion();
