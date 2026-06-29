const DEBUG_RESET_TRIGGER_SELECTOR = '.menu-trigger';
const COOKIE_EXPIRE_DATE = 'Thu, 01 Jan 1970 00:00:00 GMT';

function getCookieNames() {
  return document.cookie
    .split(';')
    .map(function (cookie) {
      return cookie.split('=')[0].trim();
    })
    .filter(Boolean);
}

function getCookiePaths() {
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const paths = ['/'];

  let currentPath = '';

  pathParts.forEach(function (part) {
    currentPath += '/' + part;
    paths.push(currentPath);
  });

  return Array.from(new Set(paths));
}

function getCookieDomains() {
  const hostname = window.location.hostname;
  const domains = ['', hostname];

  if (hostname.includes('.')) {
    domains.push('.' + hostname);
  }

  return Array.from(new Set(domains));
}

function clearCookies() {
  const cookieNames = getCookieNames();
  const paths = getCookiePaths();
  const domains = getCookieDomains();

  cookieNames.forEach(function (name) {
    paths.forEach(function (path) {
      domains.forEach(function (domain) {
        const domainPart = domain ? '; domain=' + domain : '';

        document.cookie =
          name +
          '=; expires=' +
          COOKIE_EXPIRE_DATE +
          '; max-age=0; path=' +
          path +
          domainPart +
          '; SameSite=Lax';
      });
    });
  });
}

async function clearCacheStorage() {
  if (!('caches' in window)) return;

  const cacheNames = await window.caches.keys();

  await Promise.all(
    cacheNames.map(function (cacheName) {
      return window.caches.delete(cacheName);
    })
  );
}

async function unregisterServiceWorkers() {
  if (!('serviceWorker' in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();

  await Promise.all(
    registrations.map(function (registration) {
      return registration.unregister();
    })
  );
}

function clearWebStorage() {
  try {
    window.localStorage.clear();
  } catch (error) {
    console.warn('localStorage clear failed', error);
  }

  try {
    window.sessionStorage.clear();
  } catch (error) {
    console.warn('sessionStorage clear failed', error);
  }
}

async function clearIndexedDB() {
  if (!('indexedDB' in window)) return;
  if (typeof window.indexedDB.databases !== 'function') return;

  const databases = await window.indexedDB.databases();

  await Promise.all(
    databases
      .filter(function (database) {
        return database && database.name;
      })
      .map(function (database) {
        return new Promise(function (resolve) {
          const request = window.indexedDB.deleteDatabase(database.name);

          request.onsuccess = resolve;
          request.onerror = resolve;
          request.onblocked = resolve;
        });
      })
  );
}

function reloadWithCacheBust() {
  const url = new URL(window.location.href);

  url.searchParams.set('debug_cache_bust', String(Date.now()));

  window.location.replace(url.toString());
}

async function clearSiteDataAndReload(trigger) {
  if (trigger.dataset.debugResetRunning === 'true') return;

  const shouldReset = window.confirm(
    'Clear cookies, cache storage, local storage, session storage, IndexedDB, service workers, then reload this page?'
  );

  if (!shouldReset) return;

  trigger.dataset.debugResetRunning = 'true';
  trigger.setAttribute('aria-busy', 'true');

  try {
    clearCookies();
    clearWebStorage();

    await clearCacheStorage();
    await clearIndexedDB();
    await unregisterServiceWorkers();

    reloadWithCacheBust();
  } catch (error) {
    console.error('Debug site reset failed', error);
    trigger.dataset.debugResetRunning = 'false';
    trigger.removeAttribute('aria-busy');
  }
}

export function initDebugSiteReset() {
  const trigger = document.querySelector(DEBUG_RESET_TRIGGER_SELECTOR);

  if (!trigger) return;
  if (trigger.dataset.debugSiteResetInitialized === 'true') return;

  trigger.dataset.debugSiteResetInitialized = 'true';
  trigger.setAttribute('title', 'Debug: clear site data and reload');

  trigger.addEventListener(
    'click',
    function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      clearSiteDataAndReload(trigger);
    },
    true
  );
}
