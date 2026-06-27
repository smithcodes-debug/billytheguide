const BRAND_LOGO_TEMPLATE = `
  <div class="mask">
    <div class="fish">🐠</div>
    <div class="bubble b1"></div>
    <div class="bubble b2"></div>
    <div class="bubble b3"></div>
    <div class="text">
      <div class="text1">
        <span class="billy">"Billy</span>
        <span class="and">and</span>
        <span class="friend">Friend"</span>
      </div>
      <div class="text2">adventures</div>
      <div class="text3">The private guide</div>
    </div>
  </div>
`; /* ✅ NEW */

function createBrandLogoNode() { /* ✅ NEW */
  const wrapper = document.createElement('div'); /* ✅ NEW */
  wrapper.className = 'logo'; /* ✅ NEW */
  wrapper.setAttribute('role', 'button'); /* ✅ NEW */
  wrapper.setAttribute('tabindex', '0'); /* ✅ NEW */
  wrapper.setAttribute('aria-controls', 'contact-popup'); /* ✅ NEW */
  wrapper.setAttribute('aria-expanded', 'false'); /* ✅ NEW */
  wrapper.innerHTML = BRAND_LOGO_TEMPLATE.trim(); /* ✅ NEW */
  return wrapper; /* ✅ NEW */
}

export function mountBrandLogo(target, options = {}) { /* ✅ NEW */
  const mountTarget = typeof target === 'string' ? document.querySelector(target) : target; /* ✅ NEW */
  if (!mountTarget) return null; /* ✅ REQUIRED FIX */

  const logoNode = createBrandLogoNode(); /* ✅ NEW */
  const logoId = options.id || 'logoTrigger'; /* ✅ NEW */

  if (logoId) { /* ✅ NEW */
    logoNode.id = logoId; /* ✅ NEW */
  }

  if (options.replace === true) { /* ✅ NEW */
    mountTarget.innerHTML = ''; /* ✅ NEW */
  }

  mountTarget.appendChild(logoNode); /* ✅ NEW */
  return logoNode; /* ✅ NEW */
}

export function cloneBrandLogoMask() { /* ✅ NEW */
  const sourceLogoMask = document.querySelector('#logoTrigger .mask'); /* ✅ NEW */
  if (sourceLogoMask) { /* ✅ NEW */
    return sourceLogoMask.cloneNode(true); /* ✅ NEW */
  }

  const fallbackLogo = createBrandLogoNode(); /* ✅ REQUIRED FIX */
  return fallbackLogo.querySelector('.mask'); /* ✅ REQUIRED FIX */
}

export function setBrandLogoExpanded(logoNode, isExpanded) { /* ✅ NEW */
  if (!logoNode) return; /* ✅ REQUIRED FIX */
  logoNode.setAttribute('aria-expanded', isExpanded ? 'true' : 'false'); /* ✅ NEW */
}

export function bindBrandLogoContactTrigger(logoNode, openContactPopup) { /* ✅ NEW */
  if (!logoNode || typeof openContactPopup !== 'function') return; /* ✅ REQUIRED FIX */

  logoNode.addEventListener('click', function () { /* ✅ NEW */
    openContactPopup(); /* ✅ NEW */
  });

  logoNode.addEventListener('keydown', function (event) { /* ✅ NEW */
    if (event.key === 'Enter' || event.key === ' ') { /* ✅ NEW */
      event.preventDefault(); /* ✅ NEW */
      openContactPopup(); /* ✅ NEW */
    }
  });
}

export function initBrandLogo(options = {}) { /* ✅ NEW */
  const existingLogo = document.getElementById(options.id || 'logoTrigger'); /* ✅ NEW */

  if (existingLogo) { /* ✅ NEW */
    existingLogo.setAttribute('role', 'button'); /* ✅ NEW */
    existingLogo.setAttribute('tabindex', '0'); /* ✅ NEW */
    existingLogo.setAttribute('aria-controls', 'contact-popup'); /* ✅ NEW */
    if (!existingLogo.hasAttribute('aria-expanded')) { /* ✅ NEW */
      existingLogo.setAttribute('aria-expanded', 'false'); /* ✅ NEW */
    }
    return existingLogo; /* ✅ NEW */
  }

  if (!options.mountTarget) return null; /* ✅ REQUIRED FIX */
  return mountBrandLogo(options.mountTarget, options); /* ✅ NEW */
}
