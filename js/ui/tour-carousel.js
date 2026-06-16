export function initTourCarousel() { /* ✅ NEW */
  const scroller = document.querySelector('.popup-notes'); /* ✅ NEW */
  const shell = document.querySelector('.popup-notes-shell'); /* ✅ NEW */
  const leftArrow = shell ? shell.querySelector('.popup-notes-arrow-left') : null; /* ✅ NEW */
  const rightArrow = shell ? shell.querySelector('.popup-notes-arrow-right') : null; /* ✅ NEW */

  if (!scroller || !shell) return; /* ✅ REQUIRED FIX */
  if (scroller.dataset.tourCarouselInitialized === 'true') return; /* ✅ REQUIRED FIX */

  const originalCards = Array.from(scroller.children).filter(function (card) { /* ✅ NEW */
    return card.classList && card.classList.contains('popup-note-item'); /* ✅ NEW */
  });

  if (originalCards.length < 2) return; /* ✅ REQUIRED FIX */

  scroller.dataset.tourCarouselInitialized = 'true'; /* ✅ NEW */

  const TOUR_PAGE_MAP = { /* ✅ NEW */
    snorkeling: './coral-snorkeling-phu-quoc.html', /* ✅ NEW */
    hiking: './hiking.html', /* ✅ NEW */
    propose: './propose.html', /* ✅ NEW */
    camping: './camping.html' /* ✅ NEW */
  };

  const SCROLL_IDLE_DELAY = 150; /* ✅ NEW: chờ scroll/momentum dừng rồi mới teleport để tránh giật */
  const LOOP_EPSILON = 1; /* ✅ NEW */

  let isJumping = false; /* ✅ NEW */
  let scrollFrame = 0; /* ✅ NEW */
  let idleTimer = 0; /* ✅ NEW */
  let originalStartLeft = 0; /* ✅ NEW */
  let originalEndLeft = 0; /* ✅ NEW */
  let loopWidth = 0; /* ✅ NEW */

  function injectStabilityStyle() { /* ✅ NEW */
    if (document.getElementById('tourCarouselStabilityStyle')) return; /* ✅ REQUIRED FIX */

    const style = document.createElement('style'); /* ✅ NEW */
    style.id = 'tourCarouselStabilityStyle'; /* ✅ NEW */
    style.textContent = `
      .popup-notes.is-infinite-jumping {
        scroll-snap-type: none !important;
        scroll-behavior: auto !important;
      }
      .popup-notes.is-infinite-jumping .popup-note-item,
      .popup-notes.is-infinite-jumping .popup-note-box,
      .popup-notes.is-infinite-jumping .popup-note-label {
        transition: none !important;
      }
    `; /* ✅ NEW */
    document.head.appendChild(style); /* ✅ NEW */
  }

  function prepareCard(card, index, cloneType) { /* ✅ NEW */
    card.dataset.carouselIndex = String(index); /* ✅ NEW */

    if (cloneType) { /* ✅ NEW */
      card.dataset.carouselClone = cloneType; /* ✅ NEW */
      card.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
      card.setAttribute('tabindex', '-1'); /* ✅ NEW */
    } else { /* ✅ NEW */
      card.dataset.carouselOriginal = 'true'; /* ✅ NEW */
    }
  }

  function cloneCard(card, index, cloneType) { /* ✅ NEW */
    const clonedCard = card.cloneNode(true); /* ✅ NEW */
    clonedCard.classList.remove('is-center', 'is-snorkeling-transition-target'); /* ✅ NEW */
    prepareCard(clonedCard, index, cloneType); /* ✅ NEW */
    return clonedCard; /* ✅ NEW */
  }

  originalCards.forEach(function (card, index) { /* ✅ NEW */
    prepareCard(card, index, ''); /* ✅ NEW */
  });

  const beforeClones = originalCards.map(function (card, index) { /* ✅ NEW */
    return cloneCard(card, index, 'before'); /* ✅ NEW */
  });

  const afterClones = originalCards.map(function (card, index) { /* ✅ NEW */
    return cloneCard(card, index, 'after'); /* ✅ NEW */
  });

  const firstOriginalCard = originalCards[0]; /* ✅ NEW */

  beforeClones.forEach(function (card) { /* ✅ NEW */
    scroller.insertBefore(card, firstOriginalCard); /* ✅ NEW */
  });

  afterClones.forEach(function (card) { /* ✅ NEW */
    scroller.appendChild(card); /* ✅ NEW */
  });

  function getAllCards() { /* ✅ NEW */
    return Array.from(scroller.querySelectorAll('.popup-note-item')); /* ✅ NEW */
  }

  function getCenteredScrollLeft(card) { /* ✅ NEW */
    return card.offsetLeft - ((scroller.clientWidth - card.clientWidth) / 2); /* ✅ NEW */
  }

  function measureLoop() { /* ✅ UPDATED */
    originalStartLeft = getCenteredScrollLeft(originalCards[0]); /* ✅ UPDATED: tính theo vị trí center để không teleport sớm */
    originalEndLeft = getCenteredScrollLeft(afterClones[0]); /* ✅ UPDATED: điểm bắt đầu clone sau */
    loopWidth = originalEndLeft - originalStartLeft; /* ✅ NEW */
  }

  function scrollToCard(card, behavior) { /* ✅ NEW */
    if (!card) return; /* ✅ REQUIRED FIX */

    scroller.scrollTo({ /* ✅ NEW */
      left: getCenteredScrollLeft(card), /* ✅ NEW */
      behavior: behavior || 'smooth' /* ✅ NEW */
    });
  }

  function setJumpMode(isEnabled) { /* ✅ NEW */
    if (isEnabled) { /* ✅ NEW */
      scroller.classList.add('is-infinite-jumping'); /* ✅ NEW */
      scroller.style.scrollBehavior = 'auto'; /* ✅ NEW */
      scroller.style.scrollSnapType = 'none'; /* ✅ NEW */
      return; /* ✅ NEW */
    }

    scroller.classList.remove('is-infinite-jumping'); /* ✅ NEW */
    scroller.style.scrollBehavior = ''; /* ✅ NEW */
    scroller.style.scrollSnapType = ''; /* ✅ NEW */
  }

  function updateCenterCard() { /* ✅ UPDATED */
    if (isJumping) return; /* ✅ REQUIRED FIX: không đổi is-center trong lúc teleport */

    const cards = getAllCards(); /* ✅ NEW */
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

  function teleportBy(delta) { /* ✅ NEW */
    if (!loopWidth || isJumping) return; /* ✅ REQUIRED FIX */

    isJumping = true; /* ✅ NEW */
    window.clearTimeout(idleTimer); /* ✅ NEW */
    setJumpMode(true); /* ✅ NEW */

    scroller.scrollLeft += delta; /* ✅ NEW: teleport ngầm sau khi scroll idle */

    window.requestAnimationFrame(function () { /* ✅ NEW */
      window.requestAnimationFrame(function () { /* ✅ NEW */
        setJumpMode(false); /* ✅ NEW */
        isJumping = false; /* ✅ NEW */
        updateCenterCard(); /* ✅ NEW */
      });
    });
  }

  function teleportIfNeededAfterIdle() { /* ✅ NEW */
    if (!loopWidth || isJumping) return; /* ✅ REQUIRED FIX */

    const currentLeft = scroller.scrollLeft; /* ✅ NEW */

    if (currentLeft < originalStartLeft - LOOP_EPSILON) { /* ✅ NEW */
      teleportBy(loopWidth); /* ✅ NEW */
      return; /* ✅ NEW */
    }

    if (currentLeft >= originalEndLeft - LOOP_EPSILON) { /* ✅ NEW */
      teleportBy(-loopWidth); /* ✅ NEW */
    }
  }

  function scheduleIdleTeleportCheck() { /* ✅ NEW */
    window.clearTimeout(idleTimer); /* ✅ NEW */
    idleTimer = window.setTimeout(function () { /* ✅ NEW */
      measureLoop(); /* ✅ NEW */
      teleportIfNeededAfterIdle(); /* ✅ NEW */
    }, SCROLL_IDLE_DELAY); /* ✅ NEW */
  }

  function handleScroll() { /* ✅ UPDATED */
    if (isJumping) return; /* ✅ REQUIRED FIX */
    scheduleIdleTeleportCheck(); /* ✅ NEW: chỉ teleport khi scroll idle */

    if (scrollFrame) return; /* ✅ NEW */

    scrollFrame = window.requestAnimationFrame(function () { /* ✅ NEW */
      scrollFrame = 0; /* ✅ NEW */
      updateCenterCard(); /* ✅ UPDATED: scroll tự nhiên chỉ update card giữa */
    });
  }

  function getCurrentCenterCard() { /* ✅ NEW */
    const centeredCard = scroller.querySelector('.popup-note-item.is-center'); /* ✅ NEW */
    if (centeredCard) return centeredCard; /* ✅ NEW */

    updateCenterCard(); /* ✅ NEW */
    return scroller.querySelector('.popup-note-item.is-center'); /* ✅ NEW */
  }

  function getSiblingCard(direction) { /* ✅ NEW */
    const currentCard = getCurrentCenterCard(); /* ✅ NEW */
    if (!currentCard) return null; /* ✅ REQUIRED FIX */

    if (direction === 'next') { /* ✅ NEW */
      return currentCard.nextElementSibling || getAllCards()[0]; /* ✅ NEW */
    }

    return currentCard.previousElementSibling || getAllCards()[getAllCards().length - 1]; /* ✅ NEW */
  }

  function handleArrowClick(direction) { /* ✅ UPDATED */
    measureLoop(); /* ✅ NEW */
    const targetCard = getSiblingCard(direction); /* ✅ NEW */
    scrollToCard(targetCard, 'smooth'); /* ✅ NEW */
    scheduleIdleTeleportCheck(); /* ✅ NEW */
  }

  function handleCloneCardClick(event) { /* ✅ NEW */
    const clonedCard = event.target.closest('.popup-note-item[data-carousel-clone]'); /* ✅ NEW */
    if (!clonedCard || !scroller.contains(clonedCard)) return; /* ✅ NEW */

    const tourName = clonedCard.dataset.tour; /* ✅ NEW */
    const tourUrl = TOUR_PAGE_MAP[tourName]; /* ✅ NEW */

    if (!tourUrl) return; /* ✅ NEW */

    event.preventDefault(); /* ✅ NEW */
    window.location.href = tourUrl; /* ✅ NEW */
  }

  function resetToFirstOriginal() { /* ✅ NEW */
    measureLoop(); /* ✅ NEW */
    isJumping = true; /* ✅ NEW */
    setJumpMode(true); /* ✅ NEW */
    scrollToCard(originalCards[0], 'auto'); /* ✅ NEW */

    window.requestAnimationFrame(function () { /* ✅ NEW */
      window.requestAnimationFrame(function () { /* ✅ NEW */
        setJumpMode(false); /* ✅ NEW */
        isJumping = false; /* ✅ NEW */
        updateCenterCard(); /* ✅ NEW */
      });
    });
  }

  injectStabilityStyle(); /* ✅ NEW */

  scroller.addEventListener('scroll', handleScroll, { passive: true }); /* ✅ UPDATED */
  scroller.addEventListener('click', handleCloneCardClick); /* ✅ NEW */

  if (leftArrow) { /* ✅ NEW */
    leftArrow.disabled = false; /* ✅ NEW */
    leftArrow.addEventListener('click', function () { /* ✅ NEW */
      handleArrowClick('previous'); /* ✅ NEW */
    });
  }

  if (rightArrow) { /* ✅ NEW */
    rightArrow.disabled = false; /* ✅ NEW */
    rightArrow.addEventListener('click', function () { /* ✅ NEW */
      handleArrowClick('next'); /* ✅ NEW */
    });
  }

  window.addEventListener('resize', function () { /* ✅ NEW */
    window.requestAnimationFrame(function () { /* ✅ NEW */
      measureLoop(); /* ✅ NEW */
      teleportIfNeededAfterIdle(); /* ✅ NEW */
      updateCenterCard(); /* ✅ NEW */
    });
  });

  window.addEventListener('load', resetToFirstOriginal); /* ✅ NEW */
  resetToFirstOriginal(); /* ✅ NEW */

  console.log('Tour carousel initialized with idle infinite loop'); /* ✅ UPDATED */
}
