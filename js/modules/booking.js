export function initAvailabilityPopup() {
  const memoButton = document.getElementById('availabilityMemo');
  const popup = document.getElementById('availability-popup');
  const popupCard = popup ? popup.querySelector('.availability-popup-card') : null;
  const closeButton = popup ? popup.querySelector('.availability-popup-close') : null;
  const monthLabel = document.getElementById('availabilityMonthLabel');
  const daysGrid = document.getElementById('availabilityDays');
  const prevButton = document.getElementById('availabilityPrevMonth');
  const nextButton = document.getElementById('availabilityNextMonth');
  const messageBox = document.getElementById('availabilityMessage');
  const contactButton = document.getElementById('availabilityContactLink');
  const tourList = document.getElementById('availabilityTourList');
  const footerCheckBookButton = document.querySelector('[data-footer-check-book]');

  if (
    !memoButton ||
    !popup ||
    !popupCard ||
    !closeButton ||
    !monthLabel ||
    !daysGrid ||
    !prevButton ||
    !nextButton ||
    !messageBox ||
    !contactButton ||
    !tourList
  ) {
    return;
  }

  if (popup.dataset.availabilityReady === 'true') {
    return;
  }
  popup.dataset.availabilityReady = 'true';

  const TOUR_PAGE_MAP = {
    snorkeling: './coral-snorkeling-phu-quoc.html',
    diving: './diving-island-phu-quoc.html',
    hiking: './hiking-mountain-phu-quoc.html',
    camping: './camping-island-phu-quoc.html',
    propose: './propose-island-phu-quoc.html'
  };

  const OPEN_HOME_TOUR_POPUP_EVENT = 'billy:open-home-tour-popup';
  const OPEN_AVAILABILITY_EVENT = 'billy:open-availability-popup';
  const CLOSE_AVAILABILITY_EVENT = 'billy:close-availability-popup';
  const SCROLL_LOCK_CLASS = 'availability-scroll-locked';
  const MAX_MONTH_OFFSET = 6;
  const MIN_HOURS_BEFORE_TOUR = 12;

  const today = startOfDay(new Date());
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxBookingDay = addMonths(today, MAX_MONTH_OFFSET);
  const demoBookedDates = createDemoBookedDates(today);

  let visibleMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  let selectedDateKey = '';
  let lastFocusedElement = null;

  function padNumber(value) {
    return String(value).padStart(2, '0');
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function toDateKey(date) {
    return [date.getFullYear(), padNumber(date.getMonth() + 1), padNumber(date.getDate())].join('-');
  }

  function addDays(date, count) {
    const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    nextDate.setDate(nextDate.getDate() + count);
    return nextDate;
  }

  function addMonths(date, count) {
    const nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    nextDate.setMonth(nextDate.getMonth() + count);
    return nextDate;
  }

  function getMonthOffset(fromDate, toDate) {
    return (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth());
  }

  function createDemoBookedDates(baseDate) {
    const offsets = [2, 4, 7, 11, 15, 19, 24, 31, 38, 46, 53, 61, 74, 88, 103, 121, 145, 166];
    return new Set(offsets.map(function (offset) {
      return toDateKey(addDays(baseDate, offset));
    }));
  }

  function isTooSoon(date) {
    const tourStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 0, 0);
    const diffMs = tourStart.getTime() - Date.now();
    return diffMs <= MIN_HOURS_BEFORE_TOUR * 60 * 60 * 1000;
  }

  function setScrollLock(isLocked) {
    document.documentElement.classList.toggle(SCROLL_LOCK_CLASS, isLocked);
    document.body.classList.toggle(SCROLL_LOCK_CLASS, isLocked);
  }

  function showMessage(text, type) {
    messageBox.textContent = text || '';
    messageBox.className = 'availability-message';

    if (!text) {
      return;
    }

    messageBox.classList.add('is-visible');
    if (type) {
      messageBox.classList.add('is-' + type);
    }
  }

  function resetSelection() {
    selectedDateKey = '';
    tourList.classList.remove('is-open');
    tourList.setAttribute('aria-hidden', 'true');
    contactButton.disabled = true;
    contactButton.textContent = 'Chọn ngày màu xanh để đặt tour.';
    showMessage('', '');
  }

  function selectDate(dateKey) {
    selectedDateKey = dateKey;
    tourList.classList.add('is-open');
    tourList.setAttribute('aria-hidden', 'false');
    contactButton.disabled = false;
    contactButton.textContent = 'Mở popup chọn tour cho ngày ' + dateKey;
    showMessage('Bạn đã chọn ngày ' + dateKey + '. Hãy chọn tour bên dưới hoặc mở popup tour hiện có.', 'success');
    renderCalendar();
  }

  function createEmptyDay() {
    const emptyDay = document.createElement('span');
    emptyDay.className = 'availability-day availability-day-empty';
    emptyDay.setAttribute('aria-hidden', 'true');
    return emptyDay;
  }

  function createDayButton(date) {
    const dateKey = toDateKey(date);
    const dayButton = document.createElement('button');
    const isPast = date < today;
    const isBeyondLimit = date > maxBookingDay;
    const isBooked = demoBookedDates.has(dateKey);
    const tooSoon = isTooSoon(date);
    const isAvailable = !isPast && !isBeyondLimit && !isBooked && !tooSoon;

    dayButton.type = 'button';
    dayButton.className = 'availability-day';
    dayButton.textContent = String(date.getDate());
    dayButton.dataset.date = dateKey;

    if (dateKey === toDateKey(today)) {
      dayButton.classList.add('is-today-date');
    }

    if (isPast) {
      dayButton.classList.add('is-past');
      dayButton.disabled = true;
      dayButton.setAttribute('aria-label', dateKey + ' đã qua');
    } else if (tooSoon) {
      dayButton.classList.add('is-too-soon');
      dayButton.disabled = true;
      dayButton.setAttribute('aria-label', dateKey + ' cần đặt trước ít nhất 12 tiếng');
    } else if (isBeyondLimit) {
      dayButton.classList.add('is-too-soon');
      dayButton.disabled = true;
      dayButton.setAttribute('aria-label', dateKey + ' vượt quá giới hạn đặt trước 6 tháng');
    } else if (isBooked) {
      dayButton.classList.add('is-booked-date');
      dayButton.disabled = true;
      dayButton.setAttribute('aria-label', dateKey + ' đã được đặt');
    } else if (isAvailable) {
      dayButton.classList.add('is-open-date');
      dayButton.setAttribute('aria-label', dateKey + ' còn trống');
      dayButton.addEventListener('click', function () {
        selectDate(dateKey);
      });
    }

    if (dateKey === selectedDateKey) {
      dayButton.classList.add('is-selected-date');
      dayButton.setAttribute('aria-current', 'date');
    }

    return dayButton;
  }

  function renderCalendar() {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);
    const firstMondayIndex = (firstDate.getDay() + 6) % 7;
    const monthOffset = getMonthOffset(currentMonth, visibleMonth);

    daysGrid.textContent = '';
    monthLabel.textContent = firstDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });

    prevButton.disabled = monthOffset <= 0;
    nextButton.disabled = monthOffset >= MAX_MONTH_OFFSET;

    for (let index = 0; index < firstMondayIndex; index += 1) {
      daysGrid.appendChild(createEmptyDay());
    }

    for (let day = 1; day <= lastDate.getDate(); day += 1) {
      daysGrid.appendChild(createDayButton(new Date(year, month, day)));
    }
  }

  function openAvailabilityPopup() {
    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    memoButton.setAttribute('aria-expanded', 'true');
    setScrollLock(true);
    resetSelection();
    renderCalendar();

    window.requestAnimationFrame(function () {
      closeButton.focus({ preventScroll: true });
    });
  }

  function closeAvailabilityPopup() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    memoButton.setAttribute('aria-expanded', 'false');
    setScrollLock(false);
    resetSelection();

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus({ preventScroll: true });
    }
  }

  function openExistingHomeTourPopup() {
    window.dispatchEvent(new CustomEvent(OPEN_HOME_TOUR_POPUP_EVENT, {
      detail: {
        source: 'availability-booking',
        date: selectedDateKey
      }
    }));

    const existingTourPopup = document.getElementById('leave-no-trace-popup');
    if (existingTourPopup) {
      existingTourPopup.classList.add('is-open');
      existingTourPopup.setAttribute('aria-hidden', 'false');
      existingTourPopup.querySelectorAll('.popup-note-item').forEach(function (item) {
        if (selectedDateKey) {
          item.dataset.selectedDate = selectedDateKey;
        }
      });
    }

    closeAvailabilityPopup();
  }

  function goToTourPage(tourName) {
    const tourUrl = TOUR_PAGE_MAP[tourName];
    if (!tourUrl || !selectedDateKey) {
      return;
    }

    window.location.href = tourUrl + '?date=' + encodeURIComponent(selectedDateKey);
  }

  function handleTourListClick(event) {
    const tourItem = event.target.closest('.availability-tour-item');
    if (!tourItem) {
      return;
    }

    goToTourPage(tourItem.dataset.tour);
  }

  function handleTourListKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    const tourItem = event.target.closest('.availability-tour-item');
    if (!tourItem) {
      return;
    }

    event.preventDefault();
    goToTourPage(tourItem.dataset.tour);
  }

  prevButton.addEventListener('click', function () {
    if (getMonthOffset(currentMonth, visibleMonth) <= 0) {
      return;
    }

    visibleMonth = addMonths(visibleMonth, -1);
    resetSelection();
    renderCalendar();
  });

  nextButton.addEventListener('click', function () {
    if (getMonthOffset(currentMonth, visibleMonth) >= MAX_MONTH_OFFSET) {
      return;
    }

    visibleMonth = addMonths(visibleMonth, 1);
    resetSelection();
    renderCalendar();
  });

  memoButton.addEventListener('click', openAvailabilityPopup);
  closeButton.addEventListener('click', closeAvailabilityPopup);
  contactButton.addEventListener('click', openExistingHomeTourPopup);
  tourList.addEventListener('click', handleTourListClick);
  tourList.addEventListener('keydown', handleTourListKeydown);

  tourList.querySelectorAll('.availability-tour-item').forEach(function (item) {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
  });

  if (footerCheckBookButton) {
    footerCheckBookButton.addEventListener('click', openAvailabilityPopup);
  }

  popup.addEventListener('click', function (event) {
    if (event.target === popup) {
      closeAvailabilityPopup();
    }
  });

  window.addEventListener(OPEN_AVAILABILITY_EVENT, openAvailabilityPopup);
  window.addEventListener(CLOSE_AVAILABILITY_EVENT, closeAvailabilityPopup);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && popup.classList.contains('is-open')) {
      closeAvailabilityPopup();
    }
  });

  resetSelection();
  renderCalendar();
}
