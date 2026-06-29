export function initGesture() {
  let startX = 0;
  let startY = 0;
  let availabilitySwipeDisabled = false; /* ✅ NEW */
  const EDGE_BACK_ZONE = 24; /* ✅ NEW */
  const AVAILABILITY_SWIPE_TOP_THRESHOLD = 80; /* ✅ NEW */

  function isMobileViewport() { /* ✅ UPDATED */
    return window.innerWidth <= 768 || window.matchMedia('(hover: none) and (pointer: coarse)').matches; /* ✅ UPDATED */
  }

  function hasOpenPopup() { /* ✅ NEW */
    return Boolean(document.querySelector('.popup-backdrop.is-open, .availability-popup-backdrop.is-open, .contact-popup-backdrop.is-open')); /* ✅ NEW */
  }

  function hasTourCardPopupOpen() { /* ✅ NEW */
    const tourPopup = document.getElementById('leave-no-trace-popup'); /* ✅ NEW */
    return Boolean(tourPopup && tourPopup.classList.contains('is-open')); /* ✅ NEW */
  }

  function disableAvailabilitySwipeOnceTourPopupOpens() { /* ✅ NEW */
    if (hasTourCardPopupOpen()) { /* ✅ NEW */
      availabilitySwipeDisabled = true; /* ✅ NEW */
    }
  }

  function isAvailabilitySwipeAllowedAtCurrentScroll() { /* ✅ NEW */
    return window.scrollY <= AVAILABILITY_SWIPE_TOP_THRESHOLD; /* ✅ NEW */
  }

  function observeTourPopupState() { /* ✅ NEW */
    const tourPopup = document.getElementById('leave-no-trace-popup'); /* ✅ NEW */
    if (!tourPopup) return; /* ✅ REQUIRED FIX */
    if (tourPopup.dataset.availabilitySwipeObserverInitialized === 'true') return; /* ✅ REQUIRED FIX */

    tourPopup.dataset.availabilitySwipeObserverInitialized = 'true'; /* ✅ NEW */

    const observer = new MutationObserver(function () { /* ✅ NEW */
      disableAvailabilitySwipeOnceTourPopupOpens(); /* ✅ NEW */
    });

    observer.observe(tourPopup, { /* ✅ NEW */
      attributes: true, /* ✅ NEW */
      attributeFilter: ['class'] /* ✅ NEW */
    });

    disableAvailabilitySwipeOnceTourPopupOpens(); /* ✅ NEW */
  }

  observeTourPopupState(); /* ✅ NEW */

  document.addEventListener('touchstart', (e) => {
    if (!e.touches || e.touches.length !== 1) return;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    disableAvailabilitySwipeOnceTourPopupOpens(); /* ✅ NEW */
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

    disableAvailabilitySwipeOnceTourPopupOpens(); /* ✅ NEW */

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

    if (hasTourCardPopupOpen()) { /* ✅ UPDATED */
      availabilitySwipeDisabled = true; /* ✅ NEW */
      return; /* ✅ REQUIRED FIX */
    }

    if (popupIsOpen) return; /* ✅ KEEP: swipe up đã bị remove, popup mở thì không làm gì */
    if (availabilitySwipeDisabled) return; /* ✅ NEW */
    if (!isAvailabilitySwipeAllowedAtCurrentScroll()) return; /* ✅ NEW */

    /* ✅ UPDATED: removed swipe-up booking/availability trigger */
  }, { passive: true });
}