export function initGesture() {
  const root = document.documentElement;

  if (root.dataset.gestureInitialized === 'true') return;
  root.dataset.gestureInitialized = 'true';

  const EDGE_BACK_ZONE = 28;
  const EDGE_BACK_TRIGGER_DISTANCE = 64;
  const EDGE_BACK_INTENT_DISTANCE = 12;

  const HERO_RELOAD_TRIGGER_DISTANCE = 92;
  const HERO_RELOAD_INTENT_DISTANCE = 16;

  const DOMINANCE_RATIO = 1.25;

  let startX = 0;
  let startY = 0;
  let startTarget = null;
  let isSingleTouch = false;
  let isEdgeBackCandidate = false;
  let isHeroReloadCandidate = false;
  let hasLockedGesture = false;
  let lockedGesture = '';

  function isInteractiveElement(target) {
    if (!target || !target.closest) return false;

    return Boolean(
      target.closest(
        'a, button, input, textarea, select, option, label, summary, [role="button"], [role="link"], [contenteditable="true"]'
      )
    );
  }

  function isInsideHero(target) {
    return Boolean(target && target.closest && target.closest('.hero'));
  }

  function isHorizontalIntent(deltaX, deltaY) {
    return Math.abs(deltaX) > Math.abs(deltaY) * DOMINANCE_RATIO;
  }

  function isVerticalDownIntent(deltaX, deltaY) {
    return deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX) * DOMINANCE_RATIO;
  }

  function preventIfCancelable(event) {
    if (event && event.cancelable) {
      event.preventDefault();
    }
  }

  function resetGestureState() {
    startX = 0;
    startY = 0;
    startTarget = null;
    isSingleTouch = false;
    isEdgeBackCandidate = false;
    isHeroReloadCandidate = false;
    hasLockedGesture = false;
    lockedGesture = '';
  }

  function handleTouchStart(event) {
    if (!event.touches || event.touches.length !== 1) {
      resetGestureState();
      return;
    }

    const touch = event.touches[0];

    startX = touch.clientX;
    startY = touch.clientY;
    startTarget = event.target;
    isSingleTouch = true;
    hasLockedGesture = false;
    lockedGesture = '';

    isEdgeBackCandidate = startX <= EDGE_BACK_ZONE;

    isHeroReloadCandidate =
      isInsideHero(startTarget) && !isInteractiveElement(startTarget);
  }

  function handleTouchMove(event) {
    if (!isSingleTouch || !event.touches || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (!hasLockedGesture && isEdgeBackCandidate) {
      const isRightSwipe = deltaX > EDGE_BACK_INTENT_DISTANCE;
      const hasHorizontalIntent = isHorizontalIntent(deltaX, deltaY);

      if (isRightSwipe && hasHorizontalIntent) {
        hasLockedGesture = true;
        lockedGesture = 'edge-back';
      }
    }

    if (!hasLockedGesture && isHeroReloadCandidate) {
      const hasDownIntent =
        deltaY > HERO_RELOAD_INTENT_DISTANCE &&
        isVerticalDownIntent(deltaX, deltaY);

      if (hasDownIntent) {
        hasLockedGesture = true;
        lockedGesture = 'hero-reload';
      }
    }

    if (lockedGesture === 'edge-back' || lockedGesture === 'hero-reload') {
      preventIfCancelable(event);
    }

    if (
      isEdgeBackCandidate &&
      deltaX > EDGE_BACK_INTENT_DISTANCE &&
      absDeltaX > absDeltaY * DOMINANCE_RATIO
    ) {
      preventIfCancelable(event);
    }

    if (
      isHeroReloadCandidate &&
      deltaY > HERO_RELOAD_INTENT_DISTANCE &&
      absDeltaY > absDeltaX * DOMINANCE_RATIO
    ) {
      preventIfCancelable(event);
    }
  }

  function handleTouchEnd(event) {
    if (!isSingleTouch || !event.changedTouches || event.changedTouches.length !== 1) {
      resetGestureState();
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    const shouldGoBack =
      isEdgeBackCandidate &&
      deltaX >= EDGE_BACK_TRIGGER_DISTANCE &&
      absDeltaX > absDeltaY * DOMINANCE_RATIO;

    if (shouldGoBack) {
      preventIfCancelable(event);
      resetGestureState();
      window.history.back();
      return;
    }

    const shouldReloadHero =
      isHeroReloadCandidate &&
      deltaY >= HERO_RELOAD_TRIGGER_DISTANCE &&
      absDeltaY > absDeltaX * DOMINANCE_RATIO;

    if (shouldReloadHero) {
      preventIfCancelable(event);
      resetGestureState();
      window.location.reload();
      return;
    }

    resetGestureState();
  }

  function handleTouchCancel() {
    resetGestureState();
  }

  document.addEventListener('touchstart', handleTouchStart, {
    passive: true,
    capture: true
  });

  document.addEventListener('touchmove', handleTouchMove, {
    passive: false,
    capture: true
  });

  document.addEventListener('touchend', handleTouchEnd, {
    passive: false,
    capture: true
  });

  document.addEventListener('touchcancel', handleTouchCancel, {
    passive: true,
    capture: true
  });
}