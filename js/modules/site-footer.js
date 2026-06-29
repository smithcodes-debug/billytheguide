export function initSiteFooter() {
  const footer = document.querySelector('.site-footer');

  if (!footer || footer.dataset.siteFooterInitialized === 'true') return;

  const categoryButton = footer.querySelector('[data-footer-category]');
  const shortsButton = footer.querySelector('[data-footer-shorts]');
  const contactButton = footer.querySelector('[data-footer-contact]');
  const viewedButton = footer.querySelector('[data-footer-viewed]');
  const storeButton = footer.querySelector('[data-footer-store]');
  const moreStoriesSection = document.getElementById('more-stories-section');

  footer.dataset.siteFooterInitialized = 'true';

  if (categoryButton) {
    categoryButton.addEventListener('click', function () {
      window.dispatchEvent(new CustomEvent('billy:open-home-tour-popup'));
    });
  }

  if (shortsButton) {
    shortsButton.addEventListener('click', function () {
      if (!moreStoriesSection) return;

      moreStoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (contactButton) {
    contactButton.addEventListener('click', function () {
      window.dispatchEvent(new CustomEvent('billy:open-contact-popup'));
    });
  }

  if (viewedButton) {
    viewedButton.addEventListener('click', function () {
      window.location.href = './phu-quoc-tip-and-trick.html';
    });
  }

  if (storeButton) {
    storeButton.addEventListener('click', function () {
      window.dispatchEvent(new CustomEvent('billy:open-contact-popup'));
    });
  }
}
