export function initNavigation() { /* ✅ UPDATED */
  document.querySelectorAll('[data-nav]').forEach((btn) => { /* ✅ UPDATED */
    btn.addEventListener('click', () => { /* ✅ UPDATED */
      const url = btn.getAttribute('data-nav'); /* ✅ UPDATED */
      if (url) window.location.href = url; /* ✅ UPDATED */
    });
  });
}

export function initSnorkelingCardNavigation() { /* ✅ NEW */
  const snorkelingCards = document.querySelectorAll('.popup-note-item[data-tour="snorkeling"]'); /* ✅ NEW */
  const snorkelingLandingUrl = 'coral-snorkeling-phu-quoc.html'; /* ✅ NEW */

  if (!snorkelingCards.length) return; /* ✅ REQUIRED FIX */

  function goToSnorkelingPage(event) { /* ✅ NEW */
    event.preventDefault(); /* ✅ NEW */
    window.location.href = snorkelingLandingUrl; /* ✅ NEW */
  }

  snorkelingCards.forEach(function (card) { /* ✅ NEW */
    card.addEventListener('click', goToSnorkelingPage); /* ✅ NEW */

    card.addEventListener('keydown', function (event) { /* ✅ NEW */
      if (event.key === 'Enter' || event.key === ' ') { /* ✅ NEW */
        goToSnorkelingPage(event); /* ✅ NEW */
      }
    });
  });

  console.log('Snorkeling card navigation initialized'); /* ✅ NEW */
}
