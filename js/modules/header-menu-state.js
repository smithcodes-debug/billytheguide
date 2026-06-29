/* =====================================================
  ✅ NEW: MODULE 16 — HEADER MENU STATE MODULE
  FILE: ./js/modules/header-menu-state.js

  PART OF PAGE SYSTEM:
  - HTML page: index.html
  - Visual module: MODULE 02 — HEADER SYSTEM
  - Header sub-module: MODULE 02.3 — HEADER MENU TRIGGER
  - Script module: MODULE 16 — HEADER MENU STATE MODULE
  - This file replaces the old inline script that previously lived near the end of index.html.

  MAIN PURPOSE:
  - Find the global header menu button using the selector `.menu-trigger`.
  - Toggle the button attribute `aria-expanded` between "true" and "false" when the button is clicked.
  - Preserve an accessibility-ready state for the current/future menu system.

  IMPORTANT SCOPE LIMITATION:
  - This module does NOT open a visual menu panel.
  - This module does NOT close overlays or popups.
  - This module does NOT change header layout, z-index, fixed positioning, logo, search, or menu SVG.
  - This module only manages `aria-expanded` state on `.menu-trigger`.

  TARGET HTML SELECTOR:
  - .menu-trigger

  REQUIRED HTML ATTRIBUTE:
  - aria-expanded="false" should exist on `.menu-trigger` in the initial HTML.

  BEHAVIOR:
  - If `.menu-trigger` is missing, the module exits safely.
  - On each click:
    - current aria-expanded="false" becomes "true".
    - current aria-expanded="true" becomes "false".

  WHY THIS EXISTS AS A SEPARATE MODULE:
  - Header behavior is global and should stay isolated from tour popup logic.
  - This prevents coupling with MODULE 15 tour card links and MODULE 17 mobile typewriter.
  - Future menu UI can build on this state without touching unrelated scripts.

  IMMUTABLE / SAFETY RULES:
  - Do not rename `.menu-trigger` unless the matching HTML is explicitly updated.
  - Do not remove `aria-expanded`; it is used for accessibility state.
  - Do not add menu-opening layout logic here unless a separate menu module step is confirmed.
  - Header is protected: it must stay visible above all page content.
===================================================== */

(function initHeaderMenuState() {
  const menuTrigger = document.querySelector('.menu-trigger');

  if (!menuTrigger) return;

  menuTrigger.addEventListener('click', function () {
    menuTrigger.setAttribute('aria-expanded', menuTrigger.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
  });
}());
