export function initAvailabilityPopup() { /* ✅ NEW */
  const availabilityMemo = document.getElementById('availabilityMemo'); /* ✅ NEW */
  const availabilityPopup = document.getElementById('availability-popup'); /* ✅ NEW */
  const availabilityPopupCard = availabilityPopup ? availabilityPopup.querySelector('.availability-popup-card') : null; /* ✅ NEW */
  const availabilityCloseBtn = availabilityPopup ? availabilityPopup.querySelector('.availability-popup-close') : null; /* ✅ NEW */

  if (!availabilityMemo || !availabilityPopup || !availabilityPopupCard || !availabilityCloseBtn) return; /* ✅ REQUIRED FIX */

  function openAvailabilityPopup() { /* ✅ NEW */
    availabilityPopup.classList.add('is-open'); /* ✅ NEW */
    availabilityPopup.setAttribute('aria-hidden', 'false'); /* ✅ NEW */
    availabilityMemo.setAttribute('aria-expanded', 'true'); /* ✅ NEW */
  }

  function closeAvailabilityPopup() { /* ✅ NEW */
    availabilityPopup.classList.remove('is-open'); /* ✅ NEW */
    availabilityPopup.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
    availabilityMemo.setAttribute('aria-expanded', 'false'); /* ✅ NEW */
  }

  availabilityMemo.addEventListener('click', openAvailabilityPopup); /* ✅ NEW */
  availabilityCloseBtn.addEventListener('click', closeAvailabilityPopup); /* ✅ NEW */

  availabilityPopup.addEventListener('click', function (event) { /* ✅ NEW */
    if (!availabilityPopupCard.contains(event.target)) { /* ✅ NEW */
      closeAvailabilityPopup(); /* ✅ NEW */
    }
  });

  document.addEventListener('keydown', function (event) { /* ✅ NEW */
    if (event.key === 'Escape' && availabilityPopup.classList.contains('is-open')) { /* ✅ NEW */
      closeAvailabilityPopup(); /* ✅ NEW */
    }
  });

  console.log('Availability popup initialized from booking module'); /* ✅ NEW */
}