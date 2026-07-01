/* ✅ BILLY RUNTIME GUARD — CONFIG */
/* Shared runtime constants for every page. Keep this file small and dependency-free. */
export const RUNTIME_CONFIG = Object.freeze({
  appName: 'billy-the-guide',
  buildId: '2026-07-01-runtime-guard-01',
  storagePrefix: 'billy:',
  storageKeys: Object.freeze({
    buildId: 'runtime-build-id',
    lastCalibrationAt: 'runtime-last-calibration-at',
    lastCalibrationReason: 'runtime-last-calibration-reason',
    lastRuntimeError: 'runtime-last-error',
    repairCount: 'runtime-repair-count',
    repairStartedAt: 'runtime-repair-started-at'
  }),
  repair: Object.freeze({
    maxCount: 1,
    windowMs: 30000,
    queryParam: 'runtime-repair'
  }),
  htmlBodyResetClasses: Object.freeze([
    'mobile-popup-scroll-lock',
    'home-scroll-locked',
    'mobile-home-feed-snap',
    'is-feed-ending',
    'is-home-reading-mode',
    'is-hero-exited',
    'gallery-with-us-open',
    'water-forecast-open',
    'is-mobile-feed-header-hidden',
    'is-mobile-feed-last-card-active'
  ]),
  popupSelectors: Object.freeze([
    '#leave-no-trace-popup',
    '#availability-popup',
    '#contact-popup',
    '#gallery-with-us-popup',
    '#water-forecast-popup',
    '#mobile-search-popup',
    '#policy-popup'
  ]),
  footerTriggerSelectors: Object.freeze([
    '[data-footer-category]',
    '[data-footer-check-book]',
    '[data-footer-contact]',
    '[data-footer-gallery]',
    '[data-footer-water-forecast]'
  ])
});

export function getRuntimeStorageKey(keyName) {
  return RUNTIME_CONFIG.storagePrefix + keyName;
}
