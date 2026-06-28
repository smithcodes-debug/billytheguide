/* ✅ NEW: MODULE 14 — ADDRESS BAR AUTOHIDE FORCE EXPERIMENT
   Purpose: best-effort mobile browser toolbar collapse by forcing document-level scroll.
   Note: browsers do not expose a guaranteed API to hide the address bar.
*/

const ADDRESS_BAR_FORCE_INIT_ATTR = 'data-addressbar-autohide-initialized';
const ADDRESS_BAR_ACTIVE_CLASS = 'addressbar-force-scroll';
const BODY_LOCK_CLASSES = ['home-scroll-locked', 'mobile-home-feed-snap'];
const MOBILE_QUERY = '(hover: none) and (pointer: coarse)';

function isEditableTarget(target) {
  if (!target || !target.closest) return false;
  return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
}

function isMobileLikeViewport() {
  const ua = navigator.userAgent || '';
  const coarsePointer = window.matchMedia && window.matchMedia(MOBILE_QUERY).matches;
  const mobileUA = /Android|iPhone|iPad|iPod|Mobile|SamsungBrowser|CriOS|FxiOS/i.test(ua);
  return coarsePointer || mobileUA;
}

export function initAddressBarAutohide() {
  const root = document.documentElement;
  const body = document.body;
  if (!root || !body) return;
  if (root.getAttribute(ADDRESS_BAR_FORCE_INIT_ATTR) === 'true') return;
  if (!isMobileLikeViewport()) return;

  root.setAttribute(ADDRESS_BAR_FORCE_INIT_ATTR, 'true');

  let forceScrollModeActive = false;
  let lastTouchY = 0;
  let lastViewportHeight = 0;
  let largestViewportHeight = 0;
  let nudgeTimer = 0;

  function injectForceStyle() {
    if (document.getElementById('addressBarAutohideStyle')) return;

    const style = document.createElement('style');
    style.id = 'addressBarAutohideStyle';
    style.textContent = `
      html.${ADDRESS_BAR_ACTIVE_CLASS},
      body.${ADDRESS_BAR_ACTIVE_CLASS} {
        height: auto !important;
        min-height: calc(var(--addressbar-lvh, 1vh) * 100 + 2px) !important;
        overflow-y: auto !important;
        overscroll-behavior-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
      }

      body.${ADDRESS_BAR_ACTIVE_CLASS}::after {
        content: "";
        display: block;
        width: 1px;
        height: 2px;
        pointer-events: none;
        opacity: 0;
      }
    `;
    document.head.appendChild(style);
  }

  function updateViewportVars() {
    const visualHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const layoutHeight = window.innerHeight || visualHeight;
    const currentHeight = Math.max(visualHeight || 0, layoutHeight || 0);

    if (currentHeight > largestViewportHeight) {
      largestViewportHeight = currentHeight;
    }

    lastViewportHeight = currentHeight;
    root.style.setProperty('--addressbar-dvh', (visualHeight * 0.01) + 'px');
    root.style.setProperty('--addressbar-lvh', ((largestViewportHeight || currentHeight) * 0.01) + 'px');
  }

  function removeBlockingScrollClasses() {
    BODY_LOCK_CLASSES.forEach(function (className) {
      root.classList.remove(className);
      body.classList.remove(className);
    });
  }

  function activateForceScrollMode() {
    forceScrollModeActive = true;
    injectForceStyle();
    updateViewportVars();
    root.classList.add(ADDRESS_BAR_ACTIVE_CLASS);
    body.classList.add(ADDRESS_BAR_ACTIVE_CLASS);
    removeBlockingScrollClasses();
  }

  function hasRealDocumentScroll() {
    const scrollingElement = document.scrollingElement || root;
    return scrollingElement.scrollHeight > window.innerHeight + 2;
  }

  function nudgeDocumentScroll() {
    if (document.hidden) return;
    if (!hasRealDocumentScroll()) return;

    activateForceScrollMode();

    if (window.scrollY <= 0) {
      window.scrollTo({ top: 1, left: 0, behavior: 'auto' });
    }
  }

  function scheduleNudge(delay) {
    window.clearTimeout(nudgeTimer);
    nudgeTimer = window.setTimeout(nudgeDocumentScroll, delay || 60);
  }

  function handleTouchStart(event) {
    if (isEditableTarget(event.target)) return;
    if (event.touches && event.touches.length) {
      lastTouchY = event.touches[0].clientY;
    }
  }

  function handleTouchMove(event) {
    if (isEditableTarget(event.target)) return;
    if (!event.touches || !event.touches.length) return;

    const currentY = event.touches[0].clientY;
    const isUserTryingToScrollDownPage = currentY < lastTouchY;
    lastTouchY = currentY;

    if (isUserTryingToScrollDownPage) {
      activateForceScrollMode();
      scheduleNudge(0);
    }
  }

  function handlePointerDown(event) {
    if (isEditableTarget(event.target)) return;
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      scheduleNudge(40);
    }
  }

  function handleWheel() {
    activateForceScrollMode();
    scheduleNudge(0);
  }

  function handleViewportResize() {
    updateViewportVars();

    if (forceScrollModeActive && lastViewportHeight) {
      scheduleNudge(80);
    }
  }

  function keepForceClassesClean() {
    if (!forceScrollModeActive) return;
    removeBlockingScrollClasses();
    root.classList.add(ADDRESS_BAR_ACTIVE_CLASS);
    body.classList.add(ADDRESS_BAR_ACTIVE_CLASS);
  }

  updateViewportVars();

  window.addEventListener('load', function () {
    scheduleNudge(120);
    window.setTimeout(nudgeDocumentScroll, 420);
    window.setTimeout(nudgeDocumentScroll, 900);
  }, { once: true });

  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: true });
  document.addEventListener('pointerdown', handlePointerDown, { passive: true });
  window.addEventListener('wheel', handleWheel, { passive: true });
  window.addEventListener('resize', handleViewportResize, { passive: true });
  window.addEventListener('orientationchange', function () {
    window.setTimeout(handleViewportResize, 220);
    window.setTimeout(nudgeDocumentScroll, 620);
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleViewportResize, { passive: true });
    window.visualViewport.addEventListener('scroll', handleViewportResize, { passive: true });
  }

  const classObserver = new MutationObserver(keepForceClassesClean);
  classObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
  classObserver.observe(body, { attributes: true, attributeFilter: ['class'] });

  scheduleNudge(250);
}

initAddressBarAutohide();
