import { initGesture } from './ui/gesture.js'; /* ✅ UPDATED */
import { initNavigation, initSnorkelingCardNavigation } from './ui/navigation.js'; /* ✅ UPDATED */
import { initContactPopup } from './ui/contact-popup.js'; /* ✅ NEW */
import { initPolicyPopup } from './ui/policy-popup.js'; /* ✅ NEW */
import { initTourCarousel } from './ui/tour-carousel.js'; /* ✅ NEW */
import { initStoryExpand } from './ui/story-expand.js'; /* ✅ NEW */
import { initAvailabilityPopup } from './modules/booking.js'; /* ✅ NEW */

function initHomePopup() { /* ✅ NEW */
  const checkbox = document.getElementById('leaveNoTraceCheckbox'); /* ✅ NEW */
  const popup = document.getElementById('leave-no-trace-popup'); /* ✅ NEW */
  const popupCard = popup ? popup.querySelector('.popup-card') : null; /* ✅ NEW */
  const closeBtn = popup ? popup.querySelector('.popup-close') : null; /* ✅ NEW */
  const triggers = document.querySelectorAll('.cta-trigger'); /* ✅ NEW */
  const HOME_SCROLL_LOCK_CLASS = 'home-scroll-locked'; /* ✅ NEW */
  let homeScrollUnlocked = false; /* ✅ NEW */

  if (!checkbox || !popup || !popupCard || !closeBtn || !triggers.length) return; /* ✅ REQUIRED FIX */

  function isMobileHomeScrollLockViewport() { /* ✅ NEW */
    return window.innerWidth <= 768; /* ✅ NEW */
  }

  function lockHomeScrollIfNeeded() { /* ✅ NEW */
    if (homeScrollUnlocked) return; /* ✅ NEW */

    if (isMobileHomeScrollLockViewport()) { /* ✅ NEW */
      document.documentElement.classList.add(HOME_SCROLL_LOCK_CLASS); /* ✅ NEW */
      document.body.classList.add(HOME_SCROLL_LOCK_CLASS); /* ✅ NEW */
      return; /* ✅ NEW */
    }

    document.documentElement.classList.remove(HOME_SCROLL_LOCK_CLASS); /* ✅ NEW */
    document.body.classList.remove(HOME_SCROLL_LOCK_CLASS); /* ✅ NEW */
  }

  function unlockHomeScroll() { /* ✅ NEW */
    homeScrollUnlocked = true; /* ✅ NEW */
    document.documentElement.classList.remove(HOME_SCROLL_LOCK_CLASS); /* ✅ NEW */
    document.body.classList.remove(HOME_SCROLL_LOCK_CLASS); /* ✅ NEW */
  }

  lockHomeScrollIfNeeded(); /* ✅ NEW */
  window.addEventListener('resize', lockHomeScrollIfNeeded); /* ✅ NEW */

  function openPopup() { /* ✅ NEW */
    unlockHomeScroll(); /* ✅ NEW */
    checkbox.checked = true; /* ✅ NEW */
    popup.classList.add('is-open'); /* ✅ NEW */
    popup.setAttribute('aria-hidden', 'false'); /* ✅ NEW */

    triggers.forEach(function (el) { /* ✅ NEW */
      el.setAttribute('aria-expanded', 'true'); /* ✅ NEW */
    });
  }

  function closePopup() { /* ✅ NEW */
    popup.classList.remove('is-open'); /* ✅ NEW */
    popup.setAttribute('aria-hidden', 'true'); /* ✅ NEW */

    triggers.forEach(function (el) { /* ✅ NEW */
      el.setAttribute('aria-expanded', 'false'); /* ✅ NEW */
    });
  }

  triggers.forEach(function (trigger) { /* ✅ NEW */
    trigger.addEventListener('click', function (event) { /* ✅ NEW */
      event.preventDefault(); /* ✅ NEW */
      openPopup(); /* ✅ NEW */
    });

    trigger.addEventListener('keydown', function (event) { /* ✅ NEW */
      if (event.key === 'Enter' || event.key === ' ') { /* ✅ NEW */
        event.preventDefault(); /* ✅ NEW */
        openPopup(); /* ✅ NEW */
      }
    });
  });

  closeBtn.addEventListener('click', closePopup); /* ✅ NEW */

  popup.addEventListener('click', function (event) { /* ✅ NEW */
    if (!popupCard.contains(event.target)) { /* ✅ NEW */
      closePopup(); /* ✅ NEW */
    }
  });

  document.addEventListener('keydown', function (event) { /* ✅ NEW */
    if (event.key === 'Escape' && popup.classList.contains('is-open')) { /* ✅ NEW */
      closePopup(); /* ✅ NEW */
    }
  });

  console.log('Home popup initialized'); /* ✅ NEW */
}

function initHome() { /* ✅ UPDATED */
  console.log('Home initialized'); /* ✅ UPDATED */
}

initGesture(); /* ✅ UPDATED */
initNavigation(); /* ✅ UPDATED */
initHomePopup(); /* ✅ UPDATED */
initPolicyPopup(); /* ✅ NEW */
initContactPopup(); /* ✅ UPDATED */
initTourCarousel(); /* ✅ NEW */
initStoryExpand(); /* ✅ NEW */
initSnorkelingCardNavigation(); /* ✅ NEW */
initAvailabilityPopup(); /* ✅ NEW */
initHome(); /* ✅ UPDATED */
