import { getGalleryWithUsReviewData } from '../modules/gallery-with-us.js';

const CARD_SELECTOR = '.mobile-home-feed-card-02';
const SCROLL_SELECTOR = '.mobile-home-feed-card-scroll-02';
const READY_ATTR = 'data-card-02-reviews-ready';
const MAX_INLINE_REVIEWS = 4;

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (typeof textContent === 'string') {
    element.textContent = textContent;
  }

  return element;
}

function createStars(rating) {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  return '★'.repeat(safeRating) + '☆'.repeat(5 - safeRating);
}

function createGoogleMark() {
  const mark = createElement('span', 'card-02-reviews-google-mark');
  const letters = [
    ['G', 'g-blue'],
    ['o', 'g-red'],
    ['o', 'g-yellow'],
    ['g', 'g-blue'],
    ['l', 'g-green'],
    ['e', 'g-red']
  ];

  letters.forEach(function (item) {
    const letter = createElement('span', item[1], item[0]);
    mark.appendChild(letter);
  });

  return mark;
}

function createReviewCard(item, index) {
  const card = createElement('article', 'card-02-reviews-card');
  const head = createElement('div', 'card-02-reviews-card-head');
  const identity = createElement('div', 'card-02-reviews-identity');
  const name = createElement('h3', 'card-02-reviews-name', item.guestName || 'Guest');
  const meta = createElement('p', 'card-02-reviews-meta', (item.dateLabel || '') + ' · ' + (item.tour || 'private tour'));
  const source = createElement('span', 'card-02-reviews-source', 'G');
  const stars = createElement('div', 'card-02-reviews-stars', createStars(item.rating));
  const quote = createElement('p', 'card-02-reviews-quote', item.text || '');

  card.setAttribute('data-card-02-review-index', String(index));
  identity.appendChild(name);
  identity.appendChild(meta);
  head.appendChild(identity);
  head.appendChild(source);
  card.appendChild(head);
  card.appendChild(stars);
  card.appendChild(quote);

  return card;
}

function createInlineReviews(data) {
  const root = createElement('section', 'card-02-reviews-inline');
  const shell = createElement('div', 'card-02-reviews-shell');
  const summary = createElement('div', 'card-02-reviews-summary');
  const eyebrow = createElement('p', 'card-02-reviews-eyebrow', 'Guest voices');
  const title = createElement('h2', 'card-02-reviews-title', data.summary.scoreWord || 'EXCELLENT');
  const stars = createElement('div', 'card-02-reviews-summary-stars', '★★★★★');
  const count = createElement('p', 'card-02-reviews-count', 'Based on ' + (data.summary.reviewCount || 'guest reviews'));
  const track = createElement('div', 'card-02-reviews-track');

  root.setAttribute('aria-label', 'Guest reviews for Billy and Friend Adventures');
  root.setAttribute('data-card-02-reviews-mounted', 'true');

  summary.appendChild(eyebrow);
  summary.appendChild(title);
  summary.appendChild(stars);
  summary.appendChild(count);
  summary.appendChild(createGoogleMark());

  data.reviews.slice(0, MAX_INLINE_REVIEWS).forEach(function (item, index) {
    track.appendChild(createReviewCard(item, index));
  });

  shell.appendChild(summary);
  shell.appendChild(track);
  root.appendChild(shell);

  return root;
}

function mountCard02Reviews() {
  const card = document.querySelector(CARD_SELECTOR);
  const scroll = card ? card.querySelector(SCROLL_SELECTOR) : null;
  const target = scroll ? (scroll.firstElementChild || scroll) : null;

  if (!card || !scroll || !target) return false;
  if (card.getAttribute(READY_ATTR) === 'true' || card.querySelector('.card-02-reviews-inline')) return true;

  const data = getGalleryWithUsReviewData();
  if (!data || !Array.isArray(data.reviews) || !data.reviews.length) return false;

  const reviews = createInlineReviews(data);
  target.appendChild(reviews);
  card.setAttribute(READY_ATTR, 'true');

  return true;
}

export function initCard02Reviews() {
  if (mountCard02Reviews()) return;

  const observerTarget = document.querySelector('.more-stories-section') || document.body;
  if (!observerTarget || typeof MutationObserver === 'undefined') return;

  const observer = new MutationObserver(function () {
    if (mountCard02Reviews()) {
      observer.disconnect();
    }
  });

  observer.observe(observerTarget, {
    childList: true,
    subtree: true
  });
}
