
(function () {
  var checkbox = document.getElementById('leaveNoTraceCheckbox');
  var popup = document.getElementById('leave-no-trace-popup');
  var popupCard = popup.querySelector('.popup-card');
  var closeBtn = popup.querySelector('.popup-close');
  var triggers = document.querySelectorAll('.cta-trigger'); /* ✅ UPDATED */
  var availabilityMemo = document.getElementById('availabilityMemo'); /* ✅ NEW */
  var availabilityPopup = document.getElementById('availability-popup'); /* ✅ NEW */
  var availabilityPopupCard = availabilityPopup ? availabilityPopup.querySelector('.availability-popup-card') : null; /* ✅ NEW */
  var availabilityCloseBtn = availabilityPopup ? availabilityPopup.querySelector('.availability-popup-close') : null; /* ✅ NEW */
  var availabilityDays = document.getElementById('availabilityDays'); /* ✅ NEW */
  var availabilityMonthLabel = document.getElementById('availabilityMonthLabel'); /* ✅ NEW */
  var availabilityPrevMonth = document.getElementById('availabilityPrevMonth'); /* ✅ NEW */
  var availabilityNextMonth = document.getElementById('availabilityNextMonth'); /* ✅ NEW */
  var availabilityContactLink = document.getElementById('availabilityContactLink'); /* ✅ NEW */
  var availabilityMessage = document.getElementById('availabilityMessage'); /* ✅ NEW */
  var availabilityTourList = document.getElementById('availabilityTourList'); /* ✅ NEW */
  var availabilitySelectedDateKey = ''; /* ✅ NEW */
  var contactPopup = document.getElementById('contact-popup'); /* ✅ NEW */
  var contactPopupCard = contactPopup ? contactPopup.querySelector('.contact-popup-card') : null; /* ✅ NEW */
  var contactCloseBtn = contactPopup ? contactPopup.querySelector('.contact-popup-close') : null; /* ✅ NEW */
  var logoTrigger = document.getElementById('logoTrigger'); /* ✅ NEW */
  var mobileGestureStartY = 0; /* ✅ NEW */
  var mobileGestureStartX = 0; /* ✅ NEW */
  var mobileGestureStartTarget = null; /* ✅ NEW */
  var mobileGestureLastTriggerTime = 0; /* ✅ NEW */
  var contactDragStartY = 0; /* ✅ NEW */
  var contactDragDeltaY = 0; /* ✅ NEW */
  var availabilityToday = new Date(); /* ✅ UPDATED */
  var availabilityViewDate = new Date(availabilityToday.getFullYear(), availabilityToday.getMonth(), 1); /* ✅ UPDATED */
  var availabilityMinViewDate = new Date(availabilityToday.getFullYear(), availabilityToday.getMonth() - 1, 1); /* ✅ UPDATED: cho xem 1 tháng đã qua */
  var availabilityMaxViewDate = new Date(availabilityToday.getFullYear(), availabilityToday.getMonth() + 2, 1); /* ✅ UPDATED: cho xem 2 tháng tới */
  var availabilityBookedDates = [ /* ✅ UPDATED: admin khóa đặt tour tại đây, ngày khóa sẽ hiển thị màu đỏ */
'2026-06-20',
    '2026-06-21',
    '2026-06-25',
    '2026-07-05'
  ];
  function formatAvailabilityDate(year, monthIndex, day) { /* ✅ NEW */
    return year + '-' + ('0' + (monthIndex + 1)).slice(-2) + '-' + ('0' + day).slice(-2); /* ✅ NEW */
  }
  function getAvailabilityDateStart(dateKey) { /* ✅ NEW */
    var parts = dateKey.split('-'); /* ✅ NEW */
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 0, 0, 0, 0); /* ✅ NEW */
  }
  function getAvailabilityTodayStart(now) { /* ✅ NEW */
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0); /* ✅ NEW */
  }
  function evaluateAvailabilityDate(dateKey) { /* ✅ UPDATED */
    var now = new Date(); /* ✅ REQUIRED FIX: luôn lấy giờ thật tại thời điểm khách click */
    var selectedDateStart = getAvailabilityDateStart(dateKey); /* ✅ NEW */
    var todayStart = getAvailabilityTodayStart(now); /* ✅ NEW */
    var twelveHoursFromNow = new Date(now.getTime() + (12 * 60 * 60 * 1000)); /* ✅ NEW */

    if (selectedDateStart < todayStart) { /* ✅ UPDATED */
      return { status: 'past', canBook: false, message: 'Ngày này đã qua nên không thể đặt tour.' }; /* ✅ UPDATED */
    }

    if (selectedDateStart.getTime() === todayStart.getTime()) { /* ✅ NEW */
      return { status: 'today', canBook: false, message: 'Hôm nay không thể đặt tour. Vui lòng chọn ngày từ ngày mai.' }; /* ✅ NEW */
    }

    if (availabilityBookedDates.indexOf(dateKey) !== -1) { /* ✅ UPDATED */
      return { status: 'booked', canBook: false, message: 'Ngày này đã được khóa đặt tour. Vui lòng chọn ngày khác.' }; /* ✅ UPDATED */
    }

    if (selectedDateStart <= twelveHoursFromNow) { /* ✅ UPDATED */
      return { status: 'too-soon', canBook: false, message: 'Xin lỗi, chúng tôi không đủ thời gian để chuẩn bị tour trong vòng 12 tiếng.' }; /* ✅ UPDATED */
    }

    return { status: 'available', canBook: true, message: 'Ngày này còn trống. Bấm đặt tour để chọn trải nghiệm.' }; /* ✅ UPDATED */
  }
  function showAvailabilityMessage(message, type) { /* ✅ NEW */
    if (!availabilityMessage) return; /* ✅ REQUIRED FIX */
    availabilityMessage.textContent = message; /* ✅ NEW */
    availabilityMessage.classList.add('is-visible'); /* ✅ NEW */
    availabilityMessage.classList.toggle('is-error', type === 'error'); /* ✅ NEW */
    availabilityMessage.classList.toggle('is-success', type === 'success'); /* ✅ NEW */
  }
  function resetAvailabilityBookingUi() { /* ✅ NEW */
    availabilitySelectedDateKey = ''; /* ✅ NEW */
    if (availabilityContactLink) { /* ✅ NEW */
      availabilityContactLink.disabled = true; /* ✅ NEW */
      availabilityContactLink.textContent = 'Chọn ngày màu xanh để đặt tour.'; /* ✅ NEW */
    }
    if (availabilityTourList) { /* ✅ NEW */
      availabilityTourList.classList.remove('is-open'); /* ✅ NEW */
      availabilityTourList.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
    }
    if (availabilityMessage) { /* ✅ NEW */
      availabilityMessage.textContent = ''; /* ✅ NEW */
      availabilityMessage.classList.remove('is-visible', 'is-error', 'is-success'); /* ✅ NEW */
    }
  }
  function scrollAvailabilityPopupToBottom() { /* ✅ NEW */
    if (!availabilityPopupCard) return; /* ✅ REQUIRED FIX */

    window.requestAnimationFrame(function () { /* ✅ NEW */
      window.setTimeout(function () { /* ✅ NEW: đợi tour cards render xong trên iOS Safari */
        var bottomPosition = availabilityPopupCard.scrollHeight; /* ✅ NEW */

        if (typeof availabilityPopupCard.scrollTo === 'function') { /* ✅ NEW */
          availabilityPopupCard.scrollTo({
            top: bottomPosition,
            behavior: 'smooth'
          }); /* ✅ NEW */
        } else {
          availabilityPopupCard.scrollTop = bottomPosition; /* ✅ REQUIRED FIX */
        }

        if (availabilityTourList && typeof availabilityTourList.scrollIntoView === 'function') { /* ✅ NEW */
          availabilityTourList.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          }); /* ✅ NEW */
        }
      }, 80); /* ✅ NEW */
    });
  }

  function openAvailabilityTourCards() { /* ✅ UPDATED */
    if (!availabilitySelectedDateKey || !availabilityTourList) return; /* ✅ REQUIRED FIX */
    availabilityTourList.classList.add('is-open'); /* ✅ NEW */
    availabilityTourList.setAttribute('aria-hidden', 'false'); /* ✅ NEW */
    showAvailabilityMessage('Chọn một trải nghiệm bên dưới cho ngày ' + availabilitySelectedDateKey + '.', 'success'); /* ✅ NEW */
    scrollAvailabilityPopupToBottom(); /* ✅ NEW: auto scroll xuống danh sách tour */
  }
  function handleAvailabilityDateClick(dateKey, dayButton) { /* ✅ NEW */
    var result = evaluateAvailabilityDate(dateKey); /* ✅ NEW */
    if (availabilityTourList) { /* ✅ NEW */
      availabilityTourList.classList.remove('is-open'); /* ✅ NEW */
      availabilityTourList.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
    }
    if (availabilityDays) { /* ✅ NEW */
      Array.prototype.slice.call(availabilityDays.querySelectorAll('.availability-day')).forEach(function (item) { /* ✅ NEW */
        item.classList.remove('is-selected-date'); /* ✅ NEW */
      });
    }
    if (!result.canBook) { /* ✅ NEW */
      availabilitySelectedDateKey = ''; /* ✅ NEW */
      if (availabilityContactLink) { /* ✅ NEW */
        availabilityContactLink.disabled = true; /* ✅ NEW */
        availabilityContactLink.textContent = 'Chọn ngày màu xanh để đặt tour.'; /* ✅ NEW */
      }
      showAvailabilityMessage(result.message, 'error'); /* ✅ NEW */
      return; /* ✅ NEW */
    }
    availabilitySelectedDateKey = dateKey; /* ✅ NEW */
    if (dayButton) dayButton.classList.add('is-selected-date'); /* ✅ NEW */
    if (availabilityContactLink) { /* ✅ NEW */
      availabilityContactLink.disabled = false; /* ✅ NEW */
      availabilityContactLink.textContent = 'Đặt tour ngày ' + dateKey; /* ✅ NEW */
    }
    showAvailabilityMessage(result.message, 'success'); /* ✅ NEW */
  }

  function getAvailabilityMonthKey(date) { /* ✅ NEW */
    return date.getFullYear() * 12 + date.getMonth(); /* ✅ NEW */
  }
  function clampAvailabilityViewDate(date) { /* ✅ NEW */
    var targetMonthKey = getAvailabilityMonthKey(date); /* ✅ NEW */
    var minMonthKey = getAvailabilityMonthKey(availabilityMinViewDate); /* ✅ NEW */
    var maxMonthKey = getAvailabilityMonthKey(availabilityMaxViewDate); /* ✅ NEW */
    if (targetMonthKey < minMonthKey) { /* ✅ NEW */
      return new Date(availabilityMinViewDate.getFullYear(), availabilityMinViewDate.getMonth(), 1); /* ✅ NEW */
    }
    if (targetMonthKey > maxMonthKey) { /* ✅ NEW */
      return new Date(availabilityMaxViewDate.getFullYear(), availabilityMaxViewDate.getMonth(), 1); /* ✅ NEW */
    }
    return new Date(date.getFullYear(), date.getMonth(), 1); /* ✅ NEW */
  }
  function resetAvailabilityDateBounds(resetToToday) { /* ✅ NEW */
    availabilityToday = new Date(); /* ✅ REQUIRED FIX: mỗi lần mở/render lịch luôn lấy today thật tại thời điểm đó */
    availabilityMinViewDate = new Date(availabilityToday.getFullYear(), availabilityToday.getMonth() - 1, 1); /* ✅ UPDATED: 1 tháng đã qua */
    availabilityMaxViewDate = new Date(availabilityToday.getFullYear(), availabilityToday.getMonth() + 2, 1); /* ✅ UPDATED: 2 tháng tới */
    if (resetToToday) { /* ✅ NEW */
      availabilityViewDate = new Date(availabilityToday.getFullYear(), availabilityToday.getMonth(), 1); /* ✅ NEW: default luôn là tháng chứa today */
      return; /* ✅ NEW */
    }
    availabilityViewDate = clampAvailabilityViewDate(availabilityViewDate); /* ✅ NEW */
  }
  function updateAvailabilityNavState() { /* ✅ NEW */
    if (!availabilityPrevMonth || !availabilityNextMonth) return; /* ✅ REQUIRED FIX */
    var currentMonthKey = getAvailabilityMonthKey(availabilityViewDate); /* ✅ NEW */
    var minMonthKey = getAvailabilityMonthKey(availabilityMinViewDate); /* ✅ NEW */
    var maxMonthKey = getAvailabilityMonthKey(availabilityMaxViewDate); /* ✅ NEW */
    availabilityPrevMonth.disabled = currentMonthKey <= minMonthKey; /* ✅ NEW */
    availabilityNextMonth.disabled = currentMonthKey >= maxMonthKey; /* ✅ NEW */
  }
  function isAvailabilityTodayDate(dateKey) { /* ✅ NEW */
    return dateKey === formatAvailabilityDate(
      availabilityToday.getFullYear(),
      availabilityToday.getMonth(),
      availabilityToday.getDate()
    ); /* ✅ NEW */
  }
  function renderAvailabilityCalendar() { /* ✅ UPDATED */
    if (!availabilityDays || !availabilityMonthLabel) return; /* ✅ REQUIRED FIX */
    resetAvailabilityDateBounds(false); /* ✅ NEW: cập nhật today + khóa range 1 tháng trước/current/2 tháng sau */
    updateAvailabilityNavState(); /* ✅ NEW */
    var year = availabilityViewDate.getFullYear(); /* ✅ NEW */
    var month = availabilityViewDate.getMonth(); /* ✅ NEW */
    var firstDay = new Date(year, month, 1); /* ✅ NEW */
    var lastDate = new Date(year, month + 1, 0).getDate(); /* ✅ NEW */
    var mondayOffset = (firstDay.getDay() + 6) % 7; /* ✅ NEW */
    availabilityMonthLabel.textContent = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); /* ✅ NEW */
    availabilityDays.innerHTML = ''; /* ✅ NEW */
    resetAvailabilityBookingUi(); /* ✅ NEW */
    for (var emptyIndex = 0; emptyIndex < mondayOffset; emptyIndex += 1) { /* ✅ NEW */
      var emptyCell = document.createElement('span'); /* ✅ NEW */
      emptyCell.className = 'availability-day is-empty'; /* ✅ NEW */
      availabilityDays.appendChild(emptyCell); /* ✅ NEW */
    }
    for (var day = 1; day <= lastDate; day += 1) { /* ✅ NEW */
      var dateKey = formatAvailabilityDate(year, month, day); /* ✅ NEW */
      var state = evaluateAvailabilityDate(dateKey); /* ✅ NEW */
      var button = document.createElement('button'); /* ✅ NEW */
      button.type = 'button'; /* ✅ NEW */
      button.className = 'availability-day'; /* ✅ NEW */
      button.textContent = day; /* ✅ NEW */
      button.setAttribute('aria-label', dateKey + ' ' + state.status); /* ✅ UPDATED */
      button.setAttribute('data-date', dateKey); /* ✅ NEW */
      button.setAttribute('data-status', state.status); /* ✅ NEW */
      if (!state.canBook) button.setAttribute('aria-disabled', 'true'); /* ✅ NEW */
      if (state.status === 'past') button.classList.add('is-past'); /* ✅ UPDATED */
      if (state.status === 'today') button.classList.add('is-today-date'); /* ✅ UPDATED: today màu hồng */
      if (state.status === 'too-soon') button.classList.add('is-too-soon'); /* ✅ UPDATED */
      if (state.status === 'available') button.classList.add('is-open-date'); /* ✅ UPDATED: mọi ngày hợp lệ đều màu xanh */
      if (state.status === 'booked') button.classList.add('is-booked-date'); /* ✅ UPDATED: admin khóa sẽ màu đỏ */
if (isAvailabilityTodayDate(dateKey)) button.classList.add('is-today-date'); /* ✅ NEW: today màu hồng */
      button.addEventListener('click', function () { /* ✅ UPDATED */
        handleAvailabilityDateClick(this.getAttribute('data-date'), this); /* ✅ UPDATED */
      });
      availabilityDays.appendChild(button); /* ✅ NEW */
    }
  }
  function openAvailabilityPopup() { /* ✅ UPDATED */
    if (!availabilityPopup) return; /* ✅ REQUIRED FIX */
    resetAvailabilityDateBounds(true); /* ✅ NEW: mỗi lần mở lịch quay về tháng chứa today */
    renderAvailabilityCalendar(); /* ✅ NEW */
    availabilityPopup.classList.add('is-open'); /* ✅ NEW */
    availabilityPopup.setAttribute('aria-hidden', 'false'); /* ✅ NEW */
    if (availabilityMemo) availabilityMemo.setAttribute('aria-expanded', 'true'); /* ✅ NEW */
  }
  function closeAvailabilityPopup() { /* ✅ NEW */
    if (!availabilityPopup) return; /* ✅ REQUIRED FIX */
    availabilityPopup.classList.remove('is-open'); /* ✅ NEW */
    availabilityPopup.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
    if (availabilityMemo) availabilityMemo.setAttribute('aria-expanded', 'false'); /* ✅ NEW */
  }
  function isMobileGestureViewport() { /* ✅ NEW */
    return window.matchMedia('(max-width: 768px)').matches; /* ✅ NEW */
  }
  function mobileFakeHaptic() { /* ✅ NEW */
    if (window.navigator && typeof window.navigator.vibrate === 'function') { /* ✅ NEW */
      window.navigator.vibrate(12); /* ✅ NEW */
    }
  }
  function isAnyMainPopupOpen() { /* ✅ NEW */
    return popup.classList.contains('is-open') ||
      (availabilityPopup && availabilityPopup.classList.contains('is-open')) ||
      (contactPopup && contactPopup.classList.contains('is-open')); /* ✅ NEW */
  }
  function isInsidePopupElement(target) { /* ✅ NEW */
    return !!(target && target.closest && target.closest('.popup-backdrop, .availability-popup-backdrop, .contact-popup-backdrop')); /* ✅ NEW */
  }
  function lockMobilePopupScroll() { /* ✅ NEW */
    document.documentElement.classList.add('mobile-popup-scroll-lock'); /* ✅ NEW */
    document.body.classList.add('mobile-popup-scroll-lock'); /* ✅ NEW */
  }
  function unlockMobilePopupScroll() { /* ✅ NEW */
    document.documentElement.classList.remove('mobile-popup-scroll-lock'); /* ✅ NEW */
    document.body.classList.remove('mobile-popup-scroll-lock'); /* ✅ NEW */
  }
  function openContactPopup() { /* ✅ NEW */
    if (!contactPopup || !isMobileGestureViewport()) return; /* ✅ REQUIRED FIX */
    contactPopup.classList.add('is-open'); /* ✅ NEW */
    contactPopup.setAttribute('aria-hidden', 'false'); /* ✅ NEW */
    lockMobilePopupScroll(); /* ✅ NEW */
    mobileFakeHaptic(); /* ✅ NEW */
    if (logoTrigger) logoTrigger.setAttribute('aria-expanded', 'true'); /* ✅ NEW */
  }
  function closeContactPopup() { /* ✅ NEW */
    if (!contactPopup) return; /* ✅ REQUIRED FIX */
    contactPopup.classList.remove('is-open'); /* ✅ NEW */
    contactPopup.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
    unlockMobilePopupScroll(); /* ✅ NEW */
    if (contactPopupCard) contactPopupCard.style.transform = ''; /* ✅ NEW */
    if (logoTrigger) logoTrigger.setAttribute('aria-expanded', 'false'); /* ✅ NEW */
  }
  function handleMobileGestureStart(event) { /* ✅ NEW */
    if (!isMobileGestureViewport()) return; /* ✅ NEW */
    if (!event.touches || event.touches.length !== 1) return; /* ✅ REQUIRED FIX */
    mobileGestureStartTarget = event.target; /* ✅ NEW */
    mobileGestureStartY = event.touches[0].clientY; /* ✅ NEW */
    mobileGestureStartX = event.touches[0].clientX; /* ✅ NEW */
  }
  function handleMobileGestureEnd(event) { /* ✅ NEW */
    if (!isMobileGestureViewport()) return; /* ✅ NEW */
    if (!event.changedTouches || event.changedTouches.length !== 1) return; /* ✅ REQUIRED FIX */
    if (isAnyMainPopupOpen()) return; /* ✅ NEW */
    if (isInsidePopupElement(mobileGestureStartTarget)) return; /* ✅ NEW */
    if (mobileGestureStartTarget && mobileGestureStartTarget.closest && mobileGestureStartTarget.closest('button, a, input, label, .cta-trigger, .availability-memo')) return; /* ✅ NEW */

    var now = Date.now(); /* ✅ NEW */
    if (now - mobileGestureLastTriggerTime < 700) return; /* ✅ NEW: chống double trigger */

    var deltaY = event.changedTouches[0].clientY - mobileGestureStartY; /* ✅ NEW */
    var deltaX = event.changedTouches[0].clientX - mobileGestureStartX; /* ✅ NEW */

    if (Math.abs(deltaY) <= 60 || Math.abs(deltaY) <= Math.abs(deltaX) * 1.2) return; /* ✅ NEW */

    mobileGestureLastTriggerTime = now; /* ✅ NEW */

    if (deltaY < -60) { /* ✅ NEW */
      openAvailabilityPopup(); /* ✅ NEW */
      mobileFakeHaptic(); /* ✅ NEW */
      return; /* ✅ NEW */
    }

    if (deltaY > 60) { /* ✅ NEW */
      openContactPopup(); /* ✅ NEW */
    }
  }
  function handleContactDragStart(event) { /* ✅ NEW */
    if (!contactPopup || !contactPopup.classList.contains('is-open')) return; /* ✅ NEW */
    if (!event.touches || event.touches.length !== 1) return; /* ✅ REQUIRED FIX */
    contactDragStartY = event.touches[0].clientY; /* ✅ NEW */
    contactDragDeltaY = 0; /* ✅ NEW */
  }
  function handleContactDragMove(event) { /* ✅ NEW */
    if (!contactPopupCard || !contactPopup || !contactPopup.classList.contains('is-open')) return; /* ✅ NEW */
    if (!event.touches || event.touches.length !== 1) return; /* ✅ REQUIRED FIX */
    contactDragDeltaY = Math.max(0, event.touches[0].clientY - contactDragStartY); /* ✅ NEW */
    if (contactDragDeltaY > 0) { /* ✅ NEW */
      contactPopupCard.style.transform = 'translate3d(0,' + Math.round(contactDragDeltaY * 0.45) + 'px,0) scale(1)'; /* ✅ NEW */
    }
  }
  function handleContactDragEnd() { /* ✅ NEW */
    if (!contactPopupCard || !contactPopup || !contactPopup.classList.contains('is-open')) return; /* ✅ NEW */
    if (contactDragDeltaY > 90) { /* ✅ NEW */
      closeContactPopup(); /* ✅ NEW */
    } else {
      contactPopupCard.style.transform = ''; /* ✅ NEW */
    }
    contactDragDeltaY = 0; /* ✅ NEW */
  }
  if (logoTrigger) { /* ✅ NEW */
    logoTrigger.addEventListener('click', function () { /* ✅ NEW */
      openContactPopup(); /* ✅ NEW */
    }); /* ✅ NEW */
    logoTrigger.addEventListener('keydown', function (event) { /* ✅ NEW */
      if (event.key === 'Enter' || event.key === ' ') { /* ✅ NEW */
        event.preventDefault(); /* ✅ NEW */
        openContactPopup(); /* ✅ NEW */
      } /* ✅ NEW */
    }); /* ✅ NEW */
  } /* ✅ NEW */
  if (availabilityMemo) availabilityMemo.addEventListener('click', openAvailabilityPopup); /* ✅ NEW */
  if (availabilityCloseBtn) availabilityCloseBtn.addEventListener('click', closeAvailabilityPopup); /* ✅ NEW */
  if (availabilityContactLink) availabilityContactLink.addEventListener('click', openAvailabilityTourCards); /* ✅ NEW */
  if (availabilityPopup && availabilityPopupCard) { /* ✅ NEW */
    availabilityPopup.addEventListener('click', function (event) { /* ✅ NEW */
      if (!availabilityPopupCard.contains(event.target)) closeAvailabilityPopup(); /* ✅ NEW */
    });
  }
  if (contactCloseBtn) contactCloseBtn.addEventListener('click', closeContactPopup); /* ✅ NEW */
  if (contactPopup && contactPopupCard) { /* ✅ NEW */
    contactPopup.addEventListener('click', function (event) { /* ✅ NEW */
      if (!contactPopupCard.contains(event.target)) closeContactPopup(); /* ✅ NEW */
    });
    contactPopupCard.addEventListener('touchstart', handleContactDragStart, { passive: true }); /* ✅ NEW */
    contactPopupCard.addEventListener('touchmove', handleContactDragMove, { passive: true }); /* ✅ NEW */
    contactPopupCard.addEventListener('touchend', handleContactDragEnd, { passive: true }); /* ✅ NEW */
  }
  document.addEventListener('touchstart', handleMobileGestureStart, { passive: true }); /* ✅ NEW */
  document.addEventListener('touchend', handleMobileGestureEnd, { passive: true }); /* ✅ NEW */
  if (availabilityPrevMonth) { /* ✅ NEW */
    availabilityPrevMonth.addEventListener('click', function () { /* ✅ UPDATED */
      resetAvailabilityDateBounds(false); /* ✅ NEW */
      availabilityViewDate = clampAvailabilityViewDate(new Date(availabilityViewDate.getFullYear(), availabilityViewDate.getMonth() - 1, 1)); /* ✅ UPDATED */
      renderAvailabilityCalendar(); /* ✅ NEW */
    });
  }
  if (availabilityNextMonth) { /* ✅ NEW */
    availabilityNextMonth.addEventListener('click', function () { /* ✅ UPDATED */
      resetAvailabilityDateBounds(false); /* ✅ NEW */
      availabilityViewDate = clampAvailabilityViewDate(new Date(availabilityViewDate.getFullYear(), availabilityViewDate.getMonth() + 1, 1)); /* ✅ UPDATED */
      renderAvailabilityCalendar(); /* ✅ NEW */
    });
  }
  function openPopup() {
    checkbox.checked = true; /* ✅ NEW */
    popup.classList.add('is-open'); /* ✅ NEW */
    popup.setAttribute('aria-hidden', 'false'); /* ✅ NEW */
    document.querySelectorAll('.cta-trigger').forEach(function (el) {
      el.setAttribute('aria-expanded', 'true');
    });
    if (isMobilePopupCarouselMode()) { /* ✅ UPDATED: infinite carousel chỉ dùng cho mobile */
      window.setTimeout(function () { setupInfinitePopupCarousel(true); }, 80); /* ✅ UPDATED: mỗi lần mở popup default ở snorkeling */
      window.setTimeout(requestCenteredPopupCardUpdate, 300); /* ✅ NEW */
    } else if (popupNotes) {
      popupNotes.scrollLeft = 0; /* ✅ NEW */
      updatePopupArrowState(); /* ✅ NEW */
    }
  }
  function closePopup() {
    popup.classList.remove('is-open'); /* ✅ NEW */
    popup.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
    document.querySelectorAll('.cta-trigger').forEach(function (el) {
      el.setAttribute('aria-expanded', 'false');
    });
  }
  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      event.preventDefault();
      openPopup();
    });
    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPopup();
      }
    });
  });
  closeBtn.addEventListener('click', closePopup);
  popup.addEventListener('click', function (event) {
    if (!popupCard.contains(event.target)) {
      closePopup();
    }
  });
  /* ✅ UPDATED: mobile infinite carousel center active card */
  var popupNotes = popup.querySelector('.popup-notes'); /* ✅ NEW */
  var popupArrowPrev = popup.querySelector('.popup-notes-arrow-left'); /* ✅ NEW */
  var popupArrowNext = popup.querySelector('.popup-notes-arrow-right'); /* ✅ NEW */
  var popupNoteItems = []; /* ✅ UPDATED */
  var centerRafId = null; /* ✅ NEW */
  var infiniteLoopWidth = 0; /* ✅ NEW */
  var infiniteMiddleStart = 0; /* ✅ UPDATED: scrollLeft khi card snorkeling nằm giữa */
  var infiniteAfterStart = 0; /* ✅ UPDATED: scrollLeft khi clone sau của snorkeling nằm giữa */
  var isLoopJumping = false; /* ✅ NEW */
  var originalItemCount = 0; /* ✅ NEW */

  function isMobilePopupCarouselMode() { /* ✅ NEW */
    return window.matchMedia('(max-width: 768px)').matches; /* ✅ NEW */
  }

  function getPopupScrollStep() { /* ✅ NEW */
    if (!popupNotes) return 320; /* ✅ REQUIRED FIX */

    var firstItem = popupNotes.querySelector('.popup-note-item:not([data-clone="true"])') || popupNotes.querySelector('.popup-note-item'); /* ✅ NEW */

    if (!firstItem) return Math.max(260, Math.round(popupNotes.clientWidth * 0.72)); /* ✅ REQUIRED FIX */

    var popupNotesStyles = window.getComputedStyle(popupNotes); /* ✅ NEW */
    var popupNotesGap = parseFloat(popupNotesStyles.columnGap || popupNotesStyles.gap || 0) || 0; /* ✅ NEW */

    return Math.round(firstItem.getBoundingClientRect().width + popupNotesGap); /* ✅ NEW */
  }

  function updatePopupArrowState() { /* ✅ NEW */
    if (!popupNotes || !popupArrowPrev || !popupArrowNext) return; /* ✅ REQUIRED FIX */

    if (isMobilePopupCarouselMode()) { /* ✅ NEW */
      popupArrowPrev.disabled = false; /* ✅ NEW */
      popupArrowNext.disabled = false; /* ✅ NEW */
      return; /* ✅ NEW */
    }

    var maxScrollLeft = Math.max(0, popupNotes.scrollWidth - popupNotes.clientWidth); /* ✅ NEW */

    popupArrowPrev.disabled = popupNotes.scrollLeft <= 4; /* ✅ NEW */
    popupArrowNext.disabled = popupNotes.scrollLeft >= maxScrollLeft - 4; /* ✅ NEW */
  }

  function scrollPopupNotes(direction) { /* ✅ NEW */
    if (!popupNotes) return; /* ✅ REQUIRED FIX */

    popupNotes.scrollBy({ left: getPopupScrollStep() * direction, behavior: 'smooth' }); /* ✅ NEW */
  }

  function getOriginalPopupItems() { /* ✅ NEW */
    if (!popupNotes) return []; /* ✅ NEW */
    return Array.prototype.slice.call(popupNotes.querySelectorAll('.popup-note-item:not([data-clone="true"])')); /* ✅ NEW */
  }

  function measureInfinitePopupCarousel(centerFirstItem) { /* ✅ NEW */
    if (!popupNotes || !originalItemCount) return; /* ✅ NEW */

    var originalItems = getOriginalPopupItems(); /* ✅ NEW */
    var firstOriginal = originalItems[0]; /* ✅ NEW */
    var firstAfterClone = popupNotes.children[originalItemCount * 2]; /* ✅ REQUIRED FIX: lấy card đầu tiên của cụm clone sau */

    if (!firstOriginal || !firstAfterClone) return; /* ✅ NEW */

    var notesVisibleCenter = popupNotes.clientWidth / 2; /* ✅ NEW */
    var firstOriginalCenter = firstOriginal.offsetLeft + (firstOriginal.offsetWidth / 2) - popupNotes.offsetLeft; /* ✅ NEW */
    var firstAfterCloneCenter = firstAfterClone.offsetLeft + (firstAfterClone.offsetWidth / 2) - popupNotes.offsetLeft; /* ✅ NEW */

    infiniteMiddleStart = firstOriginalCenter - notesVisibleCenter; /* ✅ UPDATED: boundary dựa trên vị trí centered */
    infiniteAfterStart = firstAfterCloneCenter - notesVisibleCenter; /* ✅ UPDATED: boundary dựa trên vị trí centered */
    infiniteLoopWidth = infiniteAfterStart - infiniteMiddleStart; /* ✅ UPDATED */

    if (centerFirstItem) { /* ✅ NEW */
      popupNotes.scrollLeft = infiniteMiddleStart; /* ✅ UPDATED: default mở ở snorkeling */
    }

    requestCenteredPopupCardUpdate(); /* ✅ NEW */
    updatePopupArrowState(); /* ✅ NEW */
  }

  function setupInfinitePopupCarousel(centerFirstItem) { /* ✅ UPDATED */
    if (!popupNotes) return; /* ✅ NEW */
    if (popupNotes.getAttribute('data-infinite-ready') === 'true') { /* ✅ NEW */
      popupNoteItems = Array.prototype.slice.call(popupNotes.querySelectorAll('.popup-note-item')); /* ✅ UPDATED */
      window.setTimeout(function () { /* ✅ NEW */
        measureInfinitePopupCarousel(centerFirstItem); /* ✅ NEW */
      }, 80); /* ✅ NEW */
      return; /* ✅ NEW */
    }

    var originalItems = Array.prototype.slice.call(popupNotes.querySelectorAll('.popup-note-item')); /* ✅ NEW */
    if (!originalItems.length) return; /* ✅ NEW */

    originalItemCount = originalItems.length; /* ✅ NEW */

    var beforeFragment = document.createDocumentFragment(); /* ✅ NEW */
    var afterFragment = document.createDocumentFragment(); /* ✅ NEW */

    originalItems.forEach(function (item) { /* ✅ NEW */
      var beforeClone = item.cloneNode(true); /* ✅ NEW */
      beforeClone.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
      beforeClone.setAttribute('data-clone', 'true'); /* ✅ NEW */
      beforeFragment.appendChild(beforeClone);

      var afterClone = item.cloneNode(true); /* ✅ NEW */
      afterClone.setAttribute('aria-hidden', 'true'); /* ✅ NEW */
      afterClone.setAttribute('data-clone', 'true'); /* ✅ NEW */
      afterFragment.appendChild(afterClone);
    });

    popupNotes.insertBefore(beforeFragment, popupNotes.firstChild); /* ✅ NEW */
    popupNotes.appendChild(afterFragment); /* ✅ NEW */
    popupNotes.setAttribute('data-infinite-ready', 'true'); /* ✅ NEW */
    popupNoteItems = Array.prototype.slice.call(popupNotes.querySelectorAll('.popup-note-item')); /* ✅ UPDATED */

    window.setTimeout(function () { /* ✅ NEW */
      measureInfinitePopupCarousel(centerFirstItem); /* ✅ NEW */
    }, 80); /* ✅ NEW */
  }

  function syncInfinitePopupCarousel() { /* ✅ NEW */
    if (!isMobilePopupCarouselMode()) return; /* ✅ NEW */
    if (!popupNotes || !infiniteLoopWidth || isLoopJumping) return; /* ✅ NEW */
    var currentScroll = popupNotes.scrollLeft; /* ✅ NEW */
    var safeOffset = 2; /* ✅ NEW */
    if (currentScroll < infiniteMiddleStart - safeOffset) { /* ✅ UPDATED */
      isLoopJumping = true; /* ✅ NEW */
      popupNotes.scrollLeft = currentScroll + infiniteLoopWidth; /* ✅ NEW */
      window.setTimeout(function () { isLoopJumping = false; }, 0); /* ✅ NEW */
    } else if (currentScroll >= infiniteAfterStart - safeOffset) { /* ✅ UPDATED */
      isLoopJumping = true; /* ✅ NEW */
      popupNotes.scrollLeft = currentScroll - infiniteLoopWidth; /* ✅ NEW */
      window.setTimeout(function () { isLoopJumping = false; }, 0); /* ✅ NEW */
    }
  }

  function updateCenteredPopupCard() { /* ✅ NEW */
    if (!popupNotes || !popupNoteItems.length) return; /* ✅ NEW */

    syncInfinitePopupCarousel(); /* ✅ NEW */

    var notesRect = popupNotes.getBoundingClientRect(); /* ✅ NEW */
    var notesCenter = notesRect.left + (notesRect.width / 2); /* ✅ NEW */
    var closestItem = null; /* ✅ NEW */
    var closestDistance = Infinity; /* ✅ NEW */

    popupNoteItems.forEach(function (item) { /* ✅ NEW */
      var itemRect = item.getBoundingClientRect(); /* ✅ NEW */
      var itemCenter = itemRect.left + (itemRect.width / 2); /* ✅ NEW */
      var distance = Math.abs(notesCenter - itemCenter); /* ✅ NEW */

      if (distance < closestDistance) { /* ✅ NEW */
        closestDistance = distance; /* ✅ NEW */
        closestItem = item; /* ✅ NEW */
      }
    });

    popupNoteItems.forEach(function (item) { /* ✅ NEW */
      item.classList.toggle('is-center', item === closestItem); /* ✅ NEW */
    });
  }

  function requestCenteredPopupCardUpdate() { /* ✅ NEW */
    if (centerRafId) return; /* ✅ NEW */
    centerRafId = window.requestAnimationFrame(function () { /* ✅ NEW */
      centerRafId = null; /* ✅ NEW */
      updateCenteredPopupCard(); /* ✅ NEW */
    });
  }

  if (popupArrowPrev) { /* ✅ NEW */
    popupArrowPrev.addEventListener('click', function () { /* ✅ NEW */
      scrollPopupNotes(-1); /* ✅ NEW */
    });
  }

  if (popupArrowNext) { /* ✅ NEW */
    popupArrowNext.addEventListener('click', function () { /* ✅ NEW */
      scrollPopupNotes(1); /* ✅ NEW */
    });
  }

  if (popupNotes) { /* ✅ NEW */
    popupNotes.addEventListener('scroll', function () { /* ✅ UPDATED */
      requestCenteredPopupCardUpdate(); /* ✅ NEW */
      updatePopupArrowState(); /* ✅ NEW */
    }, { passive: true }); /* ✅ UPDATED */
    window.addEventListener('resize', function () { /* ✅ UPDATED */
      window.setTimeout(function () { /* ✅ NEW */
        if (isMobilePopupCarouselMode() && popupNotes.getAttribute('data-infinite-ready') === 'true') {
          measureInfinitePopupCarousel(false); /* ✅ UPDATED: resize chỉ đo lại, không clone thêm */
        }
        updatePopupArrowState(); /* ✅ NEW */
      }, 120); /* ✅ NEW */
    }); /* ✅ UPDATED */
    window.addEventListener('orientationchange', function () { /* ✅ NEW */
      window.setTimeout(function () { /* ✅ NEW */
        if (isMobilePopupCarouselMode() && popupNotes.getAttribute('data-infinite-ready') === 'true') {
          measureInfinitePopupCarousel(false); /* ✅ UPDATED */
        }
        updatePopupArrowState(); /* ✅ NEW */
      }, 250); /* ✅ NEW */
    }); /* ✅ NEW */
  }
  updatePopupArrowState(); /* ✅ NEW */
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && popup.classList.contains('is-open')) {
      closePopup();
    }
    if (event.key === 'Escape' && availabilityPopup && availabilityPopup.classList.contains('is-open')) { /* ✅ NEW */
      closeAvailabilityPopup(); /* ✅ NEW */
    }
    if (event.key === 'Escape' && contactPopup && contactPopup.classList.contains('is-open')) { /* ✅ NEW */
      closeContactPopup(); /* ✅ NEW */
    }
  });
})();
