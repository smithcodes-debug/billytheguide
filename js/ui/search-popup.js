const MOBILE_SEARCH_QUERY = '(max-width: 768px)'; /* ✅ NEW */
const SNORKELING_LINK = './coral-snorkeling-phu-quoc.html'; /* ✅ NEW */

const SEARCH_DATA = [ /* ✅ NEW */
  {
    group: 'snorkeling',
    keywords: ['snorkeling', 'snorkling', 'kid snorkeling morning fly', 'kid snorkeling', 'morning fly', 'fly late', 'snorkeling fly late', 'snorkeling with kid fly late', 'snorkeling chill bbq sun set down'],
    cards: [
      {
        title: 'snorkeling fly late',
        desc: 'A flexible snorkeling idea for guests who want a soft start and a private local guide flow.',
        href: SNORKELING_LINK
      },
      {
        title: 'snorkeling with kid fly late',
        desc: 'A calmer snorkeling note for family-style planning, slower timing, and kid-friendly pacing.',
        href: SNORKELING_LINK
      },
      {
        title: 'snorkeling chill BBQ sun set down',
        desc: 'A relaxed snorkeling direction with chill BBQ energy and sunset-style island timing.',
        href: SNORKELING_LINK
      }
    ]
  },
  {
    group: 'diving',
    keywords: ['diving', 'private diving', 'island diving'],
    cards: [
      {
        title: 'private diving in Phú Quốc',
        desc: 'A calm private diving experience for guests who want deeper island water stories.',
        href: './diving-island-phu-quoc.html'
      }
    ]
  },
  {
    group: 'hiking',
    keywords: ['hiking', 'mountain', 'forest', 'private hiking'],
    cards: [
      {
        title: 'private hiking in Phú Quốc',
        desc: 'Quiet local routes for guests who want to see another side of Phú Quốc.',
        href: './hiking-mountain-phu-quoc.html'
      }
    ]
  },
  {
    group: 'camping',
    keywords: ['camping', 'island camping', 'bbq', 'BBQ', 'sunset', 'sun set down'],
    cards: [
      {
        title: 'private camping in Phú Quốc',
        desc: 'Simple outdoor time focused on nature, quiet places, BBQ ideas, and Leave no trace.',
        href: './camping-island-phu-quoc.html'
      }
    ]
  },
  {
    group: 'propose',
    keywords: ['propose', 'proposal', 'couple', 'private proposal'],
    cards: [
      {
        title: 'private proposal getaway',
        desc: 'A quiet private setup for couples visiting the island and planning a memory.',
        href: './propose-island-phu-quoc.html'
      }
    ]
  },
  {
    group: 'coral dictionary',
    keywords: ['coral dictionary', 'coral', 'sunset coral dictionary', 'reef', 'coral note'],
    cards: [
      {
        title: 'coral dictionary at Phú Quốc',
        desc: 'Simple coral notes to help guests understand, respect, and protect reef life.',
        href: './coral-dictionary-at-phu-quoc.html'
      }
    ]
  },
  {
    group: 'leave no trace',
    keywords: ['leave no trace', 'no trace', 'policy', 'disclam', 'disclaimer'],
    cards: [
      {
        title: 'leave no trace',
        desc: 'The travel promise behind Billy and Friend Adventures: enjoy Phú Quốc without damaging nature.',
        href: '#leave-no-trace-popup'
      }
    ]
  },
  {
    group: 'contact',
    keywords: ['contact', 'call', 'phone', 'facebook', 'zalo', 'telegram', 'kakao', 'private guide'],
    cards: [
      {
        title: 'contact Billy and Friend',
        desc: 'Open contact options and find Billy on the platform you already use.',
        href: '#contact-popup'
      }
    ]
  },
  {
    group: 'phu quoc',
    keywords: ['phu quoc', 'phu quoc local guide', 'phu quockid', 'private guide'],
    cards: [
      {
        title: 'private Phú Quốc experiences',
        desc: 'A slower and more personal way to discover Phú Quốc with a local guide team.',
        href: '#more-stories-section'
      }
    ]
  },
  {
    group: 'media picture galary',
    keywords: ['media picture galary', 'media', 'picture', 'gallery', 'galary', 'photo'],
    cards: [
      {
        title: 'media picture galary',
        desc: 'A future space for photos and travel media from Billy and Friend Adventures.',
        href: '#more-stories-section'
      }
    ]
  }
];

function normalizeText(value) { /* ✅ NEW */
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getDefaultCards() { /* ✅ NEW */
  return SEARCH_DATA[0].cards;
}

function findCards(query) { /* ✅ NEW */
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return getDefaultCards();
  const found = SEARCH_DATA.find((item) => {
    return item.keywords.some((keyword) => {
      const normalizedKeyword = normalizeText(keyword);
      return normalizedKeyword.includes(normalizedQuery) || normalizedQuery.includes(normalizedKeyword);
    });
  });
  return found ? found.cards : [];
}

function createCard(card) { /* ✅ NEW */
  const link = document.createElement('a');
  link.className = 'mobile-search-card';
  link.href = card.href;
  link.innerHTML = `
    <h3 class="mobile-search-card-title">${card.title}</h3>
    <p class="mobile-search-card-desc">${card.desc}</p>
    <span class="mobile-search-card-action">open note →</span>
  `;
  return link;
}

function renderResults(resultsEl, query) { /* ✅ NEW */
  const cards = findCards(query);
  resultsEl.textContent = '';
  if (!cards.length) {
    const empty = document.createElement('div');
    empty.className = 'mobile-search-empty';
    empty.textContent = 'Mình chưa tìm thấy. Hãy thử snorkeling, diving, hiking hoặc contact Billy.';
    resultsEl.appendChild(empty);
    return;
  }
  cards.forEach((card) => {
    resultsEl.appendChild(createCard(card));
  });
}

export function initSearchPopup() { /* ✅ NEW */
  const trigger = document.querySelector('.header-search-trigger');
  const popup = document.getElementById('mobile-search-popup');
  const panel = popup ? popup.querySelector('.mobile-search-panel') : null;
  const closeBtn = popup ? popup.querySelector('.mobile-search-close') : null;
  const form = popup ? popup.querySelector('.mobile-search-form') : null;
  const input = popup ? popup.querySelector('.mobile-search-input') : null;
  const results = popup ? popup.querySelector('.mobile-search-results') : null;
  const mobileMedia = window.matchMedia(MOBILE_SEARCH_QUERY);
  if (!trigger || !popup || !panel || !closeBtn || !form || !input || !results) return; /* ✅ REQUIRED FIX */

  function isMobile() { /* ✅ NEW */
    return mobileMedia.matches;
  }

  function openSearch() { /* ✅ NEW */
    if (!isMobile()) return;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
    renderResults(results, input.value);
    window.setTimeout(() => {
      input.focus({ preventScroll: true });
    }, 220);
  }

  function closeSearch() { /* ✅ NEW */
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus({ preventScroll: true });
  }

  trigger.addEventListener('click', openSearch);
  closeBtn.addEventListener('click', closeSearch);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderResults(results, input.value);
  });
  input.addEventListener('input', () => {
    renderResults(results, input.value);
  });
  popup.addEventListener('click', (event) => {
    if (!panel.contains(event.target)) {
      closeSearch();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popup.classList.contains('is-open')) {
      closeSearch();
    }
  });
  mobileMedia.addEventListener('change', () => {
    if (!isMobile() && popup.classList.contains('is-open')) {
      closeSearch();
    }
  });
}
