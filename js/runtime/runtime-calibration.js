/* ✅ BILLY RUNTIME GUARD — CALIBRATION */
/* Resets unsafe runtime state across homepage and landing pages. Feature modules still own their own UI logic. */
import { RUNTIME_CONFIG, getRuntimeStorageKey } from './runtime-config.js';
import { clearRuntimeNamespace, writeRuntimeValue } from './runtime-storage.js';

function removeClasses(target, classNames) {
  if (!target || !target.classList) return [];

  const removed = [];
  classNames.forEach(function (className) {
    if (target.classList.contains(className)) {
      target.classList.remove(className);
      removed.push(className);
    }
  });

  return removed;
}

function closePopupBySelector(selector) {
  const popup = document.querySelector(selector);
  if (!popup || !popup.classList) {
    return {
      selector,
      found: false,
      changed: false
    };
  }

  const wasOpen = popup.classList.contains('is-open') || popup.getAttribute('aria-hidden') === 'false';

  popup.classList.remove('is-open', 'is-visible', 'is-closing');
  popup.setAttribute('aria-hidden', 'true');

  if (selector === '#gallery-with-us-popup') {
    document.documentElement.classList.remove('gallery-with-us-open');
    document.body.classList.remove('gallery-with-us-open');
  }

  if (selector === '#water-forecast-popup') {
    document.documentElement.classList.remove('water-forecast-open');
    document.body.classList.remove('water-forecast-open');
  }

  return {
    selector,
    found: true,
    changed: wasOpen
  };
}

function resetExpandedState() {
  const changed = [];
  document.querySelectorAll('[aria-expanded="true"]').forEach(function (node) {
    node.setAttribute('aria-expanded', 'false');
    changed.push(node.tagName.toLowerCase());
  });
  return changed;
}

function resetRuntimeDataAttributes() {
  const root = document.documentElement;
  const body = document.body;

  [root, body].forEach(function (target) {
    if (!target || !target.removeAttribute) return;
    target.removeAttribute('data-mobile-feed-active-card');
    target.removeAttribute('data-mobile-feed-last-card');
  });
}

export function calibrateRuntimeState(options = {}) {
  const reason = options.reason || 'manual-calibration';
  const clearStorage = options.clearStorage === true;
  const report = {
    ok: true,
    reason,
    clearStorage,
    timestamp: Date.now(),
    htmlRemovedClasses: [],
    bodyRemovedClasses: [],
    closedPopups: [],
    resetExpandedCount: 0,
    storage: null
  };

  try {
    report.htmlRemovedClasses = removeClasses(document.documentElement, RUNTIME_CONFIG.htmlBodyResetClasses);
    report.bodyRemovedClasses = removeClasses(document.body, RUNTIME_CONFIG.htmlBodyResetClasses);
    report.closedPopups = RUNTIME_CONFIG.popupSelectors.map(closePopupBySelector);
    report.resetExpandedCount = resetExpandedState().length;
    resetRuntimeDataAttributes();

    if (clearStorage) {
      report.storage = clearRuntimeNamespace({
        keepKeys: [
          getRuntimeStorageKey(RUNTIME_CONFIG.storageKeys.buildId)
        ]
      });
    }

    writeRuntimeValue(RUNTIME_CONFIG.storageKeys.lastCalibrationAt, String(report.timestamp));
    writeRuntimeValue(RUNTIME_CONFIG.storageKeys.lastCalibrationReason, reason);
  } catch (error) {
    report.ok = false;
    report.error = error;
    console.error('Billy Runtime Guard calibration failed', error);
  }

  return report;
}

export function exposeRuntimeCalibration() {
  window.BillyRuntimeGuard = window.BillyRuntimeGuard || {};
  window.BillyRuntimeGuard.calibrate = calibrateRuntimeState;
}
