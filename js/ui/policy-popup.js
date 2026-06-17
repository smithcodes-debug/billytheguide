export function initPolicyPopup() { /* ✅ NEW */
  const titleTrigger = document.querySelector('.title'); /* ✅ NEW */
  const policyPopup = document.getElementById('policy-popup'); /* ✅ NEW */
  const policyPopupCard = policyPopup ? policyPopup.querySelector('.policy-popup-card') : null; /* ✅ NEW */
  const policyCloseBtn = policyPopup ? policyPopup.querySelector('.policy-popup-close') : null; /* ✅ NEW */
  const policyActionBtn = policyPopup ? policyPopup.querySelector('.policy-popup-action') : null; /* ✅ NEW */
  const policyLogoSlot = policyPopup ? policyPopup.querySelector('.policy-popup-logo-slot') : null; /* ✅ NEW */
  const policyGuidelinesToggle = policyPopup ? policyPopup.querySelector('.policy-popup-guidelines-toggle') : null; /* ✅ NEW */
  const policyGuidelines = policyPopup ? policyPopup.querySelector('.policy-popup-guidelines') : null; /* ✅ NEW */
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)'); /* ✅ NEW */

  if (!titleTrigger || !policyPopup || !policyPopupCard || !policyCloseBtn || !policyActionBtn || !policyLogoSlot) return; /* ✅ REQUIRED FIX */

  let isInitialized = policyPopup.dataset.policyPopupInitialized === 'true'; /* ✅ NEW */
  if (isInitialized) return; /* ✅ REQUIRED FIX */
  policyPopup.dataset.policyPopupInitialized = 'true'; /* ✅ NEW */

  function cloneBrandLogo() { /* ✅ UPDATED */
    const sourceLogoMask = document.querySelector('#logoTrigger .mask'); /* ✅ UPDATED: luôn lấy logo mới nhất từ DOM hiện tại */

    if (!sourceLogoMask) return; /* ✅ REQUIRED FIX */

    const clonedLogo = sourceLogoMask.cloneNode(true); /* ✅ UPDATED */
    clonedLogo.setAttribute('aria-hidden', 'true'); /* ✅ NEW */

    policyLogoSlot.innerHTML = ''; /* ✅ UPDATED: luôn refresh logo clone khi mở popup */
    policyLogoSlot.appendChild(clonedLogo); /* ✅ UPDATED */
  }

  function prepareWaveText() { /* ✅ NEW */
    const waveText = policyActionBtn.querySelector('.policy-wave-text'); /* ✅ NEW */
    if (!waveText || waveText.dataset.wavePrepared === 'true') return; /* ✅ REQUIRED FIX */

    const text = waveText.textContent || '"Leave no trace"'; /* ✅ REQUIRED FIX */
    waveText.innerHTML = ''; /* ✅ NEW */

    Array.from(text).forEach(function (character, index) { /* ✅ NEW */
      const characterSpan = document.createElement('span'); /* ✅ NEW */
      characterSpan.textContent = character; /* ✅ NEW */
      characterSpan.style.setProperty('--policy-wave-index', String(index)); /* ✅ NEW */
      waveText.appendChild(characterSpan); /* ✅ NEW */
    });

    waveText.dataset.wavePrepared = 'true'; /* ✅ NEW */
  }

  function setTitleTriggerState(isExpanded) { /* ✅ NEW */
    titleTrigger.setAttribute('role', 'button'); /* ✅ NEW */
    titleTrigger.setAttribute('tabindex', '0'); /* ✅ NEW */
    titleTrigger.setAttribute('aria-controls', 'policy-popup'); /* ✅ NEW */
    titleTrigger.setAttribute('aria-expanded', isExpanded ? 'true' : 'false'); /* ✅ NEW */
  }

  function setPolicyGuidelinesState(isOpen) { /* ✅ NEW */
    if (!policyGuidelinesToggle || !policyGuidelines) return; /* ✅ REQUIRED FIX */
    policyGuidelines.classList.toggle('is-open', isOpen); /* ✅ NEW */
    policyGuidelines.setAttribute('aria-hidden', isOpen ? 'false' : 'true'); /* ✅ NEW */
    policyGuidelinesToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false'); /* ✅ NEW */
  }
  function togglePolicyGuidelines() { /* ✅ NEW */
    if (!policyGuidelinesToggle || !policyGuidelines) return; /* ✅ REQUIRED FIX */
    setPolicyGuidelinesState(!policyGuidelines.classList.contains('is-open')); /* ✅ NEW */
  }
  function openPolicyPopup() { /* ✅ NEW */
    cloneBrandLogo(); /* ✅ UPDATED */
    prepareWaveText(); /* ✅ NEW */

    setPolicyGuidelinesState(false); /* ✅ NEW */
    policyPopup.classList.remove('is-closing'); /* ✅ NEW */
    policyPopup.classList.add('is-open'); /* ✅ NEW */
    policyPopup.setAttribute('aria-hidden', 'false'); /* ✅ NEW */
    setTitleTriggerState(true); /* ✅ NEW */
  }

  function closePolicyPopup(afterClose) { /* ✅ NEW */
    if (!policyPopup.classList.contains('is-open')) { /* ✅ NEW */
      if (typeof afterClose === 'function') afterClose(); /* ✅ NEW */
      return; /* ✅ NEW */
    }

    setPolicyGuidelinesState(false); /* ✅ NEW */
    policyPopup.classList.add('is-closing'); /* ✅ NEW */
    policyPopup.classList.remove('is-open'); /* ✅ NEW */
    setTitleTriggerState(false); /* ✅ NEW */

    window.setTimeout(function () { /* ✅ NEW */
      policyPopup.classList.remove('is-closing'); /* ✅ NEW */
      policyPopup.setAttribute('aria-hidden', 'true'); /* ✅ NEW */

      if (typeof afterClose === 'function') { /* ✅ NEW */
        afterClose(); /* ✅ NEW */
      }
    }, reduceMotionQuery.matches ? 20 : 240); /* ✅ NEW */
  }

  function openTourCardsPopup() { /* ✅ NEW */
    const tourPopup = document.getElementById('leave-no-trace-popup'); /* ✅ NEW */
    const leaveNoTraceCheckbox = document.getElementById('leaveNoTraceCheckbox'); /* ✅ NEW */
    const ctaTriggers = document.querySelectorAll('.cta-trigger'); /* ✅ NEW */

    if (!tourPopup) return; /* ✅ REQUIRED FIX */

    if (leaveNoTraceCheckbox) { /* ✅ NEW */
      leaveNoTraceCheckbox.checked = true; /* ✅ NEW */
    }

    tourPopup.classList.add('is-open'); /* ✅ NEW */
    tourPopup.setAttribute('aria-hidden', 'false'); /* ✅ NEW */

    ctaTriggers.forEach(function (trigger) { /* ✅ NEW */
      trigger.setAttribute('aria-expanded', 'true'); /* ✅ NEW */
    });
  }

  function openTourCardsAfterPolicy() { /* ✅ NEW */
    closePolicyPopup(openTourCardsPopup); /* ✅ NEW */
  }

  titleTrigger.addEventListener('click', function (event) { /* ✅ NEW */
    event.preventDefault(); /* ✅ NEW */
    openPolicyPopup(); /* ✅ NEW */
  });

  titleTrigger.addEventListener('keydown', function (event) { /* ✅ NEW */
    if (event.key === 'Enter' || event.key === ' ') { /* ✅ NEW */
      event.preventDefault(); /* ✅ NEW */
      openPolicyPopup(); /* ✅ NEW */
    }
  });

  policyActionBtn.addEventListener('click', function (event) { /* ✅ NEW */
    event.preventDefault(); /* ✅ NEW */
    openTourCardsAfterPolicy(); /* ✅ NEW */
  });

  if (policyGuidelinesToggle) { /* ✅ NEW */
    policyGuidelinesToggle.addEventListener('click', function (event) { /* ✅ NEW */
      event.preventDefault(); /* ✅ NEW */
      togglePolicyGuidelines(); /* ✅ NEW */
    });
  }
  policyCloseBtn.addEventListener('click', function () { /* ✅ NEW */
    closePolicyPopup(); /* ✅ NEW */
  });

  policyPopup.addEventListener('click', function (event) { /* ✅ NEW */
    if (!policyPopupCard.contains(event.target)) { /* ✅ NEW */
      closePolicyPopup(); /* ✅ NEW */
    }
  });

  document.addEventListener('keydown', function (event) { /* ✅ NEW */
    if (event.key === 'Escape' && policyPopup.classList.contains('is-open')) { /* ✅ NEW */
      closePolicyPopup(); /* ✅ NEW */
    }
  });

  window.addEventListener('billy:open-policy-popup', openPolicyPopup); /* ✅ NEW */

  setTitleTriggerState(false); /* ✅ NEW */
  policyPopup.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
}