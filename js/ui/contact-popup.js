export function initContactPopup() { /* ✅ NEW */
  const contactPopup = document.getElementById('contact-popup'); /* ✅ NEW */
  const contactPopupCard = contactPopup ? contactPopup.querySelector('.contact-popup-card') : null; /* ✅ NEW */
  const contactCloseBtn = contactPopup ? contactPopup.querySelector('.contact-popup-close') : null; /* ✅ NEW */
  const contactTriggers = document.querySelectorAll('#logoTrigger, [data-contact-popup-trigger]'); /* ✅ NEW */

  if (!contactPopup || !contactPopupCard || !contactCloseBtn || !contactTriggers.length) return; /* ✅ REQUIRED FIX */
  if (contactPopup.dataset.contactPopupInitialized === 'true') return; /* ✅ REQUIRED FIX */
  contactPopup.dataset.contactPopupInitialized = 'true'; /* ✅ NEW */

  function setContactTriggersExpanded(isExpanded) { /* ✅ NEW */
    contactTriggers.forEach(function (trigger) { /* ✅ NEW */
      trigger.setAttribute('role', 'button'); /* ✅ NEW */
      trigger.setAttribute('tabindex', '0'); /* ✅ NEW */
      trigger.setAttribute('aria-controls', 'contact-popup'); /* ✅ NEW */
      trigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false'); /* ✅ NEW */
    });
  }

  function openContactPopup() { /* ✅ NEW */
    contactPopup.classList.add('is-open'); /* ✅ NEW */
    contactPopup.setAttribute('aria-hidden', 'false'); /* ✅ NEW */
    document.documentElement.classList.add('mobile-popup-scroll-lock'); /* ✅ NEW */
    document.body.classList.add('mobile-popup-scroll-lock'); /* ✅ NEW */
    setContactTriggersExpanded(true); /* ✅ NEW */
  }

  function closeContactPopup() { /* ✅ NEW */
    contactPopup.classList.remove('is-open'); /* ✅ NEW */
    contactPopup.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
    document.documentElement.classList.remove('mobile-popup-scroll-lock'); /* ✅ NEW */
    document.body.classList.remove('mobile-popup-scroll-lock'); /* ✅ NEW */
    contactPopupCard.style.transform = ''; /* ✅ NEW */
    setContactTriggersExpanded(false); /* ✅ NEW */
  }

  contactTriggers.forEach(function (trigger) { /* ✅ NEW */
    trigger.addEventListener('click', function () { /* ✅ NEW */
      openContactPopup(); /* ✅ NEW */
    });

    trigger.addEventListener('keydown', function (event) { /* ✅ NEW */
      if (event.key === 'Enter' || event.key === ' ') { /* ✅ NEW */
        event.preventDefault(); /* ✅ NEW */
        openContactPopup(); /* ✅ NEW */
      }
    });
  });

  contactCloseBtn.addEventListener('click', closeContactPopup); /* ✅ NEW */

  contactPopup.addEventListener('click', function (event) { /* ✅ NEW */
    if (!contactPopupCard.contains(event.target)) { /* ✅ NEW */
      closeContactPopup(); /* ✅ NEW */
    }
  });

  document.addEventListener('keydown', function (event) { /* ✅ NEW */
    if (event.key === 'Escape' && contactPopup.classList.contains('is-open')) { /* ✅ NEW */
      closeContactPopup(); /* ✅ NEW */
    }
  });

  window.addEventListener('billy:open-contact-popup', openContactPopup); /* ✅ NEW */
  window.addEventListener('billy:close-contact-popup', closeContactPopup); /* ✅ NEW */

  setContactTriggersExpanded(false); /* ✅ NEW */
  console.log('Contact popup initialized from contact popup module'); /* ✅ NEW */
}
