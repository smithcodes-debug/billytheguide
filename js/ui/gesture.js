export function initGesture() {
  let startX = 0;
  let startY = 0;

  const EDGE_BACK_ZONE = 24; /* ✅ NEW */

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
    const isMobile = isMobileViewport(); /* ✅ NEW */
    const popupIsOpen = hasOpenPopup(); /* ✅ NEW */

    if (
      isMobile && /* ✅ UPDATED */
      popupIsOpen && /* ✅ UPDATED: chỉ back khi đang mở popup */
      startX <= EDGE_BACK_ZONE && /* ✅ NEW: chỉ nhận swipe từ cạnh trái 24px */
      deltaX > 60 &&
      absDeltaX > absDeltaY
    ) {
      window.history.back();
      return; /* ✅ NEW */
    }

    if (!isMobile) return; /* ✅ KEEP: mobile only */
    if (popupIsOpen) return; /* ✅ KEEP: swipe up chỉ chạy khi chưa có popup nào mở */

    if (deltaY < -30 && absDeltaY > 30) { /* ✅ UPDATED */
      window.dispatchEvent(new CustomEvent('billy:open-availability-popup')); /* ✅ NEW */
    }
  }, { passive: true });
}