export function initContactPopup() {
  const contactPopup = document.getElementById('contact-popup');
  const contactPopupCard = contactPopup ? contactPopup.querySelector('.contact-popup-card') : null;
  const contactCloseBtn = contactPopup ? contactPopup.querySelector('.contact-popup-close') : null;
  const contactTriggers = document.querySelectorAll('[data-contact-popup-trigger]');

  if (!contactPopup || !contactPopupCard || !contactCloseBtn) return;
  if (contactPopup.dataset.contactPopupInitialized === 'true') return;

  contactPopup.dataset.contactPopupInitialized = 'true';

  function setContactTriggersExpanded(isExpanded) {
    contactTriggers.forEach(function (trigger) {
      trigger.setAttribute('role', 'button');
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('aria-controls', 'contact-popup');
      trigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    });
  }

  function openContactPopup() {
    contactPopup.classList.add('is-open');
    contactPopup.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('mobile-popup-scroll-lock');
    document.body.classList.add('mobile-popup-scroll-lock');
    setContactTriggersExpanded(true);
  }

  function closeContactPopup() {
    contactPopup.classList.remove('is-open');
    contactPopup.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('mobile-popup-scroll-lock');
    document.body.classList.remove('mobile-popup-scroll-lock');
    contactPopupCard.style.transform = '';
    setContactTriggersExpanded(false);
  }

  contactTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      openContactPopup();
    });

    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openContactPopup();
      }
    });
  });

  contactCloseBtn.addEventListener('click', closeContactPopup);

  contactPopup.addEventListener('click', function (event) {
    if (!contactPopupCard.contains(event.target)) {
      closeContactPopup();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && contactPopup.classList.contains('is-open')) {
      closeContactPopup();
    }
  });

  window.addEventListener('billy:open-contact-popup', openContactPopup);
  window.addEventListener('billy:close-contact-popup', closeContactPopup);

  setContactTriggersExpanded(false);
  console.log('Contact popup initialized from contact popup module');
}