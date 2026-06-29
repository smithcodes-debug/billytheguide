const HERO_EXITED_CLASS = 'is-hero-exited';
const HOME_SCROLL_LOCK_CLASS = 'home-scroll-locked';
const MOBILE_POPUP_SCROLL_LOCK_CLASS = 'mobile-popup-scroll-lock';
const OPEN_MORE_STORIES_EVENT = 'billy:open-more-stories';
const DEFAULT_HANDOFF_LOCK_MS = 680;

let handoffTimer = 0;

function setHeroExitedState(enabled) {
  document.documentElement.classList.toggle(HERO_EXITED_CLASS, enabled);
  document.body.classList.toggle(HERO_EXITED_CLASS, enabled);
}

function clearScrollLocks() {
  document.documentElement.classList.remove(HOME_SCROLL_LOCK_CLASS, MOBILE_POPUP_SCROLL_LOCK_CLASS);
  document.body.classList.remove(HOME_SCROLL_LOCK_CLASS, MOBILE_POPUP_SCROLL_LOCK_CLASS);
}

function getMoreStoriesSection() {
  return document.getElementById('more-stories-section');
}

function getTargetTop(targetSection) {
  return Math.max(0, Math.round(targetSection.getBoundingClientRect().top + window.scrollY));
}

function forceScrollToTarget(targetSection) {
  window.scrollTo({
    top: getTargetTop(targetSection),
    left: 0,
    behavior: 'auto'
  });
}

function focusMoreStoriesTitle() {
  const moreStoriesTitle = document.getElementById('moreStoriesTitle');

  if (!moreStoriesTitle) return;

  window.setTimeout(function () {
    moreStoriesTitle.focus({ preventScroll: true });
  }, 420);
}

export function resetHeroToMoreStoriesState() {
  window.clearTimeout(handoffTimer);
  handoffTimer = 0;
  setHeroExitedState(false);
}

export function openMoreStoriesHandoff(options) {
  const config = options || {};
  const targetSection = config.targetSection || getMoreStoriesSection();
  const beforeScroll = typeof config.beforeScroll === 'function' ? config.beforeScroll : null;
  const afterScroll = typeof config.afterScroll === 'function' ? config.afterScroll : null;
  const shouldFocusTitle = config.focusTitle === true;
  const lockMs = Number.isFinite(config.lockMs) ? config.lockMs : DEFAULT_HANDOFF_LOCK_MS;

  if (!targetSection) return;

  window.clearTimeout(handoffTimer);
  clearScrollLocks();

  if (beforeScroll) {
    beforeScroll();
  }

  setHeroExitedState(true);

  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      forceScrollToTarget(targetSection);

      window.setTimeout(function () {
        forceScrollToTarget(targetSection);
      }, 80);

      window.setTimeout(function () {
        forceScrollToTarget(targetSection);
      }, 180);

      window.setTimeout(function () {
        forceScrollToTarget(targetSection);
      }, 360);

      handoffTimer = window.setTimeout(function () {
        forceScrollToTarget(targetSection);

        if (shouldFocusTitle) {
          focusMoreStoriesTitle();
        }

        if (afterScroll) {
          afterScroll();
        }

        window.dispatchEvent(new CustomEvent(OPEN_MORE_STORIES_EVENT));
      }, lockMs);
    });
  });
}