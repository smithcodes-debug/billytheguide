const HERO_EXITED_CLASS = 'is-hero-exited';
const HOME_SCROLL_LOCK_CLASS = 'home-scroll-locked';
const MOBILE_POPUP_SCROLL_LOCK_CLASS = 'mobile-popup-scroll-lock';
const OPEN_MORE_STORIES_EVENT = 'billy:open-more-stories';
const DEFAULT_HANDOFF_LOCK_MS = 520;

let handoffTimer = 0;
let handoffRetryTimers = [];

function setHeroExitedState(enabled) {
  document.documentElement.classList.toggle(HERO_EXITED_CLASS, enabled);
  document.body.classList.toggle(HERO_EXITED_CLASS, enabled);
}

function clearScrollLocks() {
  document.documentElement.classList.remove(HOME_SCROLL_LOCK_CLASS, MOBILE_POPUP_SCROLL_LOCK_CLASS);
  document.body.classList.remove(HOME_SCROLL_LOCK_CLASS, MOBILE_POPUP_SCROLL_LOCK_CLASS);
}

function clearHandoffRetryTimers() {
  handoffRetryTimers.forEach(function (timerId) {
    window.clearTimeout(timerId);
  });
  handoffRetryTimers = [];
}

function getMoreStoriesSection() {
  return document.getElementById('more-stories-section');
}

function focusMoreStoriesTitle() {
  const moreStoriesTitle = document.getElementById('moreStoriesTitle');

  if (!moreStoriesTitle) return;

  window.setTimeout(function () {
    moreStoriesTitle.focus({ preventScroll: true });
  }, 120);
}

/* ✅ UPDATED */
function getTargetTop(targetSection) {
  const rect = targetSection.getBoundingClientRect();
  const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

  return Math.max(0, Math.round(rect.top + currentScrollY));
}

/* ✅ UPDATED */
function scrollToMoreStories(targetSection, behavior) {
  const top = getTargetTop(targetSection);

  window.scrollTo({
    top: top,
    left: 0,
    behavior: behavior || 'auto'
  });
}

/* ✅ UPDATED */
function runStableMoreStoriesScroll(targetSection, behavior) {
  scrollToMoreStories(targetSection, behavior);

  [48, 120, 260].forEach(function (delay) {
    const timerId = window.setTimeout(function () {
      scrollToMoreStories(targetSection, 'auto');
    }, delay);

    handoffRetryTimers.push(timerId);
  });
}

/* ✅ UPDATED */
function resetHeroOnFreshPageLoad() {
  if (window.location.hash) return;

  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  resetHeroToMoreStoriesState();

  window.setTimeout(function () {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, 0);
}

export function resetHeroToMoreStoriesState() {
  window.clearTimeout(handoffTimer);
  handoffTimer = 0;
  clearHandoffRetryTimers();
  setHeroExitedState(false);
}

export function openMoreStoriesHandoff(options) {
  const config = options || {};
  const targetSection = config.targetSection || getMoreStoriesSection();
  const beforeScroll = typeof config.beforeScroll === 'function' ? config.beforeScroll : null;
  const afterScroll = typeof config.afterScroll === 'function' ? config.afterScroll : null;
  const shouldFocusTitle = config.focusTitle === true;
  const lockMs = Number.isFinite(config.lockMs) ? config.lockMs : DEFAULT_HANDOFF_LOCK_MS;
  const behavior = config.behavior || 'smooth';

  if (!targetSection) return;

  window.clearTimeout(handoffTimer);
  handoffTimer = 0;
  clearHandoffRetryTimers();
  clearScrollLocks();

  if (beforeScroll) {
    beforeScroll();
  }

  /* ✅ UPDATED */
  setHeroExitedState(true);

  window.requestAnimationFrame(function () {
    runStableMoreStoriesScroll(targetSection, behavior);

    handoffTimer = window.setTimeout(function () {
      scrollToMoreStories(targetSection, 'auto');

      if (shouldFocusTitle) {
        focusMoreStoriesTitle();
      }

      if (afterScroll) {
        afterScroll();
      }

      window.dispatchEvent(new CustomEvent(OPEN_MORE_STORIES_EVENT));
    }, lockMs);
  });
}

window.addEventListener('pageshow', resetHeroOnFreshPageLoad);