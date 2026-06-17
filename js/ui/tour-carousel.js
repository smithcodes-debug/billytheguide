export function initTourCarousel() { /* ✅ REQUIRED FIX */
  const scroller = document.querySelector('.popup-notes'); /* ✅ NEW */
  const shell = document.querySelector('.popup-notes-shell'); /* ✅ NEW */
  const leftArrow = shell ? shell.querySelector('.popup-notes-arrow-left') : null; /* ✅ NEW */
  const rightArrow = shell ? shell.querySelector('.popup-notes-arrow-right') : null; /* ✅ NEW */
  if (!scroller || !shell) return; /* ✅ REQUIRED FIX */
  if (scroller.dataset.tourCarouselInitialized === 'true') return; /* ✅ REQUIRED FIX */
  scroller.dataset.tourCarouselInitialized = 'true'; /* ✅ NEW */

  const TOUR_PAGE_MAP = { /* ✅ UPDATED */
    snorkeling: './coral-snorkeling-phu-quoc.html', /* ✅ NEW */
    diving: './diving-island-phu-quoc.html', /* ✅ NEW */
    hiking: './hiking-mountain-phu-quoc.html', /* ✅ UPDATED */
    propose: './propose-island-phu-quoc.html', /* ✅ UPDATED */
    camping: './camping-island-phu-quoc.html', /* ✅ UPDATED */
    coralDictionary: './coral-dictionary-at-phu-quoc.html' /* ✅ NEW */
  };

  const SCROLL_STEP_RATIO = 0.82; /* ✅ NEW */
  let scrollFrame = 0; /* ✅ NEW */

  function getCards() { /* ✅ NEW */
    return Array.from(scroller.querySelectorAll('.popup-note-item')); /* ✅ NEW */
  }

  function getScrollStep() { /* ✅ NEW */
    const firstCard = scroller.querySelector('.popup-note-item'); /* ✅ NEW */
    if (!firstCard) return Math.max(240, scroller.clientWidth * SCROLL_STEP_RATIO); /* ✅ REQUIRED FIX */
    const styles = window.getComputedStyle(scroller); /* ✅ NEW */
    const columnGap = parseFloat(styles.columnGap || styles.gap || '0') || 0; /* ✅ NEW */
    return firstCard.getBoundingClientRect().width + columnGap; /* ✅ NEW */
  }

  function updateCenterCard() { /* ✅ UPDATED */
    const cards = getCards(); /* ✅ NEW */
    if (!cards.length) return; /* ✅ REQUIRED FIX */
    const viewportCenter = scroller.scrollLeft + (scroller.clientWidth / 2); /* ✅ NEW */
    let nearestCard = null; /* ✅ NEW */
    let nearestDistance = Number.POSITIVE_INFINITY; /* ✅ NEW */

    cards.forEach(function (card) { /* ✅ NEW */
      const cardCenter = card.offsetLeft + (card.clientWidth / 2); /* ✅ NEW */
      const distance = Math.abs(cardCenter - viewportCenter); /* ✅ NEW */
      if (distance < nearestDistance) { /* ✅ NEW */
        nearestDistance = distance; /* ✅ NEW */
        nearestCard = card; /* ✅ NEW */
      }
    });

    cards.forEach(function (card) { /* ✅ NEW */
      card.classList.toggle('is-center', card === nearestCard); /* ✅ NEW */
    });
  }

  function scheduleCenterUpdate() { /* ✅ NEW */
    if (scrollFrame) return; /* ✅ REQUIRED FIX */
    scrollFrame = window.requestAnimationFrame(function () { /* ✅ NEW */
      scrollFrame = 0; /* ✅ NEW */
      updateCenterCard(); /* ✅ NEW */
    });
  }

  function scrollByDirection(direction) { /* ✅ NEW */
    const step = getScrollStep(); /* ✅ NEW */
    const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth); /* ✅ NEW */
    let nextLeft = scroller.scrollLeft + (direction === 'next' ? step : -step); /* ✅ NEW */

    if (nextLeft < 0) nextLeft = maxScrollLeft; /* ✅ NEW: simple loop without clone risk */
    if (nextLeft > maxScrollLeft) nextLeft = 0; /* ✅ NEW: simple loop without clone risk */

    scroller.scrollTo({ /* ✅ NEW */
      left: nextLeft, /* ✅ NEW */
      behavior: 'smooth' /* ✅ NEW */
    });
  }

  function goToTourPage(tourName) { /* ✅ NEW */
    const tourUrl = TOUR_PAGE_MAP[tourName]; /* ✅ NEW */
    if (!tourUrl) return; /* ✅ REQUIRED FIX */
    window.location.href = tourUrl; /* ✅ NEW */
  }

  function handleCardActivation(event) { /* ✅ NEW */
    const card = event.target.closest('.popup-note-item[data-tour]'); /* ✅ NEW */
    if (!card || !scroller.contains(card)) return; /* ✅ REQUIRED FIX */
    const tourName = card.dataset.tour; /* ✅ NEW */
    if (!TOUR_PAGE_MAP[tourName]) return; /* ✅ REQUIRED FIX */
    event.preventDefault(); /* ✅ NEW */
    goToTourPage(tourName); /* ✅ NEW */
  }

  getCards().forEach(function (card) { /* ✅ NEW */
    if (!card.dataset.tour) return; /* ✅ REQUIRED FIX */
    card.setAttribute('role', card.getAttribute('role') || 'button'); /* ✅ NEW */
    card.setAttribute('tabindex', card.getAttribute('tabindex') || '0'); /* ✅ NEW */
    card.style.cursor = 'pointer'; /* ✅ NEW */
  });

  scroller.addEventListener('scroll', scheduleCenterUpdate, { passive: true }); /* ✅ NEW */
  scroller.addEventListener('click', handleCardActivation); /* ✅ NEW */
  scroller.addEventListener('keydown', function (event) { /* ✅ NEW */
    if (event.key !== 'Enter' && event.key !== ' ') return; /* ✅ NEW */
    const card = event.target.closest('.popup-note-item[data-tour]'); /* ✅ NEW */
    if (!card || !scroller.contains(card)) return; /* ✅ REQUIRED FIX */
    handleCardActivation(event); /* ✅ NEW */
  });

  if (leftArrow) { /* ✅ NEW */
    leftArrow.disabled = false; /* ✅ NEW */
    leftArrow.addEventListener('click', function () { /* ✅ NEW */
      scrollByDirection('previous'); /* ✅ NEW */
    });
  }

  if (rightArrow) { /* ✅ NEW */
    rightArrow.disabled = false; /* ✅ NEW */
    rightArrow.addEventListener('click', function () { /* ✅ NEW */
      scrollByDirection('next'); /* ✅ NEW */
    });
  }

  window.addEventListener('resize', scheduleCenterUpdate); /* ✅ NEW */
  window.requestAnimationFrame(updateCenterCard); /* ✅ NEW */
  console.log('Tour carousel initialized'); /* ✅ UPDATED */
}
