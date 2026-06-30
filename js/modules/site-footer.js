export function initSiteFooter() {
  const footer = document.querySelector('.site-footer');

  if (!footer || footer.dataset.siteFooterInitialized === 'true') return;

  const categoryButton = footer.querySelector('[data-footer-category]');
  const checkBookButton = footer.querySelector('[data-footer-check-book]');
  const contactButton = footer.querySelector('[data-footer-contact]');
  const viewedButton = footer.querySelector('[data-footer-viewed]');
  const storeButton = footer.querySelector('[data-footer-store]');

  footer.dataset.siteFooterInitialized = 'true';

  if (categoryButton) {
    categoryButton.addEventListener('click', function () {
      window.dispatchEvent(new CustomEvent('billy:open-home-tour-popup'));
    });
  }

  if (checkBookButton) {
    checkBookButton.addEventListener('click', function (event) {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent('billy:open-availability-popup', {
        detail: {
          source: 'site-footer-check-book'
        }
      }));
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
