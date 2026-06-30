export function initNavigation() {
  const HOME_HASH = '#home';
  const HOME_PAGE = 'index.html';
  const LOGO_SELECTOR = '#logoTrigger, .logo';
  const HERO_SELECTOR = '.hero';

  function isHomePage() {
    const path = window.location.pathname;

    return (
      path === '/' ||
      path.endsWith('/') ||
      path.endsWith('/index.html') ||
      path.endsWith('index.html')
    );
  }

  function clearHomeConflictState() {
    /* ✅ UPDATED */
    document.documentElement.classList.remove(
      'is-hero-exited',
      'is-feed-ending',
      'mobile-home-feed-snap',
      'is-home-reading-mode',
      'mobile-popup-scroll-lock',
      'home-scroll-locked'
    );

    document.body.classList.remove(
      'is-hero-exited',
      'is-feed-ending',
      'mobile-home-feed-snap',
      'is-home-reading-mode',
      'mobile-popup-scroll-lock',
      'home-scroll-locked'
    );

    document.querySelectorAll('.is-open').forEach(function (node) {
      node.classList.remove('is-open');

      if (node.hasAttribute('aria-hidden')) {
        node.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function scrollToHero(behavior) {
    const hero = document.querySelector(HERO_SELECTOR);

    clearHomeConflictState();

    if (hero) {
      hero.scrollIntoView({
        behavior: behavior || 'smooth',
        block: 'start'
      });

      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: behavior || 'smooth'
    });
  }

  function goToHomeHero() {
    if (isHomePage()) {
      scrollToHero('smooth');
      return;
    }

    window.location.href = HOME_PAGE + HOME_HASH;
  }

  document.querySelectorAll('[data-nav]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const url = btn.getAttribute('data-nav');

      if (url) window.location.href = url;
    });
  });

  document.querySelectorAll(LOGO_SELECTOR).forEach(function (logo) {
    logo.addEventListener('click', function (event) {
      event.preventDefault();
      goToHomeHero();
    });

    logo.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        goToHomeHero();
      }
    });
  });

  if (isHomePage() && window.location.hash === HOME_HASH) {
    window.setTimeout(function () {
      scrollToHero('auto');

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }, 0);
  }
}