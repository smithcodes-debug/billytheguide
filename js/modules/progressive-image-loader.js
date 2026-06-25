/* ✅ NEW: Progressive Image Loader Module
   FILE: ./js/modules/progressive-image-loader.js
   PURPOSE:
   - Low-res image is owned and loaded immediately by CSS.
   - High-res image URL is also owned by CSS through --progressive-highres.
   - This module only owns behavior: when target is visible, preload high-res, then add .is-highres.
   - Reusable across cards/pages without hardcoding tour image paths in JS.
*/

const DEFAULT_SELECTOR = '[data-progressive-image], .js-progressive-image, .mobile-home-feed-card';
const DEFAULT_LOADED_CLASS = 'is-highres';
const DEFAULT_LOADING_CLASS = 'is-highres-loading';
const DEFAULT_ERROR_CLASS = 'is-highres-error';
const DEFAULT_ROOT_MARGIN = '160px 0px';
const DEFAULT_THRESHOLD = 0.18;

function normalizeCssUrl(value) {
  if (!value || typeof value !== 'string') return '';

  const trimmed = value.trim();
  if (!trimmed || trimmed === 'none') return '';

  const match = trimmed.match(/^url\((.*)\)$/i);
  const raw = match ? match[1].trim() : trimmed;

  return raw.replace(/^['"]|['"]$/g, '').trim();
}

function getHighResSrc(element) {
  if (!element) return '';

  const dataSrc = element.getAttribute('data-highres-src');
  if (dataSrc && dataSrc.trim()) return dataSrc.trim();

  const styles = window.getComputedStyle(element);
  return normalizeCssUrl(styles.getPropertyValue('--progressive-highres'));
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('Missing progressive high-res image source'));
      return;
    }

    const image = new Image();

    image.onload = () => resolve(src);
    image.onerror = () => reject(new Error(`Failed to load progressive image: ${src}`));
    image.decoding = 'async';
    image.src = src;
  });
}

function upgradeElement(element, options) {
  if (!element || element.dataset.progressiveImageLoaded === 'true') return;

  const loadedClass = options.loadedClass;
  const loadingClass = options.loadingClass;
  const errorClass = options.errorClass;
  const highResSrc = getHighResSrc(element);

  if (!highResSrc) return;

  element.dataset.progressiveImageLoaded = 'true';
  element.classList.add(loadingClass);

  preloadImage(highResSrc)
    .then(() => {
      element.classList.remove(loadingClass);
      element.classList.add(loadedClass);
      element.dispatchEvent(new CustomEvent('billy:progressive-image-loaded', {
        bubbles: true,
        detail: { src: highResSrc }
      }));
    })
    .catch((error) => {
      element.classList.remove(loadingClass);
      element.classList.add(errorClass);
      element.dataset.progressiveImageLoaded = 'error';
      element.dispatchEvent(new CustomEvent('billy:progressive-image-error', {
        bubbles: true,
        detail: { src: highResSrc, error }
      }));
    });
}

export function initProgressiveImageLoader(config = {}) {
  const options = {
    selector: config.selector || DEFAULT_SELECTOR,
    loadedClass: config.loadedClass || DEFAULT_LOADED_CLASS,
    loadingClass: config.loadingClass || DEFAULT_LOADING_CLASS,
    errorClass: config.errorClass || DEFAULT_ERROR_CLASS,
    rootMargin: config.rootMargin || DEFAULT_ROOT_MARGIN,
    threshold: typeof config.threshold === 'number' ? config.threshold : DEFAULT_THRESHOLD
  };

  const elements = Array.from(document.querySelectorAll(options.selector))
    .filter((element) => getHighResSrc(element));

  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => upgradeElement(element, options));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      observer.unobserve(entry.target);
      upgradeElement(entry.target, options);
    });
  }, {
    root: null,
    rootMargin: options.rootMargin,
    threshold: options.threshold
  });

  elements.forEach((element) => observer.observe(element));
}
