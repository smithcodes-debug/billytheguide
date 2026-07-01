export function initSiteFooter() {
  const footer = document.querySelector('.site-footer');

  if (!footer || footer.dataset.siteFooterInitialized === 'true') return;

  const categoryButton = footer.querySelector('[data-footer-category]');
  const checkBookButton = footer.querySelector('[data-footer-check-book]');
  const contactButton = footer.querySelector('[data-footer-contact]');
  const waterForecastButton = footer.querySelector('[data-footer-water-forecast]');
  const galleryButton = footer.querySelector('[data-footer-gallery]');

  footer.dataset.siteFooterInitialized = 'true';

  function isOpen(selector) {
    const target = document.querySelector(selector);
    return !!(target && target.classList.contains('is-open'));
  }

  function dispatchPopupEvent(eventName, source) {
    window.dispatchEvent(new CustomEvent(eventName, {
      detail: {
        source: source
      }
    }));
  }

  function togglePopup(options) {
    if (isOpen(options.selector)) {
      dispatchPopupEvent(options.closeEvent, options.source);
      return;
    }

    dispatchPopupEvent(options.openEvent, options.source);
  }

  if (categoryButton) {
    categoryButton.addEventListener('click', function (event) {
      event.preventDefault();
      togglePopup({
        selector: '#leave-no-trace-popup',
        openEvent: 'billy:open-home-tour-popup',
        closeEvent: 'billy:close-home-tour-popup',
        source: 'site-footer-menu'
      });
    });
  }

  if (checkBookButton) {
    checkBookButton.addEventListener('click', function (event) {
      event.preventDefault();
      togglePopup({
        selector: '#availability-popup',
        openEvent: 'billy:open-availability-popup',
        closeEvent: 'billy:close-availability-popup',
        source: 'site-footer-check-book'
      });
    });
  }

  if (contactButton) {
    contactButton.addEventListener('click', function (event) {
      event.preventDefault();
      togglePopup({
        selector: '#contact-popup',
        openEvent: 'billy:open-contact-popup',
        closeEvent: 'billy:close-contact-popup',
        source: 'site-footer-contact'
      });
    });
  }

  if (waterForecastButton) {
    waterForecastButton.addEventListener('click', function (event) {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent('billy:open-water-forecast', {
        detail: {
          source: 'site-footer-water-forecast'
        }
      }));
    });
  }

  if (galleryButton) {
    galleryButton.addEventListener('click', function (event) {
      event.preventDefault();
      togglePopup({
        selector: '#gallery-with-us-popup',
        openEvent: 'billy:open-gallery-with-us',
        closeEvent: 'billy:close-gallery-with-us',
        source: 'site-footer-gallery'
      });
    });
  }
}
