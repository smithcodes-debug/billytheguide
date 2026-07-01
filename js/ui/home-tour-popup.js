/* ✅ MODULE 09 — HOME TOUR POPUP OPEN/CLOSE */
/* Extracted from main.js to keep main.js as the app orchestration entry. */
export function initHomeTourPopup() {
  const popup = document.getElementById('leave-no-trace-popup');
  const popupCard = popup ? popup.querySelector('.popup-card') : null;
  const closeBtn = popup ? popup.querySelector('.popup-close') : null;
  const OPEN_HOME_TOUR_POPUP_EVENT = 'billy:open-home-tour-popup';
  const CLOSE_HOME_TOUR_POPUP_EVENT = 'billy:close-home-tour-popup';

  if (!popup || !popupCard || !closeBtn) return;

  function getTriggers() {
    return Array.prototype.slice.call(document.querySelectorAll('.cta-trigger'));
  }

  function syncTriggerState(expanded) {
    getTriggers().forEach(function (trigger) {
      trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');

      trigger.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
        input.checked = expanded;
      });
    });
  }

  function openPopup() {
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    syncTriggerState(true);
  }

  function closePopup() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    syncTriggerState(false);
  }

  document.addEventListener('click', function (event) {
    const trigger = event.target && event.target.closest
      ? event.target.closest('.cta-trigger')
      : null;

    if (!trigger) return;

    event.preventDefault();
    openPopup();
  });

  document.addEventListener('keydown', function (event) {
    const trigger = event.target && event.target.closest
      ? event.target.closest('.cta-trigger')
      : null;

    if (!trigger) {
      if (event.key === 'Escape' && popup.classList.contains('is-open')) {
        closePopup();
      }

      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPopup();
    }
  });

  window.addEventListener(OPEN_HOME_TOUR_POPUP_EVENT, openPopup);
  window.addEventListener(CLOSE_HOME_TOUR_POPUP_EVENT, closePopup);

  closeBtn.addEventListener('click', closePopup);

  popup.addEventListener('click', function (event) {
    if (!popupCard.contains(event.target)) {
      closePopup();
    }
  });
}
