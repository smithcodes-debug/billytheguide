import { initGesture } from './ui/gesture.js';
import { initNavigation, initSnorkelingCardNavigation } from './ui/navigation.js';
import { initContactPopup } from './ui/contact-popup.js';
import { initPolicyPopup } from './ui/policy-popup.js';
import { initTourCarousel } from './ui/tour-carousel.js';
import { initStoryExpand } from './ui/story-expand.js';
import { initAvailabilityPopup } from './modules/booking.js';
import { initSearchPopup } from './ui/search-popup.js';
import { initMobileEdgePad } from './ui/mobile-edge-pad.js';
import { initProgressiveImageLoader } from './modules/progressive-image-loader.js';

function initHomePopup() {
  const checkbox = document.getElementById('leaveNoTraceCheckbox');
  const popup = document.getElementById('leave-no-trace-popup');
  const popupCard = popup ? popup.querySelector('.popup-card') : null;
  const closeBtn = popup ? popup.querySelector('.popup-close') : null;
  const triggers = document.querySelectorAll('.cta-trigger');
  const HOME_SCROLL_LOCK_CLASS = 'home-scroll-locked';
  const OPEN_HOME_TOUR_POPUP_EVENT = 'billy:open-home-tour-popup';
  const MOBILE_TABLET_MAX_WIDTH = 1024;
  let homeScrollUnlocked = false;

  if (!checkbox || !popup || !popupCard || !closeBtn || !triggers.length) return;

  function isMobileHomeScrollLockViewport() {
    return window.innerWidth <= MOBILE_TABLET_MAX_WIDTH;
  }

  function lockHomeScrollIfNeeded() {
    if (homeScrollUnlocked) return;

    if (isMobileHomeScrollLockViewport()) {
      document.documentElement.classList.add(HOME_SCROLL_LOCK_CLASS);
      document.body.classList.add(HOME_SCROLL_LOCK_CLASS);
      return;
    }

    document.documentElement.classList.remove(HOME_SCROLL_LOCK_CLASS);
    document.body.classList.remove(HOME_SCROLL_LOCK_CLASS);
  }

  function unlockHomeScroll() {
    homeScrollUnlocked = true;
    document.documentElement.classList.remove(HOME_SCROLL_LOCK_CLASS);
    document.body.classList.remove(HOME_SCROLL_LOCK_CLASS);
  }

  lockHomeScrollIfNeeded();
  window.addEventListener('resize', lockHomeScrollIfNeeded);

  function openPopup() {
    unlockHomeScroll();
    checkbox.checked = true;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');

    triggers.forEach(function (el) {
      el.setAttribute('aria-expanded', 'true');
    });
  }

  function closePopup() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');

    triggers.forEach(function (el) {
      el.setAttribute('aria-expanded', 'false');
    });
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      openPopup();
    });

    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPopup();
      }
    });
  });

  window.addEventListener(OPEN_HOME_TOUR_POPUP_EVENT, function () {
    openPopup();
  });

  closeBtn.addEventListener('click', closePopup);

  popup.addEventListener('click', function (event) {
    if (!popupCard.contains(event.target)) {
      closePopup();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && popup.classList.contains('is-open')) {
      closePopup();
    }
  });

  console.log('Home popup initialized');
}

function initMobileHomeFeed() {
  const MOBILE_TABLET_MAX_WIDTH = 1024;
  const DESKTOP_MIN_WIDTH = 1025;
  const HOME_SECTION_SELECTOR = '.more-stories-section';
  const SOURCE_INNER_SELECTOR = '.more-stories-inner';
  const HEADER_SELECTOR = 'header';
  const FEED_CLASS = 'mobile-home-feed';
  const FEED_READY_CLASS = 'is-mobile-home-feed-ready';
  const DESKTOP_NORMAL_SCROLL_CLASS = 'is-desktop-home-feed-normal-scroll';
  const SNAP_CLASS = 'mobile-home-feed-snap';
  const HEADER_GAP = 10;
  const BOTTOM_GAP = 15;
  const DEFAULT_HEADER_HEIGHT = 78;
  const SNAP_RELOCATE_DELAY = 120;

  const homeSection = document.querySelector(HOME_SECTION_SELECTOR);
  const sourceInner = homeSection ? homeSection.querySelector(SOURCE_INNER_SELECTOR) : null;

  if (!homeSection || !sourceInner) return;
  if (homeSection.querySelector('.' + FEED_CLASS)) return;

  function isMobileTabletViewport() {
    return window.innerWidth <= MOBILE_TABLET_MAX_WIDTH;
  }

  function isDesktopViewport() {
    return window.innerWidth >= DESKTOP_MIN_WIDTH;
  }

  function cloneForMobileFeed(sourceNode) {
    const clone = sourceNode.cloneNode(true);

    clone.querySelectorAll('[id]').forEach(function (node) {
      node.removeAttribute('id');
    });

    if (clone.hasAttribute && clone.hasAttribute('id')) {
      clone.removeAttribute('id');
    }

    clone.querySelectorAll('details').forEach(function (details) {
      details.setAttribute('open', '');
    });

    return clone;
  }

  function createContentPanel(sourceNode, cardIndex) {
    const panel = document.createElement('section');
    const card = document.createElement('div');
    const scroll = document.createElement('div');
    const cardNumber = String(cardIndex + 1).padStart(2, '0');

    panel.className = 'mobile-home-feed-panel mobile-home-feed-panel-content mobile-home-feed-panel-' + cardNumber;
    card.className = 'mobile-home-feed-card mobile-home-feed-card-content mobile-home-feed-card-' + cardNumber;
    scroll.className = 'mobile-home-feed-card-scroll mobile-home-feed-card-scroll-' + cardNumber;

    panel.setAttribute('data-mobile-feed-card', cardNumber);
    card.setAttribute('data-mobile-feed-card', cardNumber);

    scroll.appendChild(cloneForMobileFeed(sourceNode));
    card.appendChild(scroll);
    panel.appendChild(card);

    return panel;
  }

  function createIntroNode() {
    const intro = document.createElement('div');
    const kicker = sourceInner.querySelector('.more-stories-kicker');
    const title = sourceInner.querySelector('.more-stories-title');
    const quote = sourceInner.querySelector('.more-stories-quote');
    const copy = sourceInner.querySelector('.more-stories-intro');
    const notes = sourceInner.querySelector('.more-stories-notes');

    if (kicker) intro.appendChild(cloneForMobileFeed(kicker));
    if (title) intro.appendChild(cloneForMobileFeed(title));
    if (quote) intro.appendChild(cloneForMobileFeed(quote));
    if (copy) intro.appendChild(cloneForMobileFeed(copy));

    if (notes) {
      const notesClone = cloneForMobileFeed(notes);

      notesClone.classList.add('mobile-home-feed-card-01-notes');

      notesClone.querySelectorAll('.more-stories-note').forEach(function (note) {
        note.classList.add('mobile-home-feed-card-01-note');
      });

      intro.appendChild(notesClone);
    }

    return intro;
  }

  const feed = document.createElement('div');
  const handle = document.createElement('span');
  const contentNodes = [];
  let isSnapActivated = false;
  let relocateTimer = 0;
  let isProgrammaticFeedRelocate = false;

  feed.className = FEED_CLASS;
  feed.setAttribute('aria-label', 'Mobile home feed');

  handle.className = 'mobile-home-feed-handle';
  handle.setAttribute('aria-hidden', 'true');

  contentNodes.push(createIntroNode());

  sourceInner.querySelectorAll('.more-service-card').forEach(function (card) {
    contentNodes.push(card);
  });

  sourceInner.querySelectorAll('.more-accordion-item').forEach(function (item) {
    contentNodes.push(item);
  });

  contentNodes.slice(0, 10).forEach(function (node, index) {
    feed.appendChild(createContentPanel(node, index));
  });

  homeSection.appendChild(feed);
  homeSection.appendChild(handle);

  function getHeaderHeight() {
    const header = document.querySelector(HEADER_SELECTOR);
    const rect = header ? header.getBoundingClientRect() : null;
    const measuredHeight = rect ? Math.ceil(rect.height) : 0;

    return measuredHeight > 0 ? measuredHeight : DEFAULT_HEADER_HEIGHT;
  }

  function syncMobileFeedMetrics() {
    const headerHeight = getHeaderHeight();

    feed.style.setProperty('--mobile-feed-header-height', headerHeight + 'px');
    feed.style.setProperty('--mobile-feed-header-gap', HEADER_GAP + 'px');
    feed.style.setProperty('--mobile-feed-bottom-gap', BOTTOM_GAP + 'px');
  }

  function getNearestPanel() {
    const panels = Array.prototype.slice.call(feed.querySelectorAll('.mobile-home-feed-panel'));

    if (!panels.length) return null;

    let nearestPanel = panels[0];
    let nearestDistance = Infinity;

    panels.forEach(function (panel) {
      const distance = Math.abs(panel.offsetTop - feed.scrollTop);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestPanel = panel;
      }
    });

    return nearestPanel;
  }

  function relocateToNearestPanel(behavior) {
    if (!isMobileTabletViewport() || !isSnapActivated) return;
    if (isProgrammaticFeedRelocate) return;

    const nearestPanel = getNearestPanel();

    if (!nearestPanel) return;

    const targetTop = nearestPanel.offsetTop;

    if (Math.abs(feed.scrollTop - targetTop) <= 2) return;

    isProgrammaticFeedRelocate = true;

    feed.scrollTo({
      top: targetTop,
      left: 0,
      behavior: behavior || 'auto'
    });

    window.setTimeout(function () {
      isProgrammaticFeedRelocate = false;
    }, 180);
  }

  function scheduleFeedRelocate() {
    if (!isMobileTabletViewport() || !isSnapActivated) return;
    if (isProgrammaticFeedRelocate) return;

    window.clearTimeout(relocateTimer);

    relocateTimer = window.setTimeout(function () {
      syncMobileFeedMetrics();
      relocateToNearestPanel('auto');
    }, SNAP_RELOCATE_DELAY);
  }

  function applySnapStateIfNeeded() {
    if (isMobileTabletViewport() && isSnapActivated) {
      document.documentElement.classList.add(SNAP_CLASS);
      document.body.classList.add(SNAP_CLASS);
      syncMobileFeedMetrics();
      return;
    }

    document.documentElement.classList.remove(SNAP_CLASS);
    document.body.classList.remove(SNAP_CLASS);
  }

  function activateSnapWhenHomeReached() {
    if (!isMobileTabletViewport() || isSnapActivated) return;

    if (homeSection.getBoundingClientRect().top <= 8) {
      isSnapActivated = true;
      syncMobileFeedMetrics();
      applySnapStateIfNeeded();

      window.requestAnimationFrame(function () {
        relocateToNearestPanel('auto');
      });
    }
  }

  function syncMobileFeedState() {
    homeSection.classList.add(FEED_READY_CLASS);
    syncMobileFeedMetrics();

    if (isDesktopViewport()) {
      homeSection.classList.add(DESKTOP_NORMAL_SCROLL_CLASS);
      applySnapStateIfNeeded();
      return;
    }

    homeSection.classList.remove(DESKTOP_NORMAL_SCROLL_CLASS);
    activateSnapWhenHomeReached();
    applySnapStateIfNeeded();
    scheduleFeedRelocate();
  }

  syncMobileFeedState();

  feed.addEventListener('scroll', scheduleFeedRelocate, { passive: true });

  feed.addEventListener('touchend', function () {
    scheduleFeedRelocate();
  }, { passive: true });

  feed.addEventListener('wheel', function () {
    scheduleFeedRelocate();
  }, { passive: true });

  window.addEventListener('scroll', activateSnapWhenHomeReached, { passive: true });

  window.addEventListener('resize', function () {
    syncMobileFeedState();
    scheduleFeedRelocate();
  });

  window.addEventListener('orientationchange', function () {
    window.setTimeout(function () {
      syncMobileFeedState();
      relocateToNearestPanel('auto');
    }, 220);
  });

  console.log('Mobile home feed initialized');
}

function initMobileHomeSectionLock() {
  const MOBILE_TABLET_MAX_WIDTH = 1024;
  const HOME_SECTION_SELECTOR = '.more-stories-section';
  const HOME_SECTION_LOCK_TOP_OFFSET = 8;
  const HOME_SECTION_CURRENT_TOP_TOLERANCE = 14;
  const HOME_SECTION_FORCE_SCROLL_DELAY = 16;
  const logoTrigger = document.getElementById('logoTrigger');
  const homeSection = document.querySelector(HOME_SECTION_SELECTOR);
  let isLocked = false;
  let isProgrammaticScroll = false;
  let lastTouchY = 0;
  let hasHistoryGuard = false;

  if (!homeSection) return;

  function isMobileTabletViewport() {
    return window.innerWidth <= MOBILE_TABLET_MAX_WIDTH;
  }

  function getHomeSectionTop() {
    return Math.max(0, Math.round(homeSection.getBoundingClientRect().top + window.scrollY));
  }

  function getCurrentScrollY() {
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  function isAtHomeSectionTop() {
    const homeTop = getHomeSectionTop();

    return Math.abs(getCurrentScrollY() - homeTop) <= HOME_SECTION_CURRENT_TOP_TOLERANCE;
  }

  function isBeforeHomeSection() {
    const homeTop = getHomeSectionTop();

    return getCurrentScrollY() < homeTop - HOME_SECTION_CURRENT_TOP_TOLERANCE;
  }

  function scrollToHomeSection(behavior) {
    const homeTop = getHomeSectionTop();

    isProgrammaticScroll = true;

    window.scrollTo({
      top: homeTop,
      left: 0,
      behavior: behavior || 'auto'
    });

    window.setTimeout(function () {
      isProgrammaticScroll = false;
    }, HOME_SECTION_FORCE_SCROLL_DELAY);
  }

  function pushHistoryGuard() {
    if (hasHistoryGuard || !isMobileTabletViewport()) return;

    try {
      window.history.pushState({ mobileHomeSectionLocked: true }, document.title, window.location.href);
      hasHistoryGuard = true;
    } catch (error) {
      hasHistoryGuard = false;
    }
  }

  function activateLock() {
    if (isLocked || !isMobileTabletViewport()) return;

    isLocked = true;
    pushHistoryGuard();

    if (isBeforeHomeSection()) {
      scrollToHomeSection('auto');
    }
  }

  function shouldActivateFromViewport() {
    if (!isMobileTabletViewport()) return false;

    const rect = homeSection.getBoundingClientRect();

    return rect.top <= HOME_SECTION_LOCK_TOP_OFFSET;
  }

  function guardHomeSectionBoundary() {
    if (!isMobileTabletViewport()) return;

    if (!isLocked && shouldActivateFromViewport()) {
      activateLock();
    }

    if (!isLocked || isProgrammaticScroll) return;

    if (isBeforeHomeSection()) {
      scrollToHomeSection('auto');
    }
  }

  function handleWheel(event) {
    if (!isLocked || !isMobileTabletViewport()) return;

    if (event.deltaY < 0 && isAtHomeSectionTop()) {
      event.preventDefault();
      scrollToHomeSection('auto');
    }
  }

  function handleTouchStart(event) {
    if (!event.touches || !event.touches.length) return;

    lastTouchY = event.touches[0].clientY;
  }

  function handleTouchMove(event) {
    if (!isLocked || !isMobileTabletViewport()) return;
    if (!event.touches || !event.touches.length) return;

    const currentTouchY = event.touches[0].clientY;
    const isTryingToScrollAboveHome = currentTouchY > lastTouchY && isAtHomeSectionTop();

    lastTouchY = currentTouchY;

    if (isTryingToScrollAboveHome) {
      event.preventDefault();
      scrollToHomeSection('auto');
    }
  }

  function handlePopState() {
    if (!isLocked || !isMobileTabletViewport()) return;

    pushHistoryGuard();
    scrollToHomeSection('auto');
  }

  function handleLogoHomeAction(event) {
    if (!isLocked || !isMobileTabletViewport()) return;

    if (!isAtHomeSectionTop()) {
      event.preventDefault();
      event.stopImmediatePropagation();
      scrollToHomeSection('smooth');
    }
  }

  window.addEventListener('scroll', guardHomeSectionBoundary, { passive: true });
  window.addEventListener('resize', guardHomeSectionBoundary);

  window.addEventListener('orientationchange', function () {
    window.setTimeout(guardHomeSectionBoundary, 220);
  });

  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('popstate', handlePopState);

  if (logoTrigger) {
    logoTrigger.addEventListener('click', handleLogoHomeAction, true);

    logoTrigger.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        handleLogoHomeAction(event);
      }
    }, true);
  }

  guardHomeSectionBoundary();

  console.log('Mobile home section lock initialized');
}

const APP_LOADING_CLASS = 'js-loading';
const APP_READY_CLASS = 'js-ready';

function markAppReady() {
  document.body.classList.remove(APP_LOADING_CLASS);
  document.body.classList.add(APP_READY_CLASS);
}

function markAppReadyOnNextPaint() {
  window.requestAnimationFrame(function () {
    markAppReady();
  });
}

function safeInit(initFn, initName) {
  try {
    initFn();
  } catch (error) {
    console.error(initName + ' failed', error);
  }
}

function initHome() {
  console.log('Home initialized');
}

safeInit(initGesture, 'initGesture');
safeInit(initNavigation, 'initNavigation');
safeInit(initHomePopup, 'initHomePopup');
safeInit(initPolicyPopup, 'initPolicyPopup');
safeInit(initContactPopup, 'initContactPopup');
safeInit(initTourCarousel, 'initTourCarousel');
safeInit(initStoryExpand, 'initStoryExpand');
safeInit(initSnorkelingCardNavigation, 'initSnorkelingCardNavigation');
safeInit(initAvailabilityPopup, 'initAvailabilityPopup');
safeInit(initSearchPopup, 'initSearchPopup');
safeInit(initMobileEdgePad, 'initMobileEdgePad');
safeInit(initMobileHomeFeed, 'initMobileHomeFeed');
safeInit(initProgressiveImageLoader, 'initProgressiveImageLoader');
safeInit(initMobileHomeSectionLock, 'initMobileHomeSectionLock');
safeInit(initHome, 'initHome');
markAppReadyOnNextPaint();