const MOBILE_EDGE_QUERY = '(max-width: 768px)'; /* ✅ NEW */
const HOME_SCROLL_LOCK_CLASS = 'home-scroll-locked'; /* ✅ NEW */
const SWIPE_UP_THRESHOLD = 34; /* ✅ NEW */

function unlockHomeScroll() { /* ✅ NEW */
  document.documentElement.classList.remove(HOME_SCROLL_LOCK_CLASS); /* ✅ NEW */
  document.body.classList.remove(HOME_SCROLL_LOCK_CLASS); /* ✅ NEW */
}

export function initMobileEdgePad() { /* ✅ NEW */
  const edgePad = document.querySelector('.mobile-edge-pad'); /* ✅ NEW */
  const hero = document.querySelector('.hero'); /* ✅ NEW */
  const targetSection = document.getElementById('more-stories-section'); /* ✅ NEW */
  const searchPopup = document.getElementById('mobile-search-popup'); /* ✅ NEW */
  const mobileMedia = window.matchMedia(MOBILE_EDGE_QUERY); /* ✅ NEW */
  let touchStartY = 0; /* ✅ NEW */
  let heroIsVisible = true; /* ✅ NEW */

  if (!edgePad || !hero || !targetSection) return; /* ✅ REQUIRED FIX */

  function isMobile() { /* ✅ NEW */
    return mobileMedia.matches; /* ✅ NEW */
  }

  function isSearchOpen() { /* ✅ NEW */
    return Boolean(searchPopup && searchPopup.classList.contains('is-open')); /* ✅ NEW */
  }

  function updateEdgePadVisibility() { /* ✅ NEW */
    const shouldHide = !isMobile() || !heroIsVisible || isSearchOpen(); /* ✅ NEW */
    edgePad.classList.toggle('is-hidden', shouldHide); /* ✅ NEW */
  }

  function goToMoreStories() { /* ✅ NEW */
    if (!isMobile()) return; /* ✅ NEW */
    unlockHomeScroll(); /* ✅ NEW */
    edgePad.classList.add('is-hidden'); /* ✅ NEW */
    targetSection.scrollIntoView({ behavior: 'auto', block: 'start' }); /* ✅ UPDATED: nhảy ngay tới section */
  }

  edgePad.addEventListener('click', goToMoreStories); /* ✅ NEW */

  edgePad.addEventListener('touchstart', function (event) { /* ✅ NEW */
    if (!event.touches || !event.touches.length) return; /* ✅ REQUIRED FIX */
    touchStartY = event.touches[0].clientY; /* ✅ NEW */
  }, { passive: true });

  edgePad.addEventListener('touchmove', function (event) { /* ✅ NEW */
    if (!event.touches || !event.touches.length) return; /* ✅ REQUIRED FIX */
    const touchCurrentY = event.touches[0].clientY; /* ✅ NEW */
    if (touchStartY - touchCurrentY >= SWIPE_UP_THRESHOLD) { /* ✅ NEW */
      goToMoreStories(); /* ✅ NEW */
    }
  }, { passive: true });

  if ('IntersectionObserver' in window) { /* ✅ NEW */
    const observer = new IntersectionObserver(function (entries) { /* ✅ NEW */
      const heroEntry = entries[0]; /* ✅ NEW */
      heroIsVisible = Boolean(heroEntry && heroEntry.isIntersecting && heroEntry.intersectionRatio > 0.22); /* ✅ NEW */
      updateEdgePadVisibility(); /* ✅ NEW */
    }, { threshold: [0, 0.22, 0.5] }); /* ✅ NEW */
    observer.observe(hero); /* ✅ NEW */
  }

  if (searchPopup && 'MutationObserver' in window) { /* ✅ NEW */
    const searchObserver = new MutationObserver(updateEdgePadVisibility); /* ✅ NEW */
    searchObserver.observe(searchPopup, { attributes: true, attributeFilter: ['class'] }); /* ✅ NEW */
  }

  mobileMedia.addEventListener('change', updateEdgePadVisibility); /* ✅ NEW */
  window.addEventListener('scroll', updateEdgePadVisibility, { passive: true }); /* ✅ NEW */
  updateEdgePadVisibility(); /* ✅ NEW */
}
