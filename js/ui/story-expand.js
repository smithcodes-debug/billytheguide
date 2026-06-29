export function initStoryExpand() {
  const tourPopup = document.getElementById('leave-no-trace-popup');
  const backToToursBtn = document.querySelector('[data-story-back-to-tours]');

  if (!tourPopup) return;
  if (tourPopup.dataset.storyExpandInitialized === 'true') return;

  tourPopup.dataset.storyExpandInitialized = 'true';

  function closeTourPopup() {
    const ctaTriggers = document.querySelectorAll('.cta-trigger');

    tourPopup.classList.remove('is-open');
    tourPopup.setAttribute('aria-hidden', 'true');

    document.documentElement.classList.remove('mobile-popup-scroll-lock');
    document.body.classList.remove('mobile-popup-scroll-lock');

    ctaTriggers.forEach(function (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    });
  }

  if (backToToursBtn) {
    backToToursBtn.addEventListener('click', function () {
      const hero = document.querySelector('.hero');

      closeTourPopup();

      if (!hero) return;

      hero.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }
}