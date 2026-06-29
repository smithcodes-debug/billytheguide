import { openMoreStoriesHandoff, resetHeroToMoreStoriesState } from '../modules/home-to-more-stories.js';

export function initStoryExpand() {
  const tourPopup = document.getElementById('leave-no-trace-popup');
  const moreStoriesSection = document.getElementById('more-stories-section');
  const backToToursBtn = document.querySelector('[data-story-back-to-tours]');

  if (!tourPopup || !moreStoriesSection) return;
  if (tourPopup.dataset.storyExpandInitialized === 'true') return;

  tourPopup.dataset.storyExpandInitialized = 'true';

  const BOTTOM_ZONE_HEIGHT = 160;
  const MIN_VERTICAL_SWIPE = 60;
  const VERTICAL_DOMINANCE_RATIO = 1.2;

  let startX = 0;
  let startY = 0;
  let isBottomGesture = false;

  function isTourPopupOpen() {
    return tourPopup.classList.contains('is-open');
  }

  function syncTourPopupClosedState() {
    const ctaTriggers = document.querySelectorAll('.cta-trigger');

    tourPopup.classList.remove('is-open');
    tourPopup.setAttribute('aria-hidden', 'true');

    document.documentElement.classList.remove('mobile-popup-scroll-lock');
    document.body.classList.remove('mobile-popup-scroll-lock');

    ctaTriggers.forEach(function (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function openMoreStoriesFromTourPopup() {
    if (!isTourPopupOpen()) return;

    openMoreStoriesHandoff({
      targetSection: moreStoriesSection,
      focusTitle: true,
      lockMs: 680,
      beforeScroll: syncTourPopupClosedState
    });
  }

  tourPopup.addEventListener('touchstart', function (event) {
    if (!isTourPopupOpen()) return;
    if (!event.touches || event.touches.length !== 1) return;

    const touch = event.touches[0];

    startX = touch.clientX;
    startY = touch.clientY;
    isBottomGesture = startY >= window.innerHeight - BOTTOM_ZONE_HEIGHT;
  }, { passive: true });

  tourPopup.addEventListener('touchend', function (event) {
    if (!isTourPopupOpen()) return;
    if (!isBottomGesture) return;
    if (!event.changedTouches || event.changedTouches.length !== 1) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const isVerticalSwipeUp = deltaY < -MIN_VERTICAL_SWIPE && absDeltaY > absDeltaX * VERTICAL_DOMINANCE_RATIO;

    if (!isVerticalSwipeUp) return;

    openMoreStoriesFromTourPopup();
  }, { passive: true });

  if (backToToursBtn) {
    backToToursBtn.addEventListener('click', function () {
      const hero = document.querySelector('.hero');

      if (!hero) return;

      resetHeroToMoreStoriesState();

      hero.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  window.addEventListener('billy:open-more-stories-from-tour-popup', openMoreStoriesFromTourPopup);

  console.log('Story expand initialized');
}