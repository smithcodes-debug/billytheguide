export function initGesture() {
  let startX = 0;
  let startY = 0;

  function isMobileViewport() { /* ✅ UPDATED */
    return window.innerWidth <= 768 || window.matchMedia('(hover: none) and (pointer: coarse)').matches; /* ✅ UPDATED */
  }

  function hasOpenPopup() { /* ✅ NEW */
    return Boolean(document.querySelector('.popup-backdrop.is-open, .availability-popup-backdrop.is-open, .contact-popup-backdrop.is-open')); /* ✅ NEW */
  }

  document.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length !== 1) return;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!e.changedTouches || e.changedTouches.length !== 1) return;

    const endX = e.changedTouches[0].clientX; /* ✅ NEW */
    const endY = e.changedTouches[0].clientY; /* ✅ NEW */
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absDeltaX = Math.abs(deltaX); /* ✅ NEW */
    const absDeltaY = Math.abs(deltaY); /* ✅ NEW */

    if (deltaX > 60 && absDeltaX > absDeltaY) {
      window.history.back();
      return; /* ✅ NEW */
    }

    if (!isMobileViewport()) return; /* ✅ KEEP: mobile only */
    if (hasOpenPopup()) return; /* ✅ KEEP: chỉ chạy khi chưa có popup nào mở */

    if (deltaY < -30 && absDeltaY > 30) { /* ✅ UPDATED: bỏ điều kiện quá khắt khe */
      window.dispatchEvent(new CustomEvent('billy:open-availability-popup')); /* ✅ NEW */
    }
  }, { passive: true });
}