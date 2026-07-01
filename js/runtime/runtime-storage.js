/* ✅ BILLY RUNTIME GUARD — STORAGE */
/* Safe storage helpers. Never clear all browser storage; only touch the Billy namespace. */
import { RUNTIME_CONFIG, getRuntimeStorageKey } from './runtime-config.js';

function getLocalStorage() {
  try {
    if (!window.localStorage) return null;
    const testKey = getRuntimeStorageKey('storage-test');
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (error) {
    return null;
  }
}

export function readRuntimeValue(keyName, fallbackValue = '') {
  const storage = getLocalStorage();
  if (!storage) return fallbackValue;

  try {
    const value = storage.getItem(getRuntimeStorageKey(keyName));
    return value === null ? fallbackValue : value;
  } catch (error) {
    return fallbackValue;
  }
}

export function writeRuntimeValue(keyName, value) {
  const storage = getLocalStorage();
  if (!storage) return false;

  try {
    storage.setItem(getRuntimeStorageKey(keyName), String(value));
    return true;
  } catch (error) {
    return false;
  }
}

export function removeRuntimeValue(keyName) {
  const storage = getLocalStorage();
  if (!storage) return false;

  try {
    storage.removeItem(getRuntimeStorageKey(keyName));
    return true;
  } catch (error) {
    return false;
  }
}

export function clearRuntimeNamespace(options = {}) {
  const storage = getLocalStorage();
  const keepKeys = new Set(options.keepKeys || []);
  const removedKeys = [];

  if (!storage) {
    return {
      ok: false,
      removedKeys,
      reason: 'storage-unavailable'
    };
  }

  try {
    const keys = [];
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (key && key.indexOf(RUNTIME_CONFIG.storagePrefix) === 0 && !keepKeys.has(key)) {
        keys.push(key);
      }
    }

    keys.forEach(function (key) {
      storage.removeItem(key);
      removedKeys.push(key);
    });

    return {
      ok: true,
      removedKeys,
      reason: 'cleared-runtime-namespace'
    };
  } catch (error) {
    return {
      ok: false,
      removedKeys,
      reason: 'clear-runtime-namespace-failed',
      error: error
    };
  }
}
