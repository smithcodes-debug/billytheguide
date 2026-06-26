export function initStoryExpand() { /* ✅ NEW */
  const tourPopup = document.getElementById('leave-no-trace-popup'); /* ✅ NEW */
  const moreStoriesSection = document.getElementById('more-stories-section'); /* ✅ NEW */
  const moreStoriesTitle = document.getElementById('moreStoriesTitle'); /* ✅ NEW */
  const backToToursBtn = document.querySelector('[data-story-back-to-tours]'); /* ✅ NEW */
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)'); /* ✅ NEW */

  if (!tourPopup || !moreStoriesSection) return; /* ✅ REQUIRED FIX */
  if (tourPopup.dataset.storyExpandInitialized === 'true') return; /* ✅ REQUIRED FIX */
  tourPopup.dataset.storyExpandInitialized = 'true'; /* ✅ NEW */

  const BOTTOM_ZONE_HEIGHT = 160; /* ✅ NEW */
  const MIN_VERTICAL_SWIPE = 60; /* ✅ NEW */
  const VERTICAL_DOMINANCE_RATIO = 1.2; /* ✅ NEW */
  const SOFT_LANDING_DELAY = 140; /* ✅ NEW */

  let startX = 0; /* ✅ NEW */
  let startY = 0; /* ✅ NEW */
  let isBottomGesture = false; /* ✅ NEW */

  function isTourPopupOpen() { /* ✅ NEW */
    return tourPopup.classList.contains('is-open'); /* ✅ NEW */
  }

  function getScrollBehavior() { /* ✅ NEW */
    return reduceMotionQuery.matches ? 'auto' : 'smooth'; /* ✅ NEW */
  }

  function syncTourPopupClosedState() { /* ✅ NEW */
    const ctaTriggers = document.querySelectorAll('.cta-trigger'); /* ✅ NEW */

    tourPopup.classList.remove('is-open'); /* ✅ NEW */
    tourPopup.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
    document.documentElement.classList.remove('mobile-popup-scroll-lock'); /* ✅ REQUIRED FIX */
    document.body.classList.remove('mobile-popup-scroll-lock'); /* ✅ REQUIRED FIX */

    ctaTriggers.forEach(function (trigger) { /* ✅ NEW */
      trigger.setAttribute('aria-expanded', 'false'); /* ✅ NEW */
    });
  }

  function scrollToMoreStories() { /* ✅ NEW */
    moreStoriesSection.scrollIntoView({ /* ✅ NEW */
      behavior: getScrollBehavior(), /* ✅ NEW */
      block: 'start' /* ✅ NEW */
    });

    if (moreStoriesTitle && !reduceMotionQuery.matches) { /* ✅ NEW */
      window.setTimeout(function () { /* ✅ NEW */
        moreStoriesTitle.focus({ preventScroll: true }); /* ✅ NEW */
      }, 420); /* ✅ NEW */
    }
  }

  function openMoreStoriesFromTourPopup() { /* ✅ NEW */
    if (!isTourPopupOpen()) return; /* ✅ REQUIRED FIX */

    syncTourPopupClosedState(); /* ✅ NEW */

    window.setTimeout(function () { /* ✅ NEW */
      scrollToMoreStories(); /* ✅ NEW */
      window.dispatchEvent(new CustomEvent('billy:open-more-stories')); /* ✅ NEW */
    }, reduceMotionQuery.matches ? 20 : SOFT_LANDING_DELAY); /* ✅ NEW */
  }

  tourPopup.addEventListener('touchstart', function (event) { /* ✅ NEW */
    if (!isTourPopupOpen()) return; /* ✅ REQUIRED FIX */
    if (!event.touches || event.touches.length !== 1) return; /* ✅ REQUIRED FIX */

    const touch = event.touches[0]; /* ✅ NEW */
    startX = touch.clientX; /* ✅ NEW */
    startY = touch.clientY; /* ✅ NEW */
    isBottomGesture = startY >= window.innerHeight - BOTTOM_ZONE_HEIGHT; /* ✅ NEW */
  }, { passive: true }); /* ✅ NEW */

  tourPopup.addEventListener('touchend', function (event) { /* ✅ NEW */
    if (!isTourPopupOpen()) return; /* ✅ REQUIRED FIX */
    if (!isBottomGesture) return; /* ✅ REQUIRED FIX */
    if (!event.changedTouches || event.changedTouches.length !== 1) return; /* ✅ REQUIRED FIX */

    const touch = event.changedTouches[0]; /* ✅ NEW */
    const deltaX = touch.clientX - startX; /* ✅ NEW */
    const deltaY = touch.clientY - startY; /* ✅ NEW */
    const absDeltaX = Math.abs(deltaX); /* ✅ NEW */
    const absDeltaY = Math.abs(deltaY); /* ✅ NEW */
    const isVerticalSwipeUp = deltaY < -MIN_VERTICAL_SWIPE && absDeltaY > absDeltaX * VERTICAL_DOMINANCE_RATIO; /* ✅ NEW */

    if (!isVerticalSwipeUp) return; /* ✅ REQUIRED FIX */

    openMoreStoriesFromTourPopup(); /* ✅ NEW */
  }, { passive: true }); /* ✅ NEW */

  if (backToToursBtn) { /* ✅ NEW */
    backToToursBtn.addEventListener('click', function () { /* ✅ NEW */
      const hero = document.querySelector('.hero'); /* ✅ NEW */
      if (!hero) return; /* ✅ REQUIRED FIX */

      hero.scrollIntoView({ /* ✅ NEW */
        behavior: getScrollBehavior(), /* ✅ NEW */
        block: 'start' /* ✅ NEW */
      });
    });
  }

  window.addEventListener('billy:open-more-stories-from-tour-popup', openMoreStoriesFromTourPopup); /* ✅ NEW */
  console.log('Story expand initialized'); /* ✅ NEW */
}
