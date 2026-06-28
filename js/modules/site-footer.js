/* ✅ NEW: MODULE 13 — SITE FOOTER */

export function initSiteFooter() {
  const footer = document.querySelector('.site-footer');
  if (!footer || footer.dataset.siteFooterInitialized === 'true') return;

  const dockLinks = footer.querySelectorAll('.site-footer-nav .site-footer-link');
  const toursButton = dockLinks[0] || null;
  const storiesButton = dockLinks[1] || null;
  const contactButton = footer.querySelector('[data-footer-contact]');
  const tipsButton = footer.querySelector('.site-footer-button-secondary');
  const mapButton = footer.querySelector('[data-footer-back-top]');
  const moreStoriesSection = document.getElementById('more-stories-section');

  footer.dataset.siteFooterInitialized = 'true';

  if (toursButton) { /* ✅ UPDATED */
    toursButton.addEventListener('click', function (event) {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent('billy:open-home-tour-popup'));
    });
  }

  if (storiesButton) { /* ✅ UPDATED */
    storiesButton.addEventListener('click', function (event) {
      event.preventDefault();
      if (moreStoriesSection) {
        moreStoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  if (contactButton) {
    contactButton.addEventListener('click', function () {
      window.dispatchEvent(new CustomEvent('billy:open-contact-popup'));
    });
  }

  if (tipsButton) { /* ✅ UPDATED */
    tipsButton.addEventListener('click', function (event) {
      event.preventDefault();
      window.location.href = './phu-quoc-tip-and-trick.html';
    });
  }

  if (mapButton) { /* ✅ UPDATED: placeholder until official map link is ready */
    mapButton.addEventListener('click', function () {
      window.dispatchEvent(new CustomEvent('billy:open-contact-popup'));
    });
  }
}
