const WATER_FORECAST_OPEN_EVENT = 'billy:open-water-forecast';
const WATER_FORECAST_CLOSE_EVENT = 'billy:close-water-forecast';
const WATER_FORECAST_OPEN_CLASS = 'water-forecast-open';
const ROOT_ID = 'water-forecast-popup';

const DEFAULT_WATER_FORECAST_DATA = {
  title: 'PHU QUOC WATER FORECAST',
  rows: [
    {
      key: 'seaCondition',
      icon: 'waves',
      label: 'Sea Condition',
      value: 'Calm'
    },
    {
      key: 'visibility',
      icon: 'eye',
      label: 'Visibility',
      value: 'Good (7–8 m)'
    },
    {
      key: 'current',
      icon: 'current',
      label: 'Current',
      value: 'Slow'
    }
  ],
  bestForLabel: 'BEST FOR',
  bestFor: 'Snorkeling / Island Hopping',
  note: 'base from data base of Billy and Friend'
};

let activeWaterForecastData = mergeWaterForecastData(window.BILLY_WATER_FORECAST_DATA || DEFAULT_WATER_FORECAST_DATA);

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function mergeWaterForecastData(nextData) {
  const source = nextData && typeof nextData === 'object' ? nextData : {};
  const defaultRowsByKey = DEFAULT_WATER_FORECAST_DATA.rows.reduce(function (map, row) {
    map[row.key] = row;
    return map;
  }, {});
  const incomingRows = Array.isArray(source.rows) ? source.rows : [];
  const rows = DEFAULT_WATER_FORECAST_DATA.rows.map(function (defaultRow) {
    const incomingRow = incomingRows.find(function (row) {
      return row && row.key === defaultRow.key;
    }) || {};
    return {
      key: incomingRow.key || defaultRow.key,
      icon: incomingRow.icon || defaultRowsByKey[defaultRow.key].icon,
      label: incomingRow.label || defaultRow.label,
      value: incomingRow.value || defaultRow.value
    };
  });

  return {
    title: source.title || DEFAULT_WATER_FORECAST_DATA.title,
    rows: rows,
    bestForLabel: source.bestForLabel || DEFAULT_WATER_FORECAST_DATA.bestForLabel,
    bestFor: source.bestFor || DEFAULT_WATER_FORECAST_DATA.bestFor,
    note: source.note || DEFAULT_WATER_FORECAST_DATA.note
  };
}

function createIcon(name) {
  const icons = {
    waves: '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M5 18c5.5-4.2 11-4.2 16.5 0s11 4.2 16.5 0 11-4.2 21 0"></path><path d="M5 30c5.5-4.2 11-4.2 16.5 0s11 4.2 16.5 0 11-4.2 21 0"></path><path d="M5 42c5.5-4.2 11-4.2 16.5 0s11 4.2 16.5 0 11-4.2 21 0"></path></svg>',
    eye: '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M4 32c8.2-12.8 17.4-19.2 27.8-19.2S51.8 19.2 60 32C51.8 44.8 42.6 51.2 32.2 51.2S12.2 44.8 4 32z"></path><circle cx="32" cy="32" r="10.5"></circle><circle cx="32" cy="32" r="3.5"></circle></svg>',
    current: '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M6 23h27c7.8 0 7.8-11.5.2-11.5-3.8 0-6.1 2.2-7.2 4.7"></path><path d="M6 35h42c8.3 0 8.3-12.2.2-12.2-4.4 0-6.9 2.7-8 5.5"></path><path d="M6 47h28c7.7 0 7.7 11.2.1 11.2-3.8 0-6-2.1-7.1-4.6"></path></svg>',
    snorkel: '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M9 39c3.6-6.2 9.6-9.4 18-9.4h7.8c3.2 0 5.8 2.6 5.8 5.8v1.5c0 3.2-2.6 5.8-5.8 5.8H24.6c-4.8 0-8.2 1.9-10.5 5.8"></path><path d="M17.5 31.5c-1.7-6.8.1-12.3 5.5-16.5"></path><path d="M42.5 35.8l8.2-20.3 7.7 3.1-8.2 20.4"></path><path d="M45.8 44.2l10.9 7.5"></path><path d="M50.5 40.2l10.9 7.5"></path><path d="M6.5 49.2c4.4 3.9 9.2 5.1 14.5 3.7"></path></svg>'
  };
  return icons[name] || icons.waves;
}

function renderRows(rows) {
  return rows.map(function (row) {
    return `
      <div class="water-forecast-row" data-water-forecast-row="${escapeHtml(row.key)}">
        <span class="water-forecast-icon">${createIcon(row.icon)}</span>
        <div class="water-forecast-text"><span class="water-forecast-label">${escapeHtml(row.label)}:</span> <strong class="water-forecast-value">${escapeHtml(row.value)}</strong></div>
      </div>`;
  }).join('');
}

function renderWaterForecast(data) {
  return `
    <section class="water-forecast-card" role="dialog" aria-modal="true" aria-labelledby="waterForecastTitle">
      <button class="water-forecast-close" type="button" aria-label="Close water forecast">×</button>
      <h2 class="water-forecast-title" id="waterForecastTitle">${escapeHtml(data.title)}</h2>
      <div class="water-forecast-list">
        ${renderRows(data.rows)}
      </div>
      <div class="water-forecast-best">
        <div class="water-forecast-best-text"><span><span class="water-forecast-best-label">${escapeHtml(data.bestForLabel)}:</span> <span class="water-forecast-best-value">${escapeHtml(data.bestFor)}</span></span></div>
        <div class="water-forecast-best-icon">${createIcon('snorkel')}</div>
      </div>
      <p class="water-forecast-note">*${escapeHtml(data.note)}</p>
    </section>`;
}

function createRoot() {
  const existingRoot = document.getElementById(ROOT_ID);
  if (existingRoot) return existingRoot;
  const root = document.createElement('div');
  root.id = ROOT_ID;
  root.className = 'water-forecast-root';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = '<div class="water-forecast-stage"></div>';
  document.body.appendChild(root);
  return root;
}

function syncRender(root) {
  const stage = root.querySelector('.water-forecast-stage');
  if (!stage) return;
  stage.innerHTML = renderWaterForecast(activeWaterForecastData);
}

function setOpenState(root, isOpen) {
  root.classList.toggle('is-open', isOpen);
  root.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  document.documentElement.classList.toggle(WATER_FORECAST_OPEN_CLASS, isOpen);
  document.body.classList.toggle(WATER_FORECAST_OPEN_CLASS, isOpen);
}

export function updateWaterForecastData(nextData) {
  activeWaterForecastData = mergeWaterForecastData(nextData);
  const root = document.getElementById(ROOT_ID);
  if (root) {
    syncRender(root);
  }
}

export function initWaterForecast() {
  const root = createRoot();
  if (root.dataset.waterForecastInitialized === 'true') return;
  root.dataset.waterForecastInitialized = 'true';
  syncRender(root);

  function openWaterForecast() {
    syncRender(root);
    setOpenState(root, true);
    window.requestAnimationFrame(function () {
      const closeButton = root.querySelector('.water-forecast-close');
      if (closeButton) closeButton.focus({ preventScroll: true });
    });
  }

  function closeWaterForecast() {
    setOpenState(root, false);
  }

  window.addEventListener(WATER_FORECAST_OPEN_EVENT, openWaterForecast);
  window.addEventListener(WATER_FORECAST_CLOSE_EVENT, closeWaterForecast);

  root.addEventListener('click', function (event) {
    const closeButton = event.target && event.target.closest ? event.target.closest('.water-forecast-close') : null;
    const card = root.querySelector('.water-forecast-card');
    if (closeButton) {
      closeWaterForecast();
      return;
    }
    if (card && !card.contains(event.target)) {
      closeWaterForecast();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && root.classList.contains('is-open')) {
      closeWaterForecast();
    }
  });

  window.BillyWaterForecast = Object.assign({}, window.BillyWaterForecast, {
    open: openWaterForecast,
    close: closeWaterForecast,
    update: updateWaterForecastData,
    getData: function () {
      return JSON.parse(JSON.stringify(activeWaterForecastData));
    }
  });
}
