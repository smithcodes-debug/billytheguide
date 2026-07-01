/* ✅ BILLY RUNTIME GUARD — BOOT */
/* Runs early on every page entry. Safe for homepage and landing pages. */
import { RUNTIME_CONFIG } from './runtime-config.js';
import { readRuntimeValue, writeRuntimeValue } from './runtime-storage.js';
import { calibrateRuntimeState, exposeRuntimeCalibration } from './runtime-calibration.js';
import { initRuntimeHealth } from './runtime-health.js';

function markRuntimeBooted() {
  document.documentElement.setAttribute('data-runtime-guard', 'ready');
  document.documentElement.setAttribute('data-runtime-build', RUNTIME_CONFIG.buildId);
}

function syncBuildId() {
  const key = RUNTIME_CONFIG.storageKeys.buildId;
  const previousBuildId = readRuntimeValue(key, '');
  const isBuildMismatch = !!previousBuildId && previousBuildId !== RUNTIME_CONFIG.buildId;

  if (isBuildMismatch) {
    calibrateRuntimeState({
      reason: 'build-id-changed:' + previousBuildId + '->' + RUNTIME_CONFIG.buildId,
      clearStorage: true
    });
  }

  writeRuntimeValue(key, RUNTIME_CONFIG.buildId);

  return {
    previousBuildId,
    currentBuildId: RUNTIME_CONFIG.buildId,
    isBuildMismatch
  };
}

function handlePageShow(event) {
  if (!event || event.persisted !== true) return;

  calibrateRuntimeState({
    reason: 'pageshow-bfcache-restore',
    clearStorage: false
  });
}

export function initRuntimeBoot() {
  if (document.documentElement.dataset.runtimeGuardInitialized === 'true') {
    return window.BillyRuntimeGuard || null;
  }

  document.documentElement.dataset.runtimeGuardInitialized = 'true';

  initRuntimeHealth();
  exposeRuntimeCalibration();
  markRuntimeBooted();

  const buildReport = syncBuildId();

  window.BillyRuntimeGuard = window.BillyRuntimeGuard || {};
  window.BillyRuntimeGuard.config = RUNTIME_CONFIG;
  window.BillyRuntimeGuard.build = buildReport;
  window.BillyRuntimeGuard.bootedAt = Date.now();

  window.addEventListener('pageshow', handlePageShow);

  return window.BillyRuntimeGuard;
}
