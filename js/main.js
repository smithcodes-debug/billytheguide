import { initGesture } from './ui/gesture.js'; /* ✅ UPDATED */
import { initAvailabilityPopup } from './modules/booking.js'; /* ✅ NEW */
import { initNavigation } from './ui/navigation.js'; /* ✅ UPDATED */

function initHomePopup() { /* ✅ NEW */
  const checkbox = document.getElementById('leaveNoTraceCheckbox'); /* ✅ NEW */
  const popup = document.getElementById('leave-no-trace-popup'); /* ✅ NEW */
  const popupCard = popup ? popup.querySelector('.popup-card') : null; /* ✅ NEW */
  const closeBtn = popup ? popup.querySelector('.popup-close') : null; /* ✅ NEW */
  const triggers = document.querySelectorAll('.cta-trigger'); /* ✅ NEW */

  if (!checkbox || !popup || !popupCard || !closeBtn || !triggers.length) return; /* ✅ REQUIRED FIX */

  function openPopup() { /* ✅ NEW */
    checkbox.checked = true; /* ✅ NEW */
    popup.classList.add('is-open'); /* ✅ NEW */
    popup.setAttribute('aria-hidden', 'false'); /* ✅ NEW */

    triggers.forEach(function (el) { /* ✅ NEW */
      el.setAttribute('aria-expanded', 'true'); /* ✅ NEW */
    });
  }

  function closePopup() { /* ✅ NEW */
    popup.classList.remove('is-open'); /* ✅ NEW */
    popup.setAttribute('aria-hidden', 'true'); /* ✅ NEW */

    triggers.forEach(function (el) { /* ✅ NEW */
      el.setAttribute('aria-expanded', 'false'); /* ✅ NEW */
    });
  }

  triggers.forEach(function (trigger) { /* ✅ NEW */
    trigger.addEventListener('click', function (event) { /* ✅ NEW */
      event.preventDefault(); /* ✅ NEW */
      openPopup(); /* ✅ NEW */
    });

    trigger.addEventListener('keydown', function (event) { /* ✅ NEW */
      if (event.key === 'Enter' || event.key === ' ') { /* ✅ NEW */
        event.preventDefault(); /* ✅ NEW */
        openPopup(); /* ✅ NEW */
      }
    });
  });

  closeBtn.addEventListener('click', closePopup); /* ✅ NEW */

  popup.addEventListener('click', function (event) { /* ✅ NEW */
    if (!popupCard.contains(event.target)) { /* ✅ NEW */
      closePopup(); /* ✅ NEW */
    }
  });

  document.addEventListener('keydown', function (event) { /* ✅ NEW */
    if (event.key === 'Escape' && popup.classList.contains('is-open')) { /* ✅ NEW */
      closePopup(); /* ✅ NEW */
    }
  });

  console.log('Home popup initialized'); /* ✅ NEW */
}

function initHome() { /* ✅ UPDATED */
  console.log('Home initialized'); /* ✅ UPDATED */
}
function initContactPopup() { /* ✅ NEW */
  const contactPopup = document.getElementById('contact-popup'); /* ✅ NEW */
  const contactPopupCard = contactPopup ? contactPopup.querySelector('.contact-popup-card') : null; /* ✅ NEW */
  const contactCloseBtn = contactPopup ? contactPopup.querySelector('.contact-popup-close') : null; /* ✅ NEW */
  const logoTrigger = document.getElementById('logoTrigger'); /* ✅ NEW */

  if (!contactPopup || !contactPopupCard || !contactCloseBtn || !logoTrigger) return; /* ✅ REQUIRED FIX */

  function openContactPopup() { /* ✅ NEW */
    contactPopup.classList.add('is-open'); /* ✅ NEW */
    contactPopup.setAttribute('aria-hidden', 'false'); /* ✅ NEW */
    document.documentElement.classList.add('mobile-popup-scroll-lock'); /* ✅ NEW */
    document.body.classList.add('mobile-popup-scroll-lock'); /* ✅ NEW */
    logoTrigger.setAttribute('aria-expanded', 'true'); /* ✅ NEW */
  }

  function closeContactPopup() { /* ✅ NEW */
    contactPopup.classList.remove('is-open'); /* ✅ NEW */
    contactPopup.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
    document.documentElement.classList.remove('mobile-popup-scroll-lock'); /* ✅ NEW */
    document.body.classList.remove('mobile-popup-scroll-lock'); /* ✅ NEW */
    contactPopupCard.style.transform = ''; /* ✅ NEW */
    logoTrigger.setAttribute('aria-expanded', 'false'); /* ✅ NEW */
  }

  logoTrigger.addEventListener('click', function () { /* ✅ NEW */
    openContactPopup(); /* ✅ NEW */
  });

  logoTrigger.addEventListener('keydown', function (event) { /* ✅ NEW */
    if (event.key === 'Enter' || event.key === ' ') { /* ✅ NEW */
      event.preventDefault(); /* ✅ NEW */
      openContactPopup(); /* ✅ NEW */
    }
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

  console.log('Contact popup initialized'); /* ✅ NEW */
}


initGesture(); /* ✅ UPDATED */
initNavigation(); /* ✅ UPDATED */
initHomePopup(); /* ✅ UPDATED */
initContactPopup(); /* ✅ UPDATED */
initAvailabilityPopup(); /* ✅ NEW */
initHome(); /* ✅ UPDATED */
