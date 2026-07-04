const REAL_ZIPPER_ROOT_SELECTOR = '.more-stories-section';
const REAL_ZIPPER_SOURCE_SELECTOR = '.more-stories-zipper-content';
const REAL_ZIPPER_PAGE_SELECTOR = '[data-card-02-zipper-page]';
const REAL_ZIPPER_CARD_SELECTOR = '.mobile-home-feed-card-02';
const REAL_ZIPPER_SCROLL_SELECTOR = '.mobile-home-feed-card-scroll-02';
const REAL_ZIPPER_READY_ATTR = 'data-real-zipper-ready';
const REAL_ZIPPER_PROGRESS_VAR = '--real-zipper-progress';
const ZIPPER_RESET_DELAY = 90;
const ZIPPER_RETURN_DURATION = 360;
const PANEL_SWIPE_UP_THRESHOLD = 42;

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (typeof textContent === 'string') element.textContent = textContent;
  return element;
}

function createSvgElement(tagName, attributes) {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  Object.keys(attributes || {}).forEach(function (key) {
    element.setAttribute(key, attributes[key]);
  });
  return element;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getZipperPages(sourceRoot) {
  const source = sourceRoot ? sourceRoot.querySelector(REAL_ZIPPER_SOURCE_SELECTOR) : null;
  const pages = source ? Array.from(source.querySelectorAll(REAL_ZIPPER_PAGE_SELECTOR)) : [];
  return pages.map(function (page) {
    const titleNode = page.querySelector('.more-stories-zipper-title');
    const copyNode = page.querySelector('.more-stories-zipper-copy');
    return {
      title: titleNode ? titleNode.textContent.trim() : '',
      copy: copyNode ? copyNode.textContent.trim() : ''
    };
  }).filter(function (item) {
    return item.title && item.copy;
  });
}

function createTrackSvg() {
  const svg = createSvgElement('svg', {
    class: 'real-zipper-svg',
    viewBox: '0 0 600 92',
    preserveAspectRatio: 'none',
    'aria-hidden': 'true',
    focusable: 'false'
  });
  const defs = createSvgElement('defs');
  const fabricGradient = createSvgElement('linearGradient', { id: 'realZipperFabricGradient', x1: '0', y1: '0', x2: '0', y2: '1' });
  [['0%', '#f6fbfc'], ['42%', '#c8d7dc'], ['70%', '#aabdc4'], ['100%', '#edf4f6']].forEach(function (stop) {
    fabricGradient.appendChild(createSvgElement('stop', { offset: stop[0], 'stop-color': stop[1] }));
  });
  const toothGradient = createSvgElement('linearGradient', { id: 'realZipperToothGradient', x1: '0', y1: '0', x2: '0', y2: '1' });
  [['0%', '#ffffff'], ['45%', '#dce8eb'], ['100%', '#879da5']].forEach(function (stop) {
    toothGradient.appendChild(createSvgElement('stop', { offset: stop[0], 'stop-color': stop[1] }));
  });
  const shadow = createSvgElement('filter', { id: 'realZipperSoftShadow', x: '-10%', y: '-40%', width: '120%', height: '180%' });
  shadow.appendChild(createSvgElement('feDropShadow', { dx: '0', dy: '2', stdDeviation: '2', 'flood-color': '#1f3440', 'flood-opacity': '0.18' }));
  defs.appendChild(fabricGradient);
  defs.appendChild(toothGradient);
  defs.appendChild(shadow);
  svg.appendChild(defs);
  svg.appendChild(createSvgElement('rect', { class: 'real-zipper-svg-fabric real-zipper-svg-fabric-top', x: '10', y: '12', width: '580', height: '24', rx: '12', fill: 'url(#realZipperFabricGradient)' }));
  svg.appendChild(createSvgElement('rect', { class: 'real-zipper-svg-fabric real-zipper-svg-fabric-bottom', x: '10', y: '56', width: '580', height: '24', rx: '12', fill: 'url(#realZipperFabricGradient)' }));
  svg.appendChild(createSvgElement('path', { class: 'real-zipper-svg-seam', d: 'M22 43 H578', fill: 'none', stroke: '#7f969e', 'stroke-width': '2', 'stroke-dasharray': '3 7', opacity: '0.55' }));
  svg.appendChild(createSvgElement('path', { class: 'real-zipper-svg-seam', d: 'M22 49 H578', fill: 'none', stroke: '#f7fbfc', 'stroke-width': '2', 'stroke-dasharray': '3 7', opacity: '0.60' }));
  svg.appendChild(createSvgElement('path', { class: 'real-zipper-svg-center-line', d: 'M24 46 H576', fill: 'none', stroke: '#5b7078', 'stroke-width': '1.25', opacity: '0.42' }));
  const teethGroup = createSvgElement('g', { class: 'real-zipper-svg-teeth', filter: 'url(#realZipperSoftShadow)' });
  for (let x = 24; x <= 568; x += 12) {
    teethGroup.appendChild(createSvgElement('path', {
      d: 'M' + x + ' 38 L' + (x + 8) + ' 38 L' + (x + 10) + ' 46 L' + (x + 8) + ' 54 L' + x + ' 54 L' + (x + 3) + ' 46 Z',
      fill: 'url(#realZipperToothGradient)',
      stroke: '#6f858d',
      'stroke-width': '0.55'
    }));
  }
  svg.appendChild(teethGroup);
  return svg;
}

function createPullerSvg() {
  const svg = createSvgElement('svg', { class: 'real-zipper-puller-svg', viewBox: '0 0 74 104', 'aria-hidden': 'true', focusable: 'false' });
  const defs = createSvgElement('defs');
  const metalGradient = createSvgElement('linearGradient', { id: 'realZipperPullerMetal', x1: '0', y1: '0', x2: '1', y2: '1' });
  [['0%', '#ffffff'], ['32%', '#d9e5e8'], ['62%', '#a4b8bf'], ['100%', '#f3f8f9']].forEach(function (stop) {
    metalGradient.appendChild(createSvgElement('stop', { offset: stop[0], 'stop-color': stop[1] }));
  });
  defs.appendChild(metalGradient);
  svg.appendChild(defs);
  svg.appendChild(createSvgElement('path', { class: 'real-zipper-puller-tab', d: 'M27 5 H47 C51 5 54 8 54 12 V47 C54 52 50 56 45 56 H29 C24 56 20 52 20 47 V12 C20 8 23 5 27 5 Z', fill: 'url(#realZipperPullerMetal)', stroke: '#657b83', 'stroke-width': '2' }));
  svg.appendChild(createSvgElement('path', { class: 'real-zipper-puller-body', d: 'M19 42 H55 C61 42 65 47 64 53 L60 76 C59 82 54 86 48 86 H26 C20 86 15 82 14 76 L10 53 C9 47 13 42 19 42 Z', fill: 'url(#realZipperPullerMetal)', stroke: '#657b83', 'stroke-width': '2' }));
  svg.appendChild(createSvgElement('ellipse', { class: 'real-zipper-puller-ring', cx: '37', cy: '77', rx: '20', ry: '14', fill: 'none', stroke: '#dce8eb', 'stroke-width': '8' }));
  svg.appendChild(createSvgElement('ellipse', { class: 'real-zipper-puller-ring-shadow', cx: '37', cy: '77', rx: '20', ry: '14', fill: 'none', stroke: '#7f969e', 'stroke-width': '2', opacity: '0.52' }));
  return svg;
}

function createRealZipperModule(steps) {
  const module = createElement('section', 'real-zipper-module');
  const pages = createElement('div', 'real-zipper-pages');
  const control = createElement('div', 'real-zipper-control');
  const label = createElement('div', 'real-zipper-label', 'Pull the zipper from right to left');
  const track = createElement('div', 'real-zipper-track');
  const progressFill = createElement('div', 'real-zipper-progress-fill');
  const handle = createElement('button', 'real-zipper-handle');
  module.setAttribute('data-real-zipper-step', '0');
  module.style.setProperty(REAL_ZIPPER_PROGRESS_VAR, '0');
  pages.setAttribute('aria-live', 'polite');
  steps.forEach(function (item, index) {
    const page = createElement('article', 'real-zipper-page');
    page.setAttribute('data-real-zipper-page', String(index + 1));
    page.setAttribute('aria-hidden', 'true');
    page.appendChild(createElement('span', 'real-zipper-page-number', String(index + 1).padStart(2, '0')));
    page.appendChild(createElement('h3', 'real-zipper-page-title', item.title));
    page.appendChild(createElement('p', 'real-zipper-page-copy', item.copy));
    pages.appendChild(page);
  });
  control.setAttribute('role', 'slider');
  control.setAttribute('tabindex', '0');
  control.setAttribute('aria-label', 'Card 2 real zipper story progress');
  control.setAttribute('aria-valuemin', '0');
  control.setAttribute('aria-valuemax', String(steps.length));
  control.setAttribute('aria-valuenow', '0');
  control.setAttribute('aria-valuetext', 'Zipper closed');
  handle.type = 'button';
  handle.setAttribute('aria-label', 'Drag real zipper');
  handle.setAttribute('tabindex', '-1');
  handle.appendChild(createPullerSvg());
  track.appendChild(createTrackSvg());
  track.appendChild(progressFill);
  track.appendChild(handle);
  control.appendChild(label);
  control.appendChild(track);
  module.appendChild(pages);
  module.appendChild(control);
  return module;
}

function getMaxDrag(track, handle) {
  const trackRect = track.getBoundingClientRect();
  const handleRect = handle.getBoundingClientRect();
  return Math.max(1, trackRect.width - handleRect.width);
}

function initRealZipperInstance(module) {
  if (!module || module.getAttribute(REAL_ZIPPER_READY_ATTR) === 'true') return;
  const control = module.querySelector('.real-zipper-control');
  const track = module.querySelector('.real-zipper-track');
  const handle = module.querySelector('.real-zipper-handle');
  const pages = Array.from(module.querySelectorAll('.real-zipper-page'));
  if (!control || !track || !handle || !pages.length) return;
  module.setAttribute(REAL_ZIPPER_READY_ATTR, 'true');
  let currentStep = 0;
  let isDragging = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let hasTriggeredPanelSwipe = false;
  let turnTimer = 0;
  let resetTimer = 0;

  function syncStep(nextStep) {
    const totalSteps = pages.length;
    const safeStep = clamp(nextStep, 0, totalSteps);
    const progress = totalSteps > 0 ? safeStep / totalSteps : 0;
    const stepChanged = safeStep !== currentStep;
    currentStep = safeStep;
    module.style.setProperty(REAL_ZIPPER_PROGRESS_VAR, String(progress));
    module.setAttribute('data-real-zipper-step', String(safeStep));
    module.classList.toggle('is-real-zipper-open', safeStep > 0);
    control.setAttribute('aria-valuenow', String(safeStep));
    control.setAttribute('aria-valuetext', safeStep > 0 ? 'Story page ' + safeStep + ' of ' + totalSteps : 'Zipper closed');
    pages.forEach(function (page, index) {
      const isActive = index === safeStep - 1;
      page.classList.toggle('is-active', isActive);
      page.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      if (isActive && stepChanged) {
        page.classList.remove('is-page-turning');
        page.offsetWidth;
        page.classList.add('is-page-turning');
      }
    });
    if (turnTimer) window.clearTimeout(turnTimer);
    turnTimer = window.setTimeout(function () {
      pages.forEach(function (page) {
        page.classList.remove('is-page-turning');
      });
    }, 520);
  }

  function resetZipper() {
    module.classList.add('is-returning');
    syncStep(0);
    if (resetTimer) window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(function () {
      module.classList.remove('is-returning');
    }, ZIPPER_RETURN_DURATION);
  }

  function stepFromClientX(clientX) {
    const trackRect = track.getBoundingClientRect();
    const handleRect = handle.getBoundingClientRect();
    const maxDrag = getMaxDrag(track, handle);
    const dragDistance = clamp(trackRect.right - clientX - (handleRect.width / 2), 0, maxDrag);
    return Math.round((dragDistance / maxDrag) * pages.length);
  }

  function updateFromPointer(event) {
    syncStep(stepFromClientX(event.clientX));
  }

  function swipeToNextPanel() {
    const currentPanel = module.closest('.mobile-home-feed-panel');
    const nextPanel = currentPanel ? currentPanel.nextElementSibling : null;
    const feed = currentPanel ? currentPanel.closest('.mobile-home-feed') : null;
    hasTriggeredPanelSwipe = true;
    resetZipper();
    if (feed && nextPanel && nextPanel.classList && nextPanel.classList.contains('mobile-home-feed-panel')) {
      feed.scrollTo({ top: nextPanel.offsetTop, left: 0, behavior: 'smooth' });
    }
  }

  control.addEventListener('pointerdown', function (event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    isDragging = true;
    hasTriggeredPanelSwipe = false;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    control.classList.add('is-dragging');
    if (control.setPointerCapture) control.setPointerCapture(event.pointerId);
    updateFromPointer(event);
    event.preventDefault();
  });

  control.addEventListener('pointermove', function (event) {
    if (!isDragging) return;
    const deltaX = event.clientX - pointerStartX;
    const deltaY = event.clientY - pointerStartY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    if (!hasTriggeredPanelSwipe && deltaY <= -PANEL_SWIPE_UP_THRESHOLD && absY > absX) {
      swipeToNextPanel();
      event.preventDefault();
      return;
    }
    if (!hasTriggeredPanelSwipe) updateFromPointer(event);
    event.preventDefault();
  });

  function endDrag(event) {
    if (!isDragging) return;
    isDragging = false;
    control.classList.remove('is-dragging');
    if (control.hasPointerCapture && control.hasPointerCapture(event.pointerId)) control.releasePointerCapture(event.pointerId);
    window.setTimeout(resetZipper, ZIPPER_RESET_DELAY);
  }

  control.addEventListener('pointerup', endDrag);
  control.addEventListener('pointercancel', endDrag);
  control.addEventListener('lostpointercapture', function () {
    if (!isDragging) return;
    isDragging = false;
    control.classList.remove('is-dragging');
    resetZipper();
  });
  control.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      syncStep(currentStep + 1);
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      syncStep(currentStep - 1);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      resetZipper();
    } else if (event.key === 'Home') {
      event.preventDefault();
      syncStep(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      syncStep(pages.length);
    }
  });
  syncStep(0);
}

function mountRealZipper() {
  const homeSection = document.querySelector(REAL_ZIPPER_ROOT_SELECTOR);
  const sourceInner = homeSection ? homeSection.querySelector('.more-stories-inner') : null;
  const card = homeSection ? homeSection.querySelector(REAL_ZIPPER_CARD_SELECTOR) : null;
  const scroll = card ? card.querySelector(REAL_ZIPPER_SCROLL_SELECTOR) : null;
  const target = scroll ? (scroll.firstElementChild || scroll) : null;
  if (!homeSection || !sourceInner || !card || !target) return false;
  if (card.querySelector('.real-zipper-module')) return true;
  const steps = getZipperPages(sourceInner);
  if (!steps.length) return false;
  const module = createRealZipperModule(steps);
  target.appendChild(module);
  initRealZipperInstance(module);
  return true;
}

export function initRealZipper() {
  if (mountRealZipper()) return;
  const homeSection = document.querySelector(REAL_ZIPPER_ROOT_SELECTOR);
  const observerTarget = homeSection || document.body;
  if (!observerTarget || typeof MutationObserver === 'undefined') return;
  const observer = new MutationObserver(function () {
    if (mountRealZipper()) observer.disconnect();
  });
  observer.observe(observerTarget, { childList: true, subtree: true });
}
