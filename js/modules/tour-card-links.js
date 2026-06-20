/* =====================================================
  ✅ NEW: MODULE 15 — TOUR CARD LINKS MODULE
  FILE: ./js/modules/tour-card-links.js

  PART OF PAGE SYSTEM:
  - HTML page: index.html
  - Visual module: MODULE 09 — TOUR SELECTION POPUP MODULE
  - Script module: MODULE 15 — TOUR CARD LINKS MODULE
  - This file replaces the old inline script that previously lived near the end of index.html.

  MAIN PURPOSE:
  - Attach click + keyboard navigation behavior to tour cards inside the Leave no trace / tour selection popup.
  - Convert selected popup cards into direct landing-page links.
  - Keep the HTML cleaner so debugging index.html is faster.

  TARGET HTML SELECTOR:
  - .popup-note-item[data-tour]

  SUPPORTED data-tour VALUES IN THIS MODULE:
  - diving            -> ./diving-island-phu-quoc.html
  - hiking            -> ./hiking-mountain-phu-quoc.html
  - propose           -> ./propose-island-phu-quoc.html
  - camping           -> ./camping-island-phu-quoc.html
  - coralDictionary   -> ./coral-dictionary-at-phu-quoc.html

  IMPORTANT EXCLUSION:
  - data-tour="snorkeling" is intentionally NOT handled here.
  - Snorkeling keeps its existing separate navigation handler in the current external navigation flow.
  - Do not add snorkeling here unless the snorkeling module is explicitly merged later.

  CURRENT LIMITATION / DEBUG NOTE:
  - data-tour="phuQuocTipAndTrick" exists in the HTML popup card list.
  - It is not mapped here yet because the previous inline script did not map it.
  - This step preserves existing behavior and does not invent a new destination URL.

  ACCESSIBILITY BEHAVIOR:
  - Mouse / touch: click opens the mapped landing page.
  - Keyboard: Enter or Space opens the mapped landing page.

  IMMUTABLE / SAFETY RULES:
  - Do not rename .popup-note-item.
  - Do not rename data-tour values unless the matching HTML is also explicitly updated.
  - Do not change landing-page URLs unless requested.
  - Do not move snorkeling behavior into this file without a separate confirmed step.
===================================================== */

(function initTourCardLinks() {
  const tourLinks = {
    diving: "./diving-island-phu-quoc.html",
    hiking: "./hiking-mountain-phu-quoc.html",
    propose: "./propose-island-phu-quoc.html",
    camping: "./camping-island-phu-quoc.html",
    coralDictionary: "./coral-dictionary-at-phu-quoc.html"
  };

  document.querySelectorAll('.popup-note-item[data-tour]').forEach((card) => {
    const tour = card.dataset.tour;

    if (tour === "snorkeling") return;
    if (!tourLinks[tour]) return;

    card.style.cursor = "pointer";

    const goToTourPage = () => {
      window.location.href = tourLinks[tour];
    };

    card.addEventListener('click', goToTourPage);

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        goToTourPage();
      }
    });
  });
}());
