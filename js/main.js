import { initGesture } from './ui/gesture.js'; /* ✅ UPDATED */
import { initNavigation, initSnorkelingCardNavigation } from './ui/navigation.js'; /* ✅ UPDATED */
import { initContactPopup } from './ui/contact-popup.js'; /* ✅ NEW */
import { initPolicyPopup } from './ui/policy-popup.js'; /* ✅ NEW */
import { initTourCarousel } from './ui/tour-carousel.js'; /* ✅ NEW */
import { initStoryExpand } from './ui/story-expand.js'; /* ✅ NEW */
import { initAvailabilityPopup } from './modules/booking.js'; /* ✅ NEW */
import { initSearchPopup } from './ui/search-popup.js'; /* ✅ NEW */
import { initMobileEdgePad } from './ui/mobile-edge-pad.js'; /* ✅ NEW */
import { initProgressiveImageLoader } from './modules/progressive-image-loader.js'; /* ✅ NEW */
import { initSiteFooter } from './modules/site-footer.js'; /* ✅ NEW */

function initHomePopup() { /* ✅ NEW */
  const checkbox = document.getElementById('leaveNoTraceCheckbox'); /* ✅ NEW */
  const popup = document.getElementById('leave-no-trace-popup'); /* ✅ NEW */
  const popupCard = popup ? popup.querySelector('.popup-card') : null; /* ✅ NEW */
  const closeBtn = popup ? popup.querySelector('.popup-close') : null; /* ✅ NEW */
  const triggers = document.querySelectorAll('.cta-trigger'); /* ✅ NEW */
  const HOME_SCROLL_LOCK_CLASS = 'home-scroll-locked'; /* ✅ NEW */
  const OPEN_HOME_TOUR_POPUP_EVENT = 'billy:open-home-tour-popup'; /* ✅ NEW */
  const MOBILE_TABLET_MAX_WIDTH = 1024; /* ✅ UPDATED: mobile + tablet dùng cùng rule */
  let homeScrollUnlocked = false; /* ✅ NEW */

  if (!checkbox || !popup || !popupCard || !closeBtn || !triggers.length) return; /* ✅ REQUIRED FIX */

  function isMobileHomeScrollLockViewport() { /* ✅ UPDATED */
    return window.innerWidth <= MOBILE_TABLET_MAX_WIDTH; /* ✅ UPDATED */
  }

  function lockHomeScrollIfNeeded() { /* ✅ NEW */
    if (homeScrollUnlocked) return; /* ✅ NEW */

    if (isMobileHomeScrollLockViewport()) { /* ✅ UPDATED */
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

function initMobileHomeFeed() { /* ✅ NEW */
  const MOBILE_TABLET_MAX_WIDTH = 1024; /* ✅ UPDATED: mobile + tablet giống nhau 100% */
  const DESKTOP_MIN_WIDTH = 1025; /* ✅ NEW: desktop cuộn bình thường */
  const HOME_SECTION_SELECTOR = '.more-stories-section'; /* ✅ NEW */
  const SOURCE_INNER_SELECTOR = '.more-stories-inner'; /* ✅ NEW */
  const FEED_CLASS = 'mobile-home-feed'; /* ✅ NEW */
  const FEED_READY_CLASS = 'is-mobile-home-feed-ready'; /* ✅ NEW */
  const DESKTOP_NORMAL_SCROLL_CLASS = 'is-desktop-home-feed-normal-scroll'; /* ✅ NEW */
  const SNAP_CLASS = 'mobile-home-feed-snap'; /* ✅ NEW */
  const homeSection = document.querySelector(HOME_SECTION_SELECTOR); /* ✅ NEW */
  const sourceInner = homeSection ? homeSection.querySelector(SOURCE_INNER_SELECTOR) : null; /* ✅ NEW */

  if (!homeSection || !sourceInner) return; /* ✅ REQUIRED FIX */
  if (homeSection.querySelector('.' + FEED_CLASS)) return; /* ✅ REQUIRED FIX */

  function isMobileTabletViewport() { /* ✅ UPDATED */
    return window.innerWidth <= MOBILE_TABLET_MAX_WIDTH; /* ✅ UPDATED */
  }

  function isDesktopViewport() { /* ✅ NEW */
    return window.innerWidth >= DESKTOP_MIN_WIDTH; /* ✅ NEW */
  }

  function cloneForMobileFeed(sourceNode) { /* ✅ NEW */
    const clone = sourceNode.cloneNode(true); /* ✅ NEW */

    clone.querySelectorAll('[id]').forEach(function (node) { /* ✅ NEW */
      node.removeAttribute('id'); /* ✅ REQUIRED FIX: tránh duplicate id với desktop source */
    });

    if (clone.hasAttribute && clone.hasAttribute('id')) { /* ✅ NEW */
      clone.removeAttribute('id'); /* ✅ REQUIRED FIX */
    }

    clone.querySelectorAll('details').forEach(function (details) { /* ✅ NEW */
      details.setAttribute('open', ''); /* ✅ NEW */
    });

    return clone; /* ✅ NEW */
  }

  function createContentPanel(sourceNode, cardIndex) { /* ✅ UPDATED */
    const panel = document.createElement('section'); /* ✅ NEW */
    const card = document.createElement('div'); /* ✅ NEW */
    const scroll = document.createElement('div'); /* ✅ NEW */
    const cardNumber = String(cardIndex + 1).padStart(2, '0'); /* ✅ NEW */

    panel.className = 'mobile-home-feed-panel mobile-home-feed-panel-content mobile-home-feed-panel-' + cardNumber; /* ✅ UPDATED */
    card.className = 'mobile-home-feed-card mobile-home-feed-card-content mobile-home-feed-card-' + cardNumber; /* ✅ UPDATED */
    scroll.className = 'mobile-home-feed-card-scroll mobile-home-feed-card-scroll-' + cardNumber; /* ✅ UPDATED */

    panel.setAttribute('data-mobile-feed-card', cardNumber); /* ✅ NEW */
    card.setAttribute('data-mobile-feed-card', cardNumber); /* ✅ NEW */

    scroll.appendChild(cloneForMobileFeed(sourceNode)); /* ✅ NEW */
    card.appendChild(scroll); /* ✅ NEW */
    panel.appendChild(card); /* ✅ NEW */

    return panel; /* ✅ NEW */
  }

  function createIntroNode() { /* ✅ NEW */
    const intro = document.createElement('div'); /* ✅ NEW */
    const kicker = sourceInner.querySelector('.more-stories-kicker'); /* ✅ NEW */
    const title = sourceInner.querySelector('.more-stories-title'); /* ✅ NEW */
    const quote = sourceInner.querySelector('.more-stories-quote'); /* ✅ NEW */
    const copy = sourceInner.querySelector('.more-stories-intro'); /* ✅ NEW */
    const notes = sourceInner.querySelector('.more-stories-notes');

    if (kicker) intro.appendChild(cloneForMobileFeed(kicker)); /* ✅ NEW */
    if (title) intro.appendChild(cloneForMobileFeed(title)); /* ✅ NEW */
    if (quote) intro.appendChild(cloneForMobileFeed(quote)); /* ✅ NEW */
    if (copy) intro.appendChild(cloneForMobileFeed(copy)); /* ✅ NEW */

    if (notes) {
      const notesClone = cloneForMobileFeed(notes);
      notesClone.classList.add('mobile-home-feed-card-01-notes');

      notesClone.querySelectorAll('.more-stories-note').forEach(function (note) {
        note.classList.add('mobile-home-feed-card-01-note');
      });

      intro.appendChild(notesClone);
    }

    return intro; /* ✅ NEW */
  }

  const feed = document.createElement('div'); /* ✅ NEW */
  const handle = document.createElement('span'); /* ✅ NEW */
  const contentNodes = []; /* ✅ NEW */
  let isSnapActivated = false; /* ✅ NEW */

  feed.className = FEED_CLASS; /* ✅ NEW */
  feed.setAttribute('aria-label', 'Mobile home feed'); /* ✅ NEW */

  handle.className = 'mobile-home-feed-handle'; /* ✅ NEW */
  handle.setAttribute('aria-hidden', 'true'); /* ✅ NEW */

  contentNodes.push(createIntroNode()); /* ✅ NEW */

  sourceInner.querySelectorAll('.more-service-card').forEach(function (card) { /* ✅ NEW */
    contentNodes.push(card); /* ✅ NEW */
  });

  sourceInner.querySelectorAll('.more-accordion-item').forEach(function (item) { /* ✅ NEW */
    contentNodes.push(item); /* ✅ NEW */
  });

  contentNodes.slice(0, 10).forEach(function (node, index) { /* ✅ UPDATED: limit to 10 maintainable mobile feed cards */
    feed.appendChild(createContentPanel(node, index)); /* ✅ UPDATED */
  });

  homeSection.appendChild(feed); /* ✅ NEW */
  homeSection.appendChild(handle); /* ✅ NEW */

  function applySnapStateIfNeeded() { /* ✅ UPDATED */
    if (isMobileTabletViewport() && isSnapActivated) { /* ✅ UPDATED */
      document.documentElement.classList.add(SNAP_CLASS); /* ✅ NEW */
      document.body.classList.add(SNAP_CLASS); /* ✅ NEW */
      return; /* ✅ NEW */
    }

    document.documentElement.classList.remove(SNAP_CLASS); /* ✅ NEW */
    document.body.classList.remove(SNAP_CLASS); /* ✅ NEW */
  }

  function activateSnapWhenHomeReached() { /* ✅ UPDATED */
    if (!isMobileTabletViewport() || isSnapActivated) return; /* ✅ UPDATED */

    if (homeSection.getBoundingClientRect().top <= 8) { /* ✅ NEW */
      isSnapActivated = true; /* ✅ NEW */
      applySnapStateIfNeeded(); /* ✅ NEW */
    }
  }

  function syncMobileFeedState() { /* ✅ UPDATED */
    homeSection.classList.add(FEED_READY_CLASS); /* ✅ UPDATED: desktop cũng dùng visual card feed */

    if (isDesktopViewport()) { /* ✅ NEW */
      homeSection.classList.add(DESKTOP_NORMAL_SCROLL_CLASS); /* ✅ NEW */
      applySnapStateIfNeeded(); /* ✅ NEW */
      return; /* ✅ NEW */
    }

    homeSection.classList.remove(DESKTOP_NORMAL_SCROLL_CLASS); /* ✅ NEW */
    activateSnapWhenHomeReached(); /* ✅ UPDATED */
    applySnapStateIfNeeded(); /* ✅ NEW */
  }

  syncMobileFeedState(); /* ✅ NEW */

  window.addEventListener('scroll', activateSnapWhenHomeReached, { passive: true }); /* ✅ NEW */
  window.addEventListener('resize', syncMobileFeedState); /* ✅ NEW */

  window.addEventListener('orientationchange', function () { /* ✅ NEW */
    window.setTimeout(syncMobileFeedState, 220); /* ✅ NEW */
  }); /* ✅ NEW */

  console.log('Mobile home feed initialized'); /* ✅ NEW */
}

function initMobileHomeSectionLock() { /* ✅ NEW */
  const MOBILE_TABLET_MAX_WIDTH = 1024; /* ✅ UPDATED: mobile + tablet lock giống nhau */
  const HOME_SECTION_SELECTOR = '.more-stories-section'; /* ✅ NEW */
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

  function isMobileTabletViewport() { /* ✅ UPDATED */
    return window.innerWidth <= MOBILE_TABLET_MAX_WIDTH; /* ✅ UPDATED */
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
    if (hasHistoryGuard || !isMobileTabletViewport()) return; /* ✅ UPDATED */

    try { /* ✅ NEW */
      window.history.pushState({ mobileHomeSectionLocked: true }, document.title, window.location.href); /* ✅ NEW */
      hasHistoryGuard = true; /* ✅ NEW */
    } catch (error) { /* ✅ NEW */
      hasHistoryGuard = false; /* ✅ NEW */
    }
  }

  function activateLock() { /* ✅ NEW */
    if (isLocked || !isMobileTabletViewport()) return; /* ✅ UPDATED */

    isLocked = true; /* ✅ NEW */
    pushHistoryGuard(); /* ✅ NEW */

    if (isBeforeHomeSection()) { /* ✅ NEW */
      scrollToHomeSection('auto'); /* ✅ NEW */
    }
  }

  function shouldActivateFromViewport() { /* ✅ NEW */
    if (!isMobileTabletViewport()) return false; /* ✅ UPDATED */

    const rect = homeSection.getBoundingClientRect(); /* ✅ NEW */
    return rect.top <= HOME_SECTION_LOCK_TOP_OFFSET; /* ✅ NEW */
  }

  function guardHomeSectionBoundary() { /* ✅ NEW */
    if (!isMobileTabletViewport()) return; /* ✅ UPDATED */

    if (!isLocked && shouldActivateFromViewport()) { /* ✅ NEW */
      activateLock(); /* ✅ NEW */
    }

    if (!isLocked || isProgrammaticScroll) return; /* ✅ NEW */

    if (isBeforeHomeSection()) { /* ✅ NEW */
      scrollToHomeSection('auto'); /* ✅ NEW */
    }
  }

  function handleWheel(event) { /* ✅ NEW */
    if (!isLocked || !isMobileTabletViewport()) return; /* ✅ UPDATED */

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
    if (!isLocked || !isMobileTabletViewport()) return; /* ✅ UPDATED */
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
    if (!isLocked || !isMobileTabletViewport()) return; /* ✅ UPDATED */

    pushHistoryGuard(); /* ✅ NEW */
    scrollToHomeSection('auto'); /* ✅ NEW */
  }

  function handleLogoHomeAction(event) { /* ✅ NEW */
    if (!isLocked || !isMobileTabletViewport()) return; /* ✅ UPDATED */

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

const APP_LOADING_CLASS = 'js-loading'; /* ✅ NEW */
const APP_READY_CLASS = 'js-ready'; /* ✅ NEW */

function markAppReady() { /* ✅ NEW */
  document.body.classList.remove(APP_LOADING_CLASS); /* ✅ NEW */
  document.body.classList.add(APP_READY_CLASS); /* ✅ NEW */
} /* ✅ NEW */

function markAppReadyOnNextPaint() { /* ✅ NEW */
  window.requestAnimationFrame(function () { /* ✅ NEW */
    markAppReady(); /* ✅ NEW */
  }); /* ✅ NEW */
} /* ✅ NEW */

function safeInit(initFn, initName) { /* ✅ NEW */
  try { /* ✅ NEW */
    initFn(); /* ✅ NEW */
  } catch (error) { /* ✅ NEW */
    console.error(initName + ' failed', error); /* ✅ NEW */
  } /* ✅ NEW */
} /* ✅ NEW */

function initHome() { /* ✅ UPDATED */
  console.log('Home initialized'); /* ✅ UPDATED */
}

safeInit(initGesture, 'initGesture'); /* ✅ UPDATED */
safeInit(initNavigation, 'initNavigation'); /* ✅ UPDATED */
safeInit(initHomePopup, 'initHomePopup'); /* ✅ UPDATED */
safeInit(initPolicyPopup, 'initPolicyPopup'); /* ✅ UPDATED */
safeInit(initContactPopup, 'initContactPopup'); /* ✅ UPDATED */
safeInit(initTourCarousel, 'initTourCarousel'); /* ✅ UPDATED */
safeInit(initStoryExpand, 'initStoryExpand'); /* ✅ UPDATED */
safeInit(initSnorkelingCardNavigation, 'initSnorkelingCardNavigation'); /* ✅ UPDATED */
safeInit(initAvailabilityPopup, 'initAvailabilityPopup'); /* ✅ UPDATED */
safeInit(initSearchPopup, 'initSearchPopup'); /* ✅ UPDATED */
safeInit(initMobileEdgePad, 'initMobileEdgePad'); /* ✅ UPDATED */
safeInit(initMobileHomeFeed, 'initMobileHomeFeed'); /* ✅ UPDATED */
safeInit(initProgressiveImageLoader, 'initProgressiveImageLoader'); /* ✅ NEW */
safeInit(initSiteFooter, 'initSiteFooter'); /* ✅ NEW */
safeInit(initMobileHomeSectionLock, 'initMobileHomeSectionLock'); /* ✅ UPDATED */
safeInit(initHome, 'initHome'); /* ✅ UPDATED */

markAppReadyOnNextPaint(); /* ✅ NEW */