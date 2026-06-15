export function initNavigation() { /* ✅ UPDATED */
  document.querySelectorAll('[data-nav]').forEach((btn) => { /* ✅ UPDATED */
    btn.addEventListener('click', () => { /* ✅ UPDATED */
      const url = btn.getAttribute('data-nav'); /* ✅ UPDATED */
      if (url) window.location.href = url; /* ✅ UPDATED */
    });
  });
}

export function initContactPopup() { /* ✅ NEW */
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

  console.log('Contact popup initialized from navigation module'); /* ✅ NEW */
}