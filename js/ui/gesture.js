export function initGesture() {
  let startX = 0;
  let startY = 0;

  function isMobileViewport() { /* ✅ NEW */
    return window.matchMedia('(max-width: 768px)').matches; /* ✅ NEW */
  }

  function hasOpenPopup() { /* ✅ NEW */
    return Boolean(document.querySelector('.popup-backdrop.is-open, .availability-popup-backdrop.is-open, .contact-popup-backdrop.is-open')); /* ✅ NEW */
  }

  function shouldIgnoreGestureTarget(target) { /* ✅ NEW */
    return Boolean(target && target.closest('input, textarea, select, button, a, label')); /* ✅ NEW */
  }

  document.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length !== 1) return;

    const deltaX = e.changedTouches[0].clientX - startX;
    const deltaY = e.changedTouches[0].clientY - startY;
    const absDeltaX = Math.abs(deltaX); /* ✅ NEW */
    const absDeltaY = Math.abs(deltaY); /* ✅ NEW */

    if (deltaX > 60 && absDeltaX > absDeltaY) {
      window.history.back();
      return; /* ✅ NEW */
    }

    if (!isMobileViewport()) return; /* ✅ NEW */
    if (hasOpenPopup()) return; /* ✅ NEW */
    if (shouldIgnoreGestureTarget(e.target)) return; /* ✅ NEW */

    if (deltaY < -70 && absDeltaY > absDeltaX * 1.2) { /* ✅ NEW */
      window.dispatchEvent(new CustomEvent('billy:open-availability-popup')); /* ✅ NEW */
    }
  }, { passive: true });
}
