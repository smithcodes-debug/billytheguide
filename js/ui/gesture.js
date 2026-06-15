export function initGesture() {
  let startX = 0;
  let startY = 0;

  document.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length !== 1) return;

    const deltaX = e.changedTouches[0].clientX - startX;
    const deltaY = e.changedTouches[0].clientY - startY;

    if (deltaX > 60 && Math.abs(deltaX) > Math.abs(deltaY)) {
      window.history.back();
    }
  }, { passive: true });
}
