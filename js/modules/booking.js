export function initAvailabilityPopup() { /* ✅ UPDATED */
  const availabilityMemo = document.getElementById('availabilityMemo'); /* ✅ NEW */
  const availabilityPopup = document.getElementById('availability-popup'); /* ✅ NEW */
  const availabilityPopupCard = availabilityPopup ? availabilityPopup.querySelector('.availability-popup-card') : null; /* ✅ NEW */
  const availabilityCloseBtn = availabilityPopup ? availabilityPopup.querySelector('.availability-popup-close') : null; /* ✅ NEW */
  const availabilityMonthLabel = document.getElementById('availabilityMonthLabel'); /* ✅ NEW */
  const availabilityDays = document.getElementById('availabilityDays'); /* ✅ NEW */
  const availabilityPrevMonth = document.getElementById('availabilityPrevMonth'); /* ✅ NEW */
  const availabilityNextMonth = document.getElementById('availabilityNextMonth'); /* ✅ NEW */
  const availabilityMessage = document.getElementById('availabilityMessage'); /* ✅ NEW */
  const availabilityContactLink = document.getElementById('availabilityContactLink'); /* ✅ NEW */
  const availabilityTourList = document.getElementById('availabilityTourList'); /* ✅ NEW */

  if (!availabilityMemo || !availabilityPopup || !availabilityPopupCard || !availabilityCloseBtn || !availabilityMonthLabel || !availabilityDays || !availabilityPrevMonth || !availabilityNextMonth || !availabilityMessage || !availabilityContactLink || !availabilityTourList) return; /* ✅ REQUIRED FIX */

  const TOUR_PAGE_MAP = { /* ✅ UPDATED */
    snorkeling: './coral-snorkeling-phu-quoc.html', /* ✅ NEW */
    diving: './diving-island-phu-quoc.html', /* ✅ NEW */
    hiking: './hiking-mountain-phu-quoc.html', /* ✅ UPDATED */
    camping: './camping-island-phu-quoc.html', /* ✅ UPDATED */
    propose: './propose-island-phu-quoc.html' /* ✅ UPDATED */
  };

  const BOOKED_DATES = new Set([ /* ✅ NEW: fake booked data for current month + next month */
    '2026-06-17', /* ✅ NEW */
    '2026-06-18', /* ✅ NEW */
    '2026-06-20', /* ✅ NEW */
    '2026-06-22', /* ✅ NEW */
    '2026-06-24', /* ✅ NEW */
    '2026-06-26', /* ✅ NEW */
    '2026-06-27', /* ✅ NEW */
    '2026-06-28', /* ✅ NEW */
    '2026-06-29', /* ✅ NEW */
    '2026-06-30', /* ✅ NEW */
    '2026-07-03', /* ✅ NEW */
    '2026-07-06', /* ✅ NEW */
    '2026-07-09', /* ✅ NEW */
    '2026-07-11', /* ✅ NEW */
    '2026-07-14', /* ✅ NEW */
    '2026-07-17', /* ✅ NEW */
    '2026-07-20', /* ✅ NEW */
    '2026-07-23', /* ✅ NEW */
    '2026-07-25', /* ✅ NEW */
    '2026-07-28' /* ✅ NEW */
  ]);

  const now = new Date(); /* ✅ NEW */
  const currentMonthDate = new Date(now.getFullYear(), now.getMonth(), 1); /* ✅ NEW */
  const maxBookingDate = addMonths(new Date(now.getFullYear(), now.getMonth(), now.getDate()), 6); /* ✅ NEW */
  let visibleMonthDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1); /* ✅ NEW */
  let selectedDateKey = ''; /* ✅ NEW */

  function padNumber(value) { /* ✅ NEW */
    return String(value).padStart(2, '0'); /* ✅ NEW */
  }

  function toDateKey(date) { /* ✅ NEW */
    return date.getFullYear() + '-' + padNumber(date.getMonth() + 1) + '-' + padNumber(date.getDate()); /* ✅ NEW */
  }

  function addMonths(date, count) { /* ✅ NEW */
    const clonedDate = new Date(date.getTime()); /* ✅ NEW */
    clonedDate.setMonth(clonedDate.getMonth() + count); /* ✅ NEW */
    return clonedDate; /* ✅ NEW */
  }

  function isSameDay(dateA, dateB) { /* ✅ NEW */
    return dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate(); /* ✅ NEW */
  }

  function getMonthDistance(fromDate, toDate) { /* ✅ NEW */
    return (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth()); /* ✅ NEW */
  }

  function isInsideTwelveHours(date) { /* ✅ NEW */
    const tourStartTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 0, 0); /* ✅ NEW */
    const diffMs = tourStartTime.getTime() - now.getTime(); /* ✅ NEW */
    return diffMs <= 12 * 60 * 60 * 1000; /* ✅ NEW */
  }

  function resetSelection() { /* ✅ NEW */
    selectedDateKey = ''; /* ✅ NEW */
    availabilityTourList.classList.remove('is-open'); /* ✅ NEW */
    availabilityTourList.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
    availabilityContactLink.disabled = true; /* ✅ NEW */
    availabilityContactLink.textContent = 'Chọn ngày màu xanh để đặt tour.'; /* ✅ NEW */
    availabilityMessage.className = 'availability-message'; /* ✅ NEW */
    availabilityMessage.textContent = ''; /* ✅ NEW */
  }

  function showMessage(text, type) { /* ✅ NEW */
    availabilityMessage.textContent = text; /* ✅ NEW */
    availabilityMessage.className = 'availability-message is-visible' + (type ? ' is-' + type : ''); /* ✅ NEW */
  }

  function openTourChoicePopupFromAvailability() { /* ✅ NEW */
    const leaveNoTracePopup = document.getElementById('leave-no-trace-popup'); /* ✅ NEW */
    const leaveNoTraceCheckbox = document.getElementById('leaveNoTraceCheckbox'); /* ✅ NEW */
    const ctaTriggers = document.querySelectorAll('.cta-trigger'); /* ✅ NEW */

    if (!leaveNoTracePopup) return; /* ✅ REQUIRED FIX */

    closeAvailabilityPopup(); /* ✅ NEW */

    window.setTimeout(function () { /* ✅ NEW */
      if (leaveNoTraceCheckbox) { /* ✅ NEW */
        leaveNoTraceCheckbox.checked = true; /* ✅ NEW */
      }

      leaveNoTracePopup.classList.add('is-open'); /* ✅ NEW */
      leaveNoTracePopup.setAttribute('aria-hidden', 'false'); /* ✅ NEW */

      ctaTriggers.forEach(function (trigger) { /* ✅ NEW */
        trigger.setAttribute('aria-expanded', 'true'); /* ✅ NEW */
      });
    }, 180); /* ✅ NEW */
  }

  function renderCalendar() { /* ✅ NEW */
    availabilityDays.innerHTML = ''; /* ✅ NEW */

    const year = visibleMonthDate.getFullYear(); /* ✅ NEW */
    const month = visibleMonthDate.getMonth(); /* ✅ NEW */
    const firstDate = new Date(year, month, 1); /* ✅ NEW */
    const lastDate = new Date(year, month + 1, 0); /* ✅ NEW */
    const firstDayMondayIndex = (firstDate.getDay() + 6) % 7; /* ✅ NEW */
    const monthDistance = getMonthDistance(currentMonthDate, visibleMonthDate); /* ✅ NEW */

    availabilityMonthLabel.textContent = firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); /* ✅ NEW */
    availabilityPrevMonth.disabled = monthDistance <= 0; /* ✅ NEW */
    availabilityNextMonth.disabled = monthDistance >= 6; /* ✅ NEW */

    for (let i = 0; i < firstDayMondayIndex; i += 1) { /* ✅ NEW */
      const emptyDay = document.createElement('button'); /* ✅ NEW */
      emptyDay.type = 'button'; /* ✅ NEW */
      emptyDay.className = 'availability-day is-empty'; /* ✅ NEW */
      emptyDay.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
      emptyDay.tabIndex = -1; /* ✅ NEW */
      availabilityDays.appendChild(emptyDay); /* ✅ NEW */
    }

    for (let day = 1; day <= lastDate.getDate(); day += 1) { /* ✅ NEW */
      const date = new Date(year, month, day); /* ✅ NEW */
      const dateKey = toDateKey(date); /* ✅ NEW */
      const dayButton = document.createElement('button'); /* ✅ NEW */
      dayButton.type = 'button'; /* ✅ NEW */
      dayButton.className = 'availability-day'; /* ✅ NEW */
      dayButton.textContent = String(day); /* ✅ NEW */
      dayButton.dataset.date = dateKey; /* ✅ NEW */

      const isPastDate = date < new Date(now.getFullYear(), now.getMonth(), now.getDate()); /* ✅ NEW */
      const isTodayDate = isSameDay(date, now); /* ✅ NEW */
      const isTooSoonDate = isInsideTwelveHours(date); /* ✅ NEW */
      const isAfterMaxDate = date > maxBookingDate; /* ✅ NEW */
      const isBookedDate = BOOKED_DATES.has(dateKey); /* ✅ NEW */
      const isAvailableDate = !isPastDate && !isTooSoonDate && !isAfterMaxDate && !isBookedDate; /* ✅ NEW */

      if (isTodayDate) dayButton.classList.add('is-today-date'); /* ✅ NEW */
      if (isPastDate) dayButton.classList.add('is-past'); /* ✅ NEW */
      if (isTooSoonDate && !isPastDate) dayButton.classList.add('is-too-soon'); /* ✅ NEW */
      if (isAfterMaxDate) dayButton.classList.add('is-too-soon'); /* ✅ NEW */
      if (isBookedDate) dayButton.classList.add('is-booked-date'); /* ✅ NEW */
      if (isAvailableDate) dayButton.classList.add('is-open-date'); /* ✅ NEW */
      if (dateKey === selectedDateKey) dayButton.classList.add('is-selected-date'); /* ✅ NEW */

      if (isAvailableDate) { /* ✅ NEW */
        dayButton.addEventListener('click', function () { /* ✅ UPDATED */
          selectedDateKey = dateKey; /* ✅ NEW */
          openTourChoicePopupFromAvailability(); /* ✅ NEW */
        });
      } else { /* ✅ NEW */
        dayButton.disabled = true; /* ✅ NEW */
        if (isBookedDate) { /* ✅ NEW */
          dayButton.setAttribute('aria-label', dateKey + ' đã được đặt'); /* ✅ NEW */
        } else if (isAfterMaxDate) { /* ✅ NEW */
          dayButton.setAttribute('aria-label', dateKey + ' vượt quá giới hạn đặt trước 6 tháng'); /* ✅ NEW */
        } else if (isPastDate || isTooSoonDate) { /* ✅ NEW */
          dayButton.setAttribute('aria-label', dateKey + ' chưa thể đặt do đã qua hoặc còn dưới 12 tiếng'); /* ✅ NEW */
        }
      }

      availabilityDays.appendChild(dayButton); /* ✅ NEW */
    }
  }

  function openAvailabilityPopup() { /* ✅ UPDATED */
    availabilityPopup.classList.add('is-open'); /* ✅ NEW */
    availabilityPopup.setAttribute('aria-hidden', 'false'); /* ✅ NEW */
    availabilityMemo.setAttribute('aria-expanded', 'true'); /* ✅ NEW */
    renderCalendar(); /* ✅ NEW */
  }

  function closeAvailabilityPopup() { /* ✅ UPDATED */
    availabilityPopup.classList.remove('is-open'); /* ✅ NEW */
    availabilityPopup.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
    availabilityMemo.setAttribute('aria-expanded', 'false'); /* ✅ NEW */
  }

  availabilityPrevMonth.addEventListener('click', function () { /* ✅ NEW */
    if (getMonthDistance(currentMonthDate, visibleMonthDate) <= 0) return; /* ✅ REQUIRED FIX */
    visibleMonthDate = addMonths(visibleMonthDate, -1); /* ✅ NEW */
    resetSelection(); /* ✅ NEW */
    renderCalendar(); /* ✅ NEW */
  });

  availabilityNextMonth.addEventListener('click', function () { /* ✅ NEW */
    if (getMonthDistance(currentMonthDate, visibleMonthDate) >= 6) return; /* ✅ REQUIRED FIX */
    visibleMonthDate = addMonths(visibleMonthDate, 1); /* ✅ NEW */
    resetSelection(); /* ✅ NEW */
    renderCalendar(); /* ✅ NEW */
  });

  availabilityTourList.addEventListener('click', function (event) { /* ✅ NEW */
    const tourItem = event.target.closest('.availability-tour-item'); /* ✅ NEW */
    if (!tourItem || !selectedDateKey) return; /* ✅ REQUIRED FIX */
    const tourName = tourItem.dataset.tour; /* ✅ NEW */
    const tourUrl = TOUR_PAGE_MAP[tourName]; /* ✅ NEW */
    if (!tourUrl) return; /* ✅ REQUIRED FIX */
    window.location.href = tourUrl + '?date=' + encodeURIComponent(selectedDateKey); /* ✅ NEW */
  });

  availabilityTourList.addEventListener('keydown', function (event) { /* ✅ NEW */
    if (event.key !== 'Enter' && event.key !== ' ') return; /* ✅ NEW */
    const tourItem = event.target.closest('.availability-tour-item'); /* ✅ NEW */
    if (!tourItem || !selectedDateKey) return; /* ✅ REQUIRED FIX */
    event.preventDefault(); /* ✅ NEW */
    tourItem.click(); /* ✅ NEW */
  });

  availabilityTourList.querySelectorAll('.availability-tour-item').forEach(function (tourItem) { /* ✅ NEW */
    tourItem.setAttribute('role', 'button'); /* ✅ NEW */
    tourItem.setAttribute('tabindex', '0'); /* ✅ NEW */
  });

  window.addEventListener('billy:open-availability-popup', function () { /* ✅ NEW */
    if (availabilityPopup.classList.contains('is-open')) return; /* ✅ REQUIRED FIX */
    openAvailabilityPopup(); /* ✅ NEW */
  });

  availabilityMemo.addEventListener('click', openAvailabilityPopup); /* ✅ NEW */
  availabilityCloseBtn.addEventListener('click', closeAvailabilityPopup); /* ✅ NEW */

  availabilityPopup.addEventListener('click', function (event) { /* ✅ NEW */
    if (!availabilityPopupCard.contains(event.target)) { /* ✅ NEW */
      closeAvailabilityPopup(); /* ✅ NEW */
    }
  });

  document.addEventListener('keydown', function (event) { /* ✅ NEW */
    if (event.key === 'Escape' && availabilityPopup.classList.contains('is-open')) { /* ✅ NEW */
      closeAvailabilityPopup(); /* ✅ NEW */
    }
  });

  resetSelection(); /* ✅ NEW */
  renderCalendar(); /* ✅ NEW */
  console.log('Availability popup initialized from booking module'); /* ✅ UPDATED */
}
