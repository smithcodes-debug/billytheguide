/* ✅ NEW: MODULE 13 — SITE FOOTER */

export function initSiteFooter() {
  const footer = document.querySelector('.site-footer');
  if (!footer || footer.dataset.siteFooterInitialized === 'true') return;

  const contactButton = footer.querySelector('[data-footer-contact]');
  const backTopButton = footer.querySelector('[data-footer-back-top]');

  footer.dataset.siteFooterInitialized = 'true';

  if (contactButton) {
    contactButton.addEventListener('click', function () {
      window.dispatchEvent(new CustomEvent('billy:open-contact-popup'));
    });
  }

  if (backTopButton) {
    backTopButton.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });
  }
}
