const GALLERY_OPEN_EVENT = 'billy:open-gallery-with-us';
const GALLERY_CLOSE_EVENT = 'billy:close-gallery-with-us';
const GALLERY_OPEN_CLASS = 'gallery-with-us-open';
const ROOT_ID = 'gallery-with-us-popup';

const MOCK_GALLERY_SUMMARY = {
  title: 'Guest reviews',
  scoreWord: 'EXCELLENT',
  reviewCount: '128 reviews'
};

const MOCK_GALLERY_REVIEWS = [
  {
    guestName: 'Stuart Dunn',
    dateLabel: '8 months ago',
    rating: 5,
    tour: 'snorkeling',
    image: 'images/gallery-with-us/1.png',
    text: 'Not to be missed! Had a fantastic day out with Billy and friends, who were superb hosts. The sea was calm, the coral was beautiful, and the whole experience felt personal, relaxed, and very well cared for.'
  },
  {
    guestName: 'Private family guest',
    dateLabel: '3 months ago',
    rating: 5,
    tour: 'family snorkeling',
    image: 'images/gallery-with-us/2.png',
    text: 'A very kind local guide team. The trip never felt rushed. The children felt safe in the water, and we loved that the guide explained how to protect the coral before we entered the sea.'
  },
  {
    guestName: 'Island day guest',
    dateLabel: '5 months ago',
    rating: 5,
    tour: 'private island day',
    image: 'images/gallery-with-us/3.png',
    text: 'This was the highlight of our Phu Quoc trip. Quiet places, clear water, helpful guidance, and no shopping stops. It felt like spending a day with local friends who really know the island.'
  },
  {
    guestName: 'Coral lover guest',
    dateLabel: '1 year ago',
    rating: 5,
    tour: 'coral friendly tour',
    image: 'images/gallery-with-us/4.jpg',
    text: 'The guide respected the reef and helped everyone move carefully. We saw beautiful coral and fish, but what I remember most is the honest local knowledge and the peaceful route away from the crowd.'
  }
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function createGoogleWord() {
  return '<span class="gallery-with-us-google-word" aria-label="Google"><span class="g-blue">G</span><span class="g-red">o</span><span class="g-yellow">o</span><span class="g-blue">g</span><span class="g-green">l</span><span class="g-red">e</span></span>';
}

function createStars(rating) {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  return '★'.repeat(safeRating) + '☆'.repeat(5 - safeRating);
}

function renderReviewCard(item, index) {
  const image = escapeHtml(item.image);
  const guestName = escapeHtml(item.guestName);
  const dateLabel = escapeHtml(item.dateLabel);
  const tour = escapeHtml(item.tour);
  const text = escapeHtml(item.text);
  const stars = createStars(item.rating);
  return `
    <article class="gallery-with-us-card" data-gallery-card="${index}">
      <div class="gallery-with-us-photo">
        <img src="${image}" alt="${tour} guest moment" loading="lazy" decoding="async">
        <span class="gallery-with-us-chip">${tour}</span>
      </div>
      <div class="gallery-with-us-card-body">
        <div class="gallery-with-us-card-head">
          <div class="gallery-with-us-guest">
            <h3 class="gallery-with-us-guest-name">${guestName}</h3>
            <p class="gallery-with-us-date">${dateLabel}</p>
          </div>
          <span class="gallery-with-us-source-mark" aria-label="Google"><span class="g-blue">G</span></span>
        </div>
        <p class="gallery-with-us-card-stars" aria-label="${item.rating} out of 5 stars">${stars}</p>
        <p class="gallery-with-us-review is-collapsed">${text}</p>
        <button class="gallery-with-us-read-more" type="button" aria-expanded="false">Read more</button>
      </div>
    </article>`;
}

function createRoot() {
  const existingRoot = document.getElementById(ROOT_ID);
  if (existingRoot) return existingRoot;
  const root = document.createElement('div');
  root.id = ROOT_ID;
  root.className = 'gallery-with-us-root';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <section class="gallery-with-us-panel" role="dialog" aria-modal="true" aria-labelledby="galleryWithUsTitle">
      <div class="gallery-with-us-handle" aria-hidden="true"></div>
      <header class="gallery-with-us-head">
        <h2 class="gallery-with-us-title" id="galleryWithUsTitle">${escapeHtml(MOCK_GALLERY_SUMMARY.title)}</h2>
        <button class="gallery-with-us-close" type="button" aria-label="Close gallery">×</button>
      </header>
      <div class="gallery-with-us-body">
        <section class="gallery-with-us-summary" aria-label="Gallery review summary">
          <p class="gallery-with-us-score-word">${escapeHtml(MOCK_GALLERY_SUMMARY.scoreWord)}</p>
          <p class="gallery-with-us-stars" aria-label="5 out of 5 stars">★★★★★</p>
          <p class="gallery-with-us-count">Based on <strong>${escapeHtml(MOCK_GALLERY_SUMMARY.reviewCount)}</strong></p>
          ${createGoogleWord()}
        </section>
        <section class="gallery-with-us-track-wrap" aria-label="Guest review cards">
          <div class="gallery-with-us-track">${MOCK_GALLERY_REVIEWS.map(renderReviewCard).join('')}</div>
          <div class="gallery-with-us-progress" aria-hidden="true"><span class="gallery-with-us-progress-bar"></span></div>
        </section>
      </div>
    </section>`;
  document.body.appendChild(root);
  return root;
}

function setOpenState(root, isOpen) {
  root.classList.toggle('is-open', isOpen);
  root.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  document.documentElement.classList.toggle(GALLERY_OPEN_CLASS, isOpen);
  document.body.classList.toggle(GALLERY_OPEN_CLASS, isOpen);
}

function updateProgress(root) {
  const track = root.querySelector('.gallery-with-us-track');
  const progressBar = root.querySelector('.gallery-with-us-progress-bar');
  const cards = track ? Array.from(track.querySelectorAll('.gallery-with-us-card')) : [];
  if (!track || !progressBar || !cards.length) return;
  const maxScroll = Math.max(1, track.scrollWidth - track.clientWidth);
  const ratio = Math.max(0, Math.min(1, track.scrollLeft / maxScroll));
  const width = Math.max(18, 100 / cards.length);
  const translate = ratio * (100 - width);
  progressBar.style.width = width + '%';
  progressBar.style.transform = 'translateX(' + translate + '%)';
}


export function getGalleryWithUsReviewData() {
  return {
    summary: Object.assign({}, MOCK_GALLERY_SUMMARY),
    reviews: MOCK_GALLERY_REVIEWS.map(function (item) {
      return Object.assign({}, item);
    })
  };
}

export function initGalleryWithUs() {
  const root = createRoot();
  if (root.dataset.galleryWithUsInitialized === 'true') return;
  root.dataset.galleryWithUsInitialized = 'true';
  const panel = root.querySelector('.gallery-with-us-panel');
  const closeButton = root.querySelector('.gallery-with-us-close');
  const track = root.querySelector('.gallery-with-us-track');
  function openGallery() {
    setOpenState(root, true);
    window.requestAnimationFrame(function () {
      updateProgress(root);
      if (closeButton) closeButton.focus({ preventScroll: true });
    });
  }
  function closeGallery() {
    setOpenState(root, false);
  }
  window.addEventListener(GALLERY_OPEN_EVENT, openGallery);
  window.addEventListener(GALLERY_CLOSE_EVENT, closeGallery);
  if (closeButton) closeButton.addEventListener('click', closeGallery);
  root.addEventListener('click', function (event) {
    if (panel && !panel.contains(event.target)) closeGallery();
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && root.classList.contains('is-open')) closeGallery();
  });
  root.querySelectorAll('.gallery-with-us-read-more').forEach(function (button) {
    button.addEventListener('click', function () {
      const card = button.closest('.gallery-with-us-card');
      const review = card ? card.querySelector('.gallery-with-us-review') : null;
      if (!review) return;
      const isCollapsed = review.classList.toggle('is-collapsed');
      button.textContent = isCollapsed ? 'Read more' : 'Show less';
      button.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
    });
  });
  if (track) {
    track.addEventListener('scroll', function () {
      window.requestAnimationFrame(function () { updateProgress(root); });
    }, { passive: true });
  }
  window.addEventListener('resize', function () { updateProgress(root); });
  updateProgress(root);
}
