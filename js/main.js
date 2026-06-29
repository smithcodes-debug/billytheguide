import { initGesture } from './ui/gesture.js';
import { initNavigation, initSnorkelingCardNavigation } from './ui/navigation.js';
import { initContactPopup } from './ui/contact-popup.js';
import { initPolicyPopup } from './ui/policy-popup.js';
import { initTourCarousel } from './ui/tour-carousel.js';
import { initStoryExpand } from './ui/story-expand.js';
import { initSearchPopup } from './ui/search-popup.js';
import { initProgressiveImageLoader } from './modules/progressive-image-loader.js';
import { initSiteFooter } from './modules/site-footer.js';
import { initDebugSiteReset } from './modules/debug-site-reset.js';

const APP_LOADING_CLASS = 'js-loading';
const APP_READY_CLASS = 'js-ready';

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

  lockHomeScrollIfNeeded();
  window.addEventListener('resize', lockHomeScrollIfNeeded);

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

  window.addEventListener(OPEN_HOME_TOUR_POPUP_EVENT, openPopup);

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
}

function initMobileHomeFeed() {
  const MOBILE_TABLET_MAX_WIDTH = 1024;
  const DESKTOP_MIN_WIDTH = 1025;
  const HOME_SECTION_SELECTOR = '.more-stories-section';
  const SOURCE_INNER_SELECTOR = '.more-stories-inner';
  const FEED_CLASS = 'mobile-home-feed';
  const FEED_READY_CLASS = 'is-mobile-home-feed-ready';
  const DESKTOP_NORMAL_SCROLL_CLASS = 'is-desktop-home-feed-normal-scroll';
  const SNAP_CLASS = 'mobile-home-feed-snap';
  const FEED_ENDING_CLASS = 'is-feed-ending';
  const LAST_CARD_CLASS = 'mobile-home-feed-panel-last';
  const LAST_CARD_VISIBLE_RATIO = 0.58;

  const homeSection = document.querySelector(HOME_SECTION_SELECTOR);
  const sourceInner = homeSection ? homeSection.querySelector(SOURCE_INNER_SELECTOR) : null;
  const heroSection = document.querySelector('.hero');

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

  function appendCloneIfExists(parent, sourceNode, extraClassName) {
    if (!sourceNode) return;

    const clone = cloneForMobileFeed(sourceNode);

    if (extraClassName) {
      clone.classList.add(extraClassName);
    }

    parent.appendChild(clone);
  }

  function createMainHeroNode() {
    const heroNode = document.createElement('div');
    const tagline = heroSection ? heroSection.querySelector('.hero-guide-tagline') : null;
    const title = heroSection ? heroSection.querySelector('.title') : null;
    const story = heroSection ? heroSection.querySelector('.story') : null;
    const ctaRow = heroSection ? heroSection.querySelector('.cta-row') : null;

    heroNode.className = 'mobile-home-feed-main-hero';

    appendCloneIfExists(heroNode, tagline, 'mobile-home-feed-main-hero-tagline');
    appendCloneIfExists(heroNode, title, 'mobile-home-feed-main-hero-title');
    appendCloneIfExists(heroNode, story, 'mobile-home-feed-main-hero-story');
    appendCloneIfExists(heroNode, ctaRow, 'mobile-home-feed-main-hero-cta');

    return heroNode;
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

      notesClone.classList.add('mobile-home-feed-card-02-notes');

      notesClone.querySelectorAll('.more-stories-note').forEach(function (note) {
        note.classList.add('mobile-home-feed-card-02-note');
      });

      intro.appendChild(notesClone);
    }

    return intro;
  }

  function createContentPanel(sourceNode, cardIndex, totalCards) {
    const panel = document.createElement('section');
    const card = document.createElement('div');
    const scroll = document.createElement('div');
    const cardNumber = String(cardIndex + 1).padStart(2, '0');
    const isLastCard = cardIndex === totalCards - 1;

    panel.className =
      'mobile-home-feed-panel mobile-home-feed-panel-content mobile-home-feed-panel-' +
      cardNumber;

    card.className =
      'mobile-home-feed-card mobile-home-feed-card-content mobile-home-feed-card-' +
      cardNumber;

    scroll.className =
      'mobile-home-feed-card-scroll mobile-home-feed-card-scroll-' +
      cardNumber;

    if (isLastCard) {
      panel.classList.add(LAST_CARD_CLASS);
      card.classList.add('mobile-home-feed-card-last');
      scroll.classList.add('mobile-home-feed-card-scroll-last');
      panel.setAttribute('data-mobile-feed-last-card', 'true');
      card.setAttribute('data-mobile-feed-last-card', 'true');
    }

    panel.setAttribute('data-mobile-feed-card', cardNumber);
    card.setAttribute('data-mobile-feed-card', cardNumber);

    scroll.appendChild(cloneForMobileFeed(sourceNode));
    card.appendChild(scroll);
    panel.appendChild(card);

    return panel;
  }

  const feed = document.createElement('div');
  const handle = document.createElement('span');
  const contentNodes = [];

  let isSnapActivated = false;
  let lastPanel = null;

  feed.className = FEED_CLASS;
  feed.setAttribute('aria-label', 'Mobile home feed');

  handle.className = 'mobile-home-feed-handle';
  handle.setAttribute('aria-hidden', 'true');

  contentNodes.push(createMainHeroNode());
  contentNodes.push(createIntroNode());

  sourceInner.querySelectorAll('.more-service-card').forEach(function (card) {
    contentNodes.push(card);
  });

  sourceInner.querySelectorAll('.more-accordion-item').forEach(function (item) {
    contentNodes.push(item);
  });

  const feedNodes = contentNodes.slice(0, 9);

  feedNodes.forEach(function (node, index) {
    const panel = createContentPanel(node, index, feedNodes.length);

    feed.appendChild(panel);

    if (index === feedNodes.length - 1) {
      lastPanel = panel;
    }
  });

  homeSection.appendChild(feed);
  homeSection.appendChild(handle);

  function setFeedEndingMode(enabled) {
    document.documentElement.classList.toggle(FEED_ENDING_CLASS, enabled);
    document.body.classList.toggle(FEED_ENDING_CLASS, enabled);
    homeSection.classList.toggle(FEED_ENDING_CLASS, enabled);
  }

  function applySnapStateIfNeeded() {
    if (isMobileTabletViewport() && isSnapActivated) {
      document.documentElement.classList.add(SNAP_CLASS);
      document.body.classList.add(SNAP_CLASS);
      return;
    }

    document.documentElement.classList.remove(SNAP_CLASS);
    document.body.classList.remove(SNAP_CLASS);
  }

  function activateSnapState() {
    if (!isMobileTabletViewport()) return;

    isSnapActivated = true;
    applySnapStateIfNeeded();
  }

  function activateSnapWhenHomeReached() {
    if (!isMobileTabletViewport() || isSnapActivated) return;

    if (homeSection.getBoundingClientRect().top <= 8) {
      activateSnapState();
    }
  }

  function getLastPanelVisibleRatio() {
    if (!lastPanel) return 0;

    const feedRect = feed.getBoundingClientRect();
    const panelRect = lastPanel.getBoundingClientRect();
    const visibleTop = Math.max(feedRect.top, panelRect.top);
    const visibleBottom = Math.min(feedRect.bottom, panelRect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    return panelRect.height > 0 ? visibleHeight / panelRect.height : 0;
  }

  function syncFeedEndingState() {
    if (!isMobileTabletViewport() || !lastPanel) {
      setFeedEndingMode(false);
      return;
    }

    setFeedEndingMode(getLastPanelVisibleRatio() >= LAST_CARD_VISIBLE_RATIO);
  }

  function initLastPanelObserver() {
    if (!lastPanel || typeof IntersectionObserver === 'undefined') return;

    const lastPanelObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!isMobileTabletViewport()) return;

        setFeedEndingMode(entry.intersectionRatio >= LAST_CARD_VISIBLE_RATIO);
      });
    }, {
      root: feed,
      threshold: [0, 0.45, LAST_CARD_VISIBLE_RATIO, 0.82]
    });

    lastPanelObserver.observe(lastPanel);
  }

  function syncMobileFeedState() {
    homeSection.classList.add(FEED_READY_CLASS);

    if (isDesktopViewport()) {
      homeSection.classList.add(DESKTOP_NORMAL_SCROLL_CLASS);
      isSnapActivated = false;
      setFeedEndingMode(false);
      applySnapStateIfNeeded();
      return;
    }

    homeSection.classList.remove(DESKTOP_NORMAL_SCROLL_CLASS);
    syncFeedEndingState();
  }

  syncMobileFeedState();
  initLastPanelObserver();

  window.addEventListener('scroll', activateSnapWhenHomeReached, { passive: true });
  feed.addEventListener('scroll', syncFeedEndingState, { passive: true });
  window.addEventListener('resize', syncMobileFeedState);

  window.addEventListener('orientationchange', function () {
    window.setTimeout(syncMobileFeedState, 220);
  });
}

function markAppReady() {
  document.body.classList.remove(APP_LOADING_CLASS);
  document.body.classList.add(APP_READY_CLASS);
}

function markAppReadyOnNextPaint() {
  window.requestAnimationFrame(markAppReady);
}

function safeInit(initFn, initName) {
  try {
    initFn();
  } catch (error) {
    console.error(initName + ' failed', error);
  }
}

function initHome() {}

safeInit(initGesture, 'initGesture');
safeInit(initNavigation, 'initNavigation');
safeInit(initMobileHomeFeed, 'initMobileHomeFeed');
safeInit(initHomePopup, 'initHomePopup');
safeInit(initPolicyPopup, 'initPolicyPopup');
safeInit(initContactPopup, 'initContactPopup');
safeInit(initTourCarousel, 'initTourCarousel');
safeInit(initStoryExpand, 'initStoryExpand');
safeInit(initSnorkelingCardNavigation, 'initSnorkelingCardNavigation');
safeInit(initSearchPopup, 'initSearchPopup');
safeInit(initProgressiveImageLoader, 'initProgressiveImageLoader');
safeInit(initSiteFooter, 'initSiteFooter');
safeInit(initDebugSiteReset, 'initDebugSiteReset');
safeInit(initHome, 'initHome');

markAppReadyOnNextPaint();