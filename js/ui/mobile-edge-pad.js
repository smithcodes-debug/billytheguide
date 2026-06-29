const MOBILE_EDGE_QUERY = '(max-width: 768px)';
const HOME_SCROLL_LOCK_CLASS = 'home-scroll-locked';
const HERO_EXITED_CLASS = 'is-hero-exited';
const SWIPE_UP_THRESHOLD = 34;
const JUMP_LOCK_MS = 620;

function unlockHomeScroll() {
  document.documentElement.classList.remove(HOME_SCROLL_LOCK_CLASS);
  document.body.classList.remove(HOME_SCROLL_LOCK_CLASS);
}

function setHeroExitedState(enabled) {
  document.documentElement.classList.toggle(HERO_EXITED_CLASS, enabled);
  document.body.classList.toggle(HERO_EXITED_CLASS, enabled);
}

export function initMobileEdgePad() {
  const edgePad = document.querySelector('.mobile-edge-pad');
  const hero = document.querySelector('.hero');
  const targetSection = document.getElementById('more-stories-section');
  const searchPopup = document.getElementById('mobile-search-popup');
  const mobileMedia = window.matchMedia(MOBILE_EDGE_QUERY);

  let touchStartY = 0;
  let touchStartX = 0;
  let hasSwipeUpIntent = false;
  let heroIsVisible = true;
  let isJumping = false;

  if (!edgePad || !hero || !targetSection) return;

  function isMobile() {
    return mobileMedia.matches;
  }

  function isSearchOpen() {
    return Boolean(searchPopup && searchPopup.classList.contains('is-open'));
  }

  function getTargetTop() {
    return Math.max(0, Math.round(targetSection.getBoundingClientRect().top + window.scrollY));
  }

  function forceScrollToMoreStories() {
    window.scrollTo({
      top: getTargetTop(),
      left: 0,
      behavior: 'auto'
    });
  }

  function updateHeroExitedByPosition() {
    if (isJumping) return;

    const heroRect = hero.getBoundingClientRect();
    const targetRect = targetSection.getBoundingClientRect();

    const shouldExitHero = targetRect.top <= 2 || heroRect.bottom <= 2;

    setHeroExitedState(shouldExitHero);
  }

  function updateEdgePadVisibility() {
    const shouldHide = !isMobile() || !heroIsVisible || isSearchOpen();

    edgePad.classList.toggle('is-hidden', shouldHide);
  }

  function goToMoreStories() {
    if (!isMobile() || isJumping) return;

    isJumping = true;
    unlockHomeScroll();
    setHeroExitedState(true);
    edgePad.classList.add('is-hidden');

    window.requestAnimationFrame(function () {
      forceScrollToMoreStories();

      window.setTimeout(forceScrollToMoreStories, 80);
      window.setTimeout(forceScrollToMoreStories, 180);
      window.setTimeout(function () {
        forceScrollToMoreStories();
        isJumping = false;
        updateHeroExitedByPosition();
        updateEdgePadVisibility();
      }, JUMP_LOCK_MS);
    });
  }

  edgePad.addEventListener('click', function () {
    goToMoreStories();
  });

  edgePad.addEventListener('touchstart', function (event) {
    if (!event.touches || event.touches.length !== 1) return;

    const touch = event.touches[0];

    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    hasSwipeUpIntent = false;
  }, { passive: true });

  edgePad.addEventListener('touchmove', function (event) {
    if (!event.touches || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    hasSwipeUpIntent = deltaY <= -SWIPE_UP_THRESHOLD && absDeltaY > absDeltaX;
  }, { passive: true });

  edgePad.addEventListener('touchend', function () {
    if (!hasSwipeUpIntent) return;

    hasSwipeUpIntent = false;
    goToMoreStories();
  }, { passive: true });

  edgePad.addEventListener('touchcancel', function () {
    hasSwipeUpIntent = false;
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      const heroEntry = entries[0];

      heroIsVisible = Boolean(heroEntry && heroEntry.isIntersecting && heroEntry.intersectionRatio > 0.22);
      updateEdgePadVisibility();
    }, { threshold: [0, 0.22, 0.5] });

    observer.observe(hero);
  }

  if (searchPopup && 'MutationObserver' in window) {
    const searchObserver = new MutationObserver(updateEdgePadVisibility);

    searchObserver.observe(searchPopup, { attributes: true, attributeFilter: ['class'] });
  }

  mobileMedia.addEventListener('change', updateEdgePadVisibility);

  window.addEventListener('scroll', function () {
    updateHeroExitedByPosition();
    updateEdgePadVisibility();
  }, { passive: true });

  updateHeroExitedByPosition();
  updateEdgePadVisibility();
}