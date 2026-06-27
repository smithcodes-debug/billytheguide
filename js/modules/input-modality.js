/* =====================================================
  ✅ NEW: MODULE — INPUT MODALITY SYSTEM
  FILE: ./js/modules/input-modality.js

  PURPOSE:
  - Detect the user's latest real input method.
  - Separate display/layout mode from interaction/input mode.
  - Desktop/touchscreen desktop still keeps the 768px app shell from CSS.
  - Input mode decides whether interaction should behave like mouse/trackpad or touch.

  CONFIRMED PROJECT RULES:
  - Display shell remains owned by:
    ./css/modules/00-display-shell.css
  - Touchscreen desktop must still keep app shell width 768px.
  - Last input wins:
    - wheel / mouse / trackpad => html[data-input-mode="mouse"]
    - touch / direct screen touch => html[data-input-mode="touch"]
  - Trackpad counts as mouse because it emits wheel-style desktop scrolling.
  - Touch mode enables future mobile-style interaction areas:
    A. scroll behavior / swipe gesture
    C. popup swipe/back gesture
    D. home feed snap / scroll lock
  - Keyboard input does not change the current mode.

  PUBLIC STATE:
  - document.documentElement.dataset.inputMode
  - Expected values:
    - "mouse"
    - "touch"

  PUBLIC EVENT:
  - Dispatches a CustomEvent when mode changes:
    billy:input-modality-change
  - event.detail:
    {
      mode: "mouse" | "touch",
      previousMode: "mouse" | "touch" | "",
      source: string,
      pointerType: string,
      timestamp: number
    }

  INTEGRATION NOTES:
  - CSS can target:
    html[data-input-mode="touch"] .some-selector { ... }
    html[data-input-mode="mouse"] .some-selector { ... }
  - JS modules can read:
    document.documentElement.dataset.inputMode
  - JS modules can listen:
    window.addEventListener("billy:input-modality-change", handler)

  RESPONSIBILITY BOUNDARY:
  - This module does NOT change layout width.
  - This module does NOT change the 768px desktop shell.
  - This module does NOT style components.
  - This module does NOT control popup/home/gesture behavior directly.
  - It only exposes the latest input mode for other modules to consume.

  DEBUG FIRST HERE IF:
  - Touchscreen desktop does not switch to touch interaction after tapping/swiping.
  - Trackpad scroll is incorrectly treated as touch.
  - Mouse wheel does not switch back to mouse mode.
  - html[data-input-mode] is missing or wrong.

  CURRENT STEP:
  - This file is self-contained and safe to create now.
  - index.html is NOT updated in this step.
  - project-debug-routing-system.json is NOT updated in this step.
===================================================== */

const INPUT_MODE_MOUSE = "mouse"; /* ✅ NEW */
const INPUT_MODE_TOUCH = "touch"; /* ✅ NEW */
const INPUT_MODE_EVENT = "billy:input-modality-change"; /* ✅ NEW */
const INIT_FLAG = "inputModalityInitialized"; /* ✅ NEW */

let cleanupController = null; /* ✅ NEW */

/* ✅ NEW: Safe root getter to keep the module defensive during early load. */
function getRootElement() {
  return document.documentElement;
}

/* ✅ NEW: Touch-only devices should start as touch; hybrid/desktop starts as mouse until real touch happens. */
function getInitialInputMode() {
  const hasTouchPoint = typeof navigator !== "undefined" && Number(navigator.maxTouchPoints || 0) > 0;
  const isCoarsePrimaryPointer =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  return hasTouchPoint && isCoarsePrimaryPointer ? INPUT_MODE_TOUCH : INPUT_MODE_MOUSE;
}

/* ✅ NEW: Normalize only supported public modes. */
function normalizeInputMode(mode) {
  return mode === INPUT_MODE_TOUCH ? INPUT_MODE_TOUCH : INPUT_MODE_MOUSE;
}

/* ✅ NEW: Set html[data-input-mode] and notify only when value actually changes. */
function setInputMode(mode, meta = {}) {
  const root = getRootElement();
  const nextMode = normalizeInputMode(mode);
  const previousMode = root.dataset.inputMode || "";

  if (previousMode === nextMode) {
    return nextMode;
  }

  root.dataset.inputMode = nextMode;

  window.dispatchEvent(
    new CustomEvent(INPUT_MODE_EVENT, {
      detail: {
        mode: nextMode,
        previousMode,
        source: meta.source || "unknown",
        pointerType: meta.pointerType || "",
        timestamp: Date.now()
      }
    })
  );

  return nextMode;
}

/* ✅ NEW: Pointer events cover modern mouse/touch/pen devices. */
function handlePointerDown(event) {
  if (!event || !event.pointerType) {
    return;
  }

  if (event.pointerType === "touch") {
    setInputMode(INPUT_MODE_TOUCH, {
      source: "pointerdown",
      pointerType: "touch"
    });
    return;
  }

  if (event.pointerType === "mouse") {
    setInputMode(INPUT_MODE_MOUSE, {
      source: "pointerdown",
      pointerType: "mouse"
    });
    return;
  }

  /* ✅ NEW: Pen is direct-screen style input, so keep it closer to touch behavior. */
  if (event.pointerType === "pen") {
    setInputMode(INPUT_MODE_TOUCH, {
      source: "pointerdown",
      pointerType: "pen"
    });
  }
}

/* ✅ NEW: iOS/Safari fallback and direct touch-scroll detection. */
function handleTouchStart() {
  setInputMode(INPUT_MODE_TOUCH, {
    source: "touchstart",
    pointerType: "touch"
  });
}

/* ✅ NEW: Wheel is mouse-mode by project rule; trackpad also emits wheel and must count as mouse. */
function handleWheel() {
  setInputMode(INPUT_MODE_MOUSE, {
    source: "wheel",
    pointerType: "mouse"
  });
}

/* ✅ NEW: Keyboard must not change input mode. This handler is intentionally empty for documentation. */
function handleKeyDown() {
  /* no-op by design */
}

/* ✅ NEW: Initialize once. Safe to call multiple times from main.js or direct module import. */
export function initInputModality() {
  const root = getRootElement();

  if (root.dataset[INIT_FLAG] === "true") {
    return destroyInputModality;
  }

  root.dataset[INIT_FLAG] = "true";

  if (!root.dataset.inputMode) {
    root.dataset.inputMode = getInitialInputMode();
  }

  cleanupController = typeof AbortController !== "undefined" ? new AbortController() : null;
  const listenerOptions = cleanupController
    ? { passive: true, capture: true, signal: cleanupController.signal }
    : { passive: true, capture: true };

  window.addEventListener("pointerdown", handlePointerDown, listenerOptions);
  window.addEventListener("touchstart", handleTouchStart, listenerOptions);
  window.addEventListener("wheel", handleWheel, listenerOptions);
  window.addEventListener("keydown", handleKeyDown, listenerOptions);

  return destroyInputModality;
}

/* ✅ NEW: Cleanup helper for future tests or route-level teardown. */
export function destroyInputModality() {
  const root = getRootElement();

  if (cleanupController) {
    cleanupController.abort();
    cleanupController = null;
  } else {
    window.removeEventListener("pointerdown", handlePointerDown, true);
    window.removeEventListener("touchstart", handleTouchStart, true);
    window.removeEventListener("wheel", handleWheel, true);
    window.removeEventListener("keydown", handleKeyDown, true);
  }

  delete root.dataset[INIT_FLAG];
}

/* ✅ NEW: Read helper for other modules. */
export function getInputMode() {
  return getRootElement().dataset.inputMode || getInitialInputMode();
}

/* ✅ NEW: Public constants for low-coupling imports. */
export const INPUT_MODALITY = Object.freeze({
  MOUSE: INPUT_MODE_MOUSE,
  TOUCH: INPUT_MODE_TOUCH,
  CHANGE_EVENT: INPUT_MODE_EVENT
});
