import { initGesture } from './ui/gesture.js'; /* ✅ UPDATED */
import { initNavigation, initSnorkelingCardNavigation } from './ui/navigation.js'; /* ✅ UPDATED */
import { initContactPopup } from './ui/contact-popup.js'; /* ✅ NEW */
import { initPolicyPopup } from './ui/policy-popup.js'; /* ✅ NEW */
import { initTourCarousel } from './ui/tour-carousel.js'; /* ✅ NEW */
import { initStoryExpand } from './ui/story-expand.js'; /* ✅ NEW */
import { initAvailabilityPopup } from './modules/booking.js'; /* ✅ NEW */
import { initSearchPopup } from './ui/search-popup.js'; /* ✅ NEW */
import { initMobileEdgePad } from './ui/mobile-edge-pad.js'; /* ✅ NEW */

function initHomePopup() { /* ✅ NEW */
  const checkbox = document.getElementById('leaveNoTraceCheckbox'); /* ✅ NEW */
  const popup = document.getElementById('leave-no-trace-popup'); /* ✅ NEW */
  const popupCard = popup ? popup.querySelector('.popup-card') : null; /* ✅ NEW */
  const closeBtn = popup ? popup.querySelector('.popup-close') : null; /* ✅ NEW */
  const triggers = document.querySelectorAll('.cta-trigger'); /* ✅ NEW */
  const HOME_SCROLL_LOCK_CLASS = 'home-scroll-locked'; /* ✅ NEW */
  const OPEN_HOME_TOUR_POPUP_EVENT = 'billy:open-home-tour-popup'; /* ✅ NEW */
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

  window.addEventListener(OPEN_HOME_TOUR_POPUP_EVENT, function () { /* ✅ NEW */
    openPopup(); /* ✅ NEW */
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

function initMobileHomeSectionLock() { /* ✅ NEW */
  const MOBILE_MAX_WIDTH = 768; /* ✅ NEW */
  const HOME_SECTION_SELECTOR = '.more-stories-section'; /* ✅ NEW */
  const HOME_SECTION_LOCK_STATE_KEY = 'mobileHomeSectionLocked'; /* ✅ NEW */
  const HOME_SECTION_LOCK_TOP_OFFSET = 8; /* ✅ NEW */
  const HOME_SECTION_CURRENT_TOP_TOLERANCE = 14; /* ✅ NEW */
  const HOME_SECTION_FORCE_SCROLL_DELAY = 16; /* ✅ NEW */
  const logoTrigger = document.getElementById('logoTrigger'); /* ✅ NEW */
  const homeSection = document.querySelector(HOME_SECTION_SELECTOR); /* ✅ NEW */
  let isLocked = false; /* ✅ NEW */
  let isProgrammaticScroll = false; /* ✅ NEW */
  let lastTouchY = 0; /* ✅ NEW */
  let hasHistoryGuard = false; /* ✅ NEW */

  if (!homeSection) return; /* ✅ REQUIRED FIX */

  function isMobileViewport() { /* ✅ NEW */
    return window.innerWidth <= MOBILE_MAX_WIDTH; /* ✅ NEW */
  }

  function getHomeSectionTop() { /* ✅ NEW */
    return Math.max(0, Math.round(homeSection.getBoundingClientRect().top + window.scrollY)); /* ✅ NEW */
  }

  function getCurrentScrollY() { /* ✅ NEW */
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0; /* ✅ NEW */
  }

  function isAtHomeSectionTop() { /* ✅ NEW */
    const homeTop = getHomeSectionTop(); /* ✅ NEW */
    return Math.abs(getCurrentScrollY() - homeTop) <= HOME_SECTION_CURRENT_TOP_TOLERANCE; /* ✅ NEW */
  }

  function isBeforeHomeSection() { /* ✅ NEW */
    const homeTop = getHomeSectionTop(); /* ✅ NEW */
    return getCurrentScrollY() < homeTop - HOME_SECTION_CURRENT_TOP_TOLERANCE; /* ✅ NEW */
  }

  function scrollToHomeSection(behavior) { /* ✅ NEW */
    const homeTop = getHomeSectionTop(); /* ✅ NEW */
    isProgrammaticScroll = true; /* ✅ NEW */

    window.scrollTo({ /* ✅ NEW */
      top: homeTop, /* ✅ NEW */
      left: 0, /* ✅ NEW */
      behavior: behavior || 'auto' /* ✅ NEW */
    });

    window.setTimeout(function () { /* ✅ NEW */
      isProgrammaticScroll = false; /* ✅ NEW */
    }, HOME_SECTION_FORCE_SCROLL_DELAY); /* ✅ NEW */
  }

  function pushHistoryGuard() { /* ✅ NEW */
    if (hasHistoryGuard || !isMobileViewport()) return; /* ✅ NEW */

    try { /* ✅ NEW */
      window.history.pushState({ mobileHomeSectionLocked: true }, document.title, window.location.href); /* ✅ NEW */
      hasHistoryGuard = true; /* ✅ NEW */
    } catch (error) { /* ✅ NEW */
      hasHistoryGuard = false; /* ✅ NEW */
    }
  }

  function activateLock() { /* ✅ NEW */
    if (isLocked || !isMobileViewport()) return; /* ✅ NEW */

    isLocked = true; /* ✅ NEW */
    pushHistoryGuard(); /* ✅ NEW */

    if (isBeforeHomeSection()) { /* ✅ NEW */
      scrollToHomeSection('auto'); /* ✅ NEW */
    }
  }

  function shouldActivateFromViewport() { /* ✅ NEW */
    if (!isMobileViewport()) return false; /* ✅ NEW */

    const rect = homeSection.getBoundingClientRect(); /* ✅ NEW */
    return rect.top <= HOME_SECTION_LOCK_TOP_OFFSET; /* ✅ NEW */
  }

  function guardHomeSectionBoundary() { /* ✅ NEW */
    if (!isMobileViewport()) return; /* ✅ NEW */

    if (!isLocked && shouldActivateFromViewport()) { /* ✅ NEW */
      activateLock(); /* ✅ NEW */
    }

    if (!isLocked || isProgrammaticScroll) return; /* ✅ NEW */

    if (isBeforeHomeSection()) { /* ✅ NEW */
      scrollToHomeSection('auto'); /* ✅ NEW */
    }
  }

  function handleWheel(event) { /* ✅ NEW */
    if (!isLocked || !isMobileViewport()) return; /* ✅ NEW */

    if (event.deltaY < 0 && isAtHomeSectionTop()) { /* ✅ NEW */
      event.preventDefault(); /* ✅ NEW */
      scrollToHomeSection('auto'); /* ✅ NEW */
    }
  }

  function handleTouchStart(event) { /* ✅ NEW */
    if (!event.touches || !event.touches.length) return; /* ✅ NEW */
    lastTouchY = event.touches[0].clientY; /* ✅ NEW */
  }

  function handleTouchMove(event) { /* ✅ NEW */
    if (!isLocked || !isMobileViewport()) return; /* ✅ NEW */
    if (!event.touches || !event.touches.length) return; /* ✅ NEW */

    const currentTouchY = event.touches[0].clientY; /* ✅ NEW */
    const isTryingToScrollAboveHome = currentTouchY > lastTouchY && isAtHomeSectionTop(); /* ✅ NEW */
    lastTouchY = currentTouchY; /* ✅ NEW */

    if (isTryingToScrollAboveHome) { /* ✅ NEW */
      event.preventDefault(); /* ✅ NEW */
      scrollToHomeSection('auto'); /* ✅ NEW */
    }
  }

  function handlePopState() { /* ✅ NEW */
    if (!isLocked || !isMobileViewport()) return; /* ✅ NEW */

    pushHistoryGuard(); /* ✅ NEW */
    scrollToHomeSection('auto'); /* ✅ NEW */
  }

  function handleLogoHomeAction(event) { /* ✅ NEW */
    if (!isLocked || !isMobileViewport()) return; /* ✅ NEW */

    if (!isAtHomeSectionTop()) { /* ✅ NEW */
      event.preventDefault(); /* ✅ NEW */
      event.stopImmediatePropagation(); /* ✅ NEW */
      scrollToHomeSection('smooth'); /* ✅ NEW */
    }
  }

  window.addEventListener('scroll', guardHomeSectionBoundary, { passive: true }); /* ✅ NEW */
  window.addEventListener('resize', guardHomeSectionBoundary); /* ✅ NEW */
  window.addEventListener('orientationchange', function () { /* ✅ NEW */
    window.setTimeout(guardHomeSectionBoundary, 220); /* ✅ NEW */
  }); /* ✅ NEW */
  window.addEventListener('wheel', handleWheel, { passive: false }); /* ✅ NEW */
  window.addEventListener('touchstart', handleTouchStart, { passive: true }); /* ✅ NEW */
  window.addEventListener('touchmove', handleTouchMove, { passive: false }); /* ✅ NEW */
  window.addEventListener('popstate', handlePopState); /* ✅ NEW */

  if (logoTrigger) { /* ✅ NEW */
    logoTrigger.addEventListener('click', handleLogoHomeAction, true); /* ✅ NEW */
    logoTrigger.addEventListener('keydown', function (event) { /* ✅ NEW */
      if (event.key === 'Enter' || event.key === ' ') { /* ✅ NEW */
        handleLogoHomeAction(event); /* ✅ NEW */
      }
    }, true); /* ✅ NEW */
  }

  guardHomeSectionBoundary(); /* ✅ NEW */
  console.log('Mobile home section lock initialized'); /* ✅ NEW */
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
initSearchPopup(); /* ✅ NEW */
initMobileEdgePad(); /* ✅ NEW */
initMobileHomeSectionLock(); /* ✅ NEW */
initHome(); /* ✅ UPDATED */