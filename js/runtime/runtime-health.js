/* ✅ BILLY RUNTIME GUARD — HEALTH */
/* Small health registry for module init reporting. Does not own feature behavior. */
import { RUNTIME_CONFIG } from './runtime-config.js';
import { writeRuntimeValue } from './runtime-storage.js';
import { calibrateRuntimeState } from './runtime-calibration.js';

const healthState = {
  buildId: RUNTIME_CONFIG.buildId,
  startedAt: Date.now(),
  modules: {},
  failures: []
};

function serializeError(error) {
  if (!error) return '';
  return String(error && error.stack ? error.stack : error.message || error);
}

export function initRuntimeHealth() {
  window.BillyRuntimeGuard = window.BillyRuntimeGuard || {};
  window.BillyRuntimeGuard.health = healthState;
  return healthState;
}

export function reportRuntimeOk(moduleName) {
  healthState.modules[moduleName] = {
    ok: true,
    completedAt: Date.now()
  };
}

export function reportRuntimeFailure(moduleName, error, options = {}) {
  const failure = {
    moduleName,
    error: serializeError(error),
    critical: options.critical === true,
    timestamp: Date.now()
  };

  healthState.modules[moduleName] = {
    ok: false,
    completedAt: failure.timestamp,
    error: failure.error
  };
  healthState.failures.push(failure);
  writeRuntimeValue(RUNTIME_CONFIG.storageKeys.lastRuntimeError, JSON.stringify(failure));

  if (failure.critical) {
    calibrateRuntimeState({
      reason: 'critical-module-failure:' + moduleName,
      clearStorage: false
    });
  }

  return failure;
}

export function getRuntimeHealthState() {
  return healthState;
}
