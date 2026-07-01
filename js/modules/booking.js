export function initAvailabilityPopup() {
  const bookingView = document.getElementById('availability-popup');
  const closeButton = bookingView ? bookingView.querySelector('.availability-popup-close') : null;
  const monthLabel = document.getElementById('availabilityMonthLabel');
  const daysGrid = document.getElementById('availabilityDays');
  const calendarSection = bookingView ? bookingView.querySelector('.availability-calendar-section') : null;
  const prevButton = document.getElementById('availabilityPrevMonth');
  const nextButton = document.getElementById('availabilityNextMonth');
  const messageBox = document.getElementById('availabilityMessage');
  const continueButton = document.getElementById('availabilityContactLink');
  const tourList = document.getElementById('availabilityTourList');
  const footerButton = document.querySelector('[data-footer-check-book]');

  if (!bookingView || !closeButton || !monthLabel || !daysGrid || !calendarSection || !prevButton || !nextButton || !messageBox || !continueButton || !tourList) {
    return;
  }

  if (bookingView.dataset.bookingReady === 'true') {
    return;
  }
  bookingView.dataset.bookingReady = 'true';

  const TOUR_PAGE_MAP = {
    snorkeling: './coral-snorkeling-phu-quoc.html',
    diving: './diving-island-phu-quoc.html',
    camping: './camping-island-phu-quoc.html',
    propose: './propose-island-phu-quoc.html'
  };

  const OPEN_EVENT = 'billy:open-availability-popup';
  const CLOSE_EVENT = 'billy:close-availability-popup';
  const SCROLL_LOCK_CLASS = 'availability-booking-open';
  const MAX_MONTH_OFFSET = 3;
  const MIN_HOURS_BEFORE_TOUR = 12;

  const today = startOfDay(new Date());
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxBookingDate = addMonths(today, MAX_MONTH_OFFSET);
  const bookedDates = createBookedDateSet(today);

  let visibleMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  let selectedDateKey = '';
  let lastFocusedElement = null;
  let calendarTouchStartX = 0;
  let calendarTouchStartY = 0;
  let calendarTouchStartTime = 0;

  function padNumber(value) {
    return String(value).padStart(2, '0');
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
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

  function toDateKey(date) {
    return date.getFullYear() + '-' + padNumber(date.getMonth() + 1) + '-' + padNumber(date.getDate());
  }

  function monthOffset(fromDate, toDate) {
    return (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth());
  }

  function createBookedDateSet(baseDate) {
    const offsets = [2, 5, 9, 14, 18, 23, 29, 37, 44, 51, 63, 78, 96, 117, 139, 162];
    return new Set(offsets.map(function (offset) {
      return toDateKey(addDays(baseDate, offset));
    }));
  }

  function isTooSoon(date) {
    const tourStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 0, 0, 0);
    return tourStart.getTime() - Date.now() <= MIN_HOURS_BEFORE_TOUR * 60 * 60 * 1000;
  }

  function setFooterExpanded(isExpanded) {
    if (!footerButton) {
      return;
    }

    footerButton.setAttribute('aria-controls', 'availability-popup');
    footerButton.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  }

  function setBookingOpenState(isOpen) {
    document.documentElement.classList.toggle(SCROLL_LOCK_CLASS, isOpen);
    document.body.classList.toggle(SCROLL_LOCK_CLASS, isOpen);
    bookingView.classList.toggle('is-open', isOpen);
    bookingView.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    setFooterExpanded(isOpen);
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
    continueButton.disabled = true;
    continueButton.textContent = 'Choose a green date to continue.';
    tourList.classList.remove('is-open');
    tourList.setAttribute('aria-hidden', 'true');
    showMessage('', '');
  }

  function openBooking() {
    if (bookingView.classList.contains('is-open')) {
      return;
    }

    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    visibleMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    resetSelection();
    renderCalendar();
    setBookingOpenState(true);

    window.requestAnimationFrame(function () {
      closeButton.focus({ preventScroll: true });
    });
  }

  function closeBooking() {
    if (!bookingView.classList.contains('is-open')) {
      return;
    }

    setBookingOpenState(false);
    resetSelection();

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus({ preventScroll: true });
    }
  }

  function makeEmptyCell() {
    const cell = document.createElement('span');
    cell.className = 'availability-day availability-day-empty';
    cell.setAttribute('aria-hidden', 'true');
    return cell;
  }

  function makeDayButton(date) {
    const dateKey = toDateKey(date);
    const button = document.createElement('button');
    const isPast = date < today;
    const tooSoon = isTooSoon(date);
    const beyondLimit = date > maxBookingDate;
    const booked = bookedDates.has(dateKey);
    const available = !isPast && !tooSoon && !beyondLimit && !booked;

    button.type = 'button';
    button.className = 'availability-day';
    button.textContent = String(date.getDate());
    button.dataset.date = dateKey;

    if (dateKey === toDateKey(today)) {
      button.classList.add('is-today-date');
    }

    if (dateKey === selectedDateKey) {
      button.classList.add('is-selected-date');
      button.setAttribute('aria-current', 'date');
    }

    if (isPast) {
      button.classList.add('is-closed-date');
      button.disabled = true;
      button.setAttribute('aria-label', dateKey + ' is closed');
    } else if (tooSoon) {
      button.classList.add('is-closed-date');
      button.disabled = true;
      button.setAttribute('aria-label', dateKey + ' is too soon to book');
    } else if (beyondLimit) {
      button.classList.add('is-closed-date');
      button.disabled = true;
      button.setAttribute('aria-label', dateKey + ' is outside the booking window');
    } else if (booked) {
      button.classList.add('is-booked-date');
      button.disabled = true;
      button.setAttribute('aria-label', dateKey + ' is booked');
    } else if (available) {
      button.classList.add('is-open-date');
      button.setAttribute('aria-label', dateKey + ' is open');
      button.addEventListener('click', function () {
        selectDate(dateKey);
      });
    }

    return button;
  }

  function renderCalendar() {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);
    const firstMondayIndex = (firstDate.getDay() + 6) % 7;
    const currentOffset = monthOffset(currentMonth, visibleMonth);

    daysGrid.textContent = '';
    monthLabel.textContent = firstDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });

    prevButton.disabled = currentOffset <= 0;
    nextButton.disabled = currentOffset >= MAX_MONTH_OFFSET;

    for (let index = 0; index < firstMondayIndex; index += 1) {
      daysGrid.appendChild(makeEmptyCell());
    }

    for (let day = 1; day <= lastDate.getDate(); day += 1) {
      daysGrid.appendChild(makeDayButton(new Date(year, month, day)));
    }
  }

  function selectDate(dateKey) {
    selectedDateKey = dateKey;
    continueButton.disabled = false;
    continueButton.textContent = 'Continue with ' + dateKey;
    tourList.classList.add('is-open');
    tourList.setAttribute('aria-hidden', 'false');
    showMessage('Selected date: ' + dateKey + '. Choose your experience below.', 'success');
    renderCalendar();
  }

  function openExistingTourPopup() {
    if (!selectedDateKey) {
      return;
    }

    const existingTourPopup = document.getElementById('leave-no-trace-popup');
    window.dispatchEvent(new CustomEvent('billy:open-home-tour-popup', {
      detail: {
        source: 'availability-booking',
        date: selectedDateKey
      }
    }));

    if (existingTourPopup) {
      existingTourPopup.classList.add('is-open');
      existingTourPopup.setAttribute('aria-hidden', 'false');
      existingTourPopup.querySelectorAll('.popup-note-item').forEach(function (item) {
        item.dataset.selectedDate = selectedDateKey;
      });
    }

    closeBooking();
  }

  function goToTour(tourKey) {
    if (!selectedDateKey || !TOUR_PAGE_MAP[tourKey]) {
      return;
    }

    window.location.href = TOUR_PAGE_MAP[tourKey] + '?date=' + encodeURIComponent(selectedDateKey);
  }

  function handleTourClick(event) {
    const item = event.target.closest('.availability-tour-item');
    if (!item) {
      return;
    }

    goToTour(item.dataset.tour);
  }

  function handleTourKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    const item = event.target.closest('.availability-tour-item');
    if (!item) {
      return;
    }

    event.preventDefault();
    goToTour(item.dataset.tour);
  }

  function goToPreviousMonth() {
    if (monthOffset(currentMonth, visibleMonth) <= 0) {
      return;
    }
    visibleMonth = addMonths(visibleMonth, -1);
    resetSelection();
    renderCalendar();
  }

  function goToNextMonth() {
    if (monthOffset(currentMonth, visibleMonth) >= MAX_MONTH_OFFSET) {
      return;
    }
    visibleMonth = addMonths(visibleMonth, 1);
    resetSelection();
    renderCalendar();
  }

  function handleCalendarTouchStart(event) {
    if (!event.touches || event.touches.length !== 1) {
      return;
    }
    const touch = event.touches[0];
    calendarTouchStartX = touch.clientX;
    calendarTouchStartY = touch.clientY;
    calendarTouchStartTime = Date.now();
  }

  function handleCalendarTouchEnd(event) {
    if (!calendarTouchStartTime || !event.changedTouches || event.changedTouches.length !== 1) {
      return;
    }
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - calendarTouchStartX;
    const deltaY = touch.clientY - calendarTouchStartY;
    const elapsed = Date.now() - calendarTouchStartTime;
    calendarTouchStartX = 0;
    calendarTouchStartY = 0;
    calendarTouchStartTime = 0;
    if (elapsed > 700 || Math.abs(deltaX) < 44 || Math.abs(deltaX) < Math.abs(deltaY) * 1.35) {
      return;
    }
    if (deltaX < 0) {
      goToNextMonth();
    } else {
      goToPreviousMonth();
    }
  }

  prevButton.addEventListener('click', function () {
    if (monthOffset(currentMonth, visibleMonth) <= 0) {
      return;
    }

    visibleMonth = addMonths(visibleMonth, -1);
    resetSelection();
    renderCalendar();
  });

  nextButton.addEventListener('click', function () {
    if (monthOffset(currentMonth, visibleMonth) >= MAX_MONTH_OFFSET) {
      return;
    }

    visibleMonth = addMonths(visibleMonth, 1);
    resetSelection();
    renderCalendar();
  });

  calendarSection.addEventListener('touchstart', handleCalendarTouchStart, { passive: true });
  calendarSection.addEventListener('touchend', handleCalendarTouchEnd, { passive: true });
  closeButton.addEventListener('click', closeBooking);
  continueButton.addEventListener('click', openExistingTourPopup);
  tourList.addEventListener('click', handleTourClick);
  tourList.addEventListener('keydown', handleTourKeydown);

  tourList.querySelectorAll('.availability-tour-item').forEach(function (item) {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
  });

  window.addEventListener(OPEN_EVENT, openBooking);
  window.addEventListener(CLOSE_EVENT, closeBooking);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && bookingView.classList.contains('is-open')) {
      closeBooking();
    }
  });

  setFooterExpanded(false);
  resetSelection();
  renderCalendar();
}
