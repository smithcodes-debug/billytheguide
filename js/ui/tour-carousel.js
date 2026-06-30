export function initTourCarousel() {
  const scroller = document.querySelector('.popup-notes');
  const shell = document.querySelector('.popup-notes-shell');
  const leftArrow = shell ? shell.querySelector('.popup-notes-arrow-left') : null;
  const rightArrow = shell ? shell.querySelector('.popup-notes-arrow-right') : null;

  if (!scroller || !shell) return;
  if (scroller.dataset.tourCarouselInitialized === 'true') return;

  scroller.dataset.tourCarouselInitialized = 'true';

  const TOUR_PAGE_MAP = {
    snorkeling: './coral-snorkeling-phu-quoc.html',
    diving: './diving-island-phu-quoc.html',
    hiking: './hiking-mountain-phu-quoc.html',
    camping: './camping-island-phu-quoc.html',
    propose: './propose-island-phu-quoc.html',
    phuQuocTipAndTrick: './phu-quoc-tip-and-trick.html',
    coralDictionary: './coral-dictionary-at-phu-quoc.html'
  };

  const SCROLL_STEP_RATIO = 0.82;
  let scrollFrame = 0;

  function getCards() {
    return Array.from(scroller.querySelectorAll('.popup-note-item'));
  }

  function getScrollStep() {
    const firstCard = scroller.querySelector('.popup-note-item');

    if (!firstCard) return Math.max(240, scroller.clientWidth * SCROLL_STEP_RATIO);

    const styles = window.getComputedStyle(scroller);
    const columnGap = parseFloat(styles.columnGap || styles.gap || '0') || 0;

    return firstCard.getBoundingClientRect().width + columnGap;
  }

  function updateCenterCard() {
    const cards = getCards();

    if (!cards.length) return;

    const viewportCenter = scroller.scrollLeft + (scroller.clientWidth / 2);
    let nearestCard = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach(function (card) {
      const cardCenter = card.offsetLeft + (card.clientWidth / 2);
      const distance = Math.abs(cardCenter - viewportCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestCard = card;
      }
    });

    cards.forEach(function (card) {
      card.classList.toggle('is-center', card === nearestCard);
    });
  }

  function scheduleCenterUpdate() {
    if (scrollFrame) return;

    scrollFrame = window.requestAnimationFrame(function () {
      scrollFrame = 0;
      updateCenterCard();
    });
  }

  function scrollByDirection(direction) {
    const step = getScrollStep();
    const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    let nextLeft = scroller.scrollLeft + (direction === 'next' ? step : -step);

    if (nextLeft < 0) nextLeft = maxScrollLeft;
    if (nextLeft > maxScrollLeft) nextLeft = 0;

    scroller.scrollTo({
      left: nextLeft,
      behavior: 'smooth'
    });
  }

  function goToTourPage(tourName) {
    const tourUrl = TOUR_PAGE_MAP[tourName];

    if (!tourUrl) return;

    window.location.href = tourUrl;
  }

  function handleCardActivation(event) {
    const card = event.target.closest('.popup-note-item[data-tour]');

    if (!card || !scroller.contains(card)) return;

    const tourName = card.dataset.tour;

    if (!TOUR_PAGE_MAP[tourName]) return;

    event.preventDefault();
    goToTourPage(tourName);
  }

  getCards().forEach(function (card) {
    if (!card.dataset.tour) return;

    card.setAttribute('role', card.getAttribute('role') || 'button');
    card.setAttribute('tabindex', card.getAttribute('tabindex') || '0');
    card.style.cursor = 'pointer';
  });

  scroller.addEventListener('scroll', scheduleCenterUpdate, { passive: true });

  scroller.addEventListener('click', handleCardActivation);

  scroller.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    const card = event.target.closest('.popup-note-item[data-tour]');

    if (!card || !scroller.contains(card)) return;

    handleCardActivation(event);
  });

  if (leftArrow) {
    leftArrow.disabled = false;

    leftArrow.addEventListener('click', function () {
      scrollByDirection('previous');
    });
  }

  if (rightArrow) {
    rightArrow.disabled = false;

    rightArrow.addEventListener('click', function () {
      scrollByDirection('next');
    });
  }

  window.addEventListener('resize', scheduleCenterUpdate);

  window.requestAnimationFrame(updateCenterCard);
}