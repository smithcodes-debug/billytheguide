const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const previewCards = document.querySelectorAll(".js-preview-card");

let lastInputMode = "mouse";

const clearPreviewCards = (exceptCard = null) => {
  previewCards.forEach((card) => {
    if (card !== exceptCard) {
      card.classList.remove("is-preview");
    }
  });
};

const goToTarget = (targetSelector) => {
  if (!targetSelector) {
    return;
  }

  const target = document.querySelector(targetSelector);

  if (!target) {
    return;
  }

  clearPreviewCards();

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
};

window.addEventListener(
  "pointerdown",
  (event) => {
    if (event.pointerType === "touch" || event.pointerType === "pen") {
      lastInputMode = "touch";
      document.documentElement.dataset.inputMode = "touch";
      return;
    }

    if (event.pointerType === "mouse") {
      lastInputMode = "mouse";
      document.documentElement.dataset.inputMode = "mouse";
    }
  },
  { passive: true }
);

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ✅ NEW */
previewCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    const targetSelector = card.dataset.previewTarget;

    if (lastInputMode === "touch") {
      if (!card.classList.contains("is-preview")) {
        event.preventDefault();
        clearPreviewCards(card);
        card.classList.add("is-preview");
        return;
      }

      goToTarget(targetSelector);
      return;
    }

    goToTarget(targetSelector);
  });

  card.addEventListener("keydown", (event) => {
    const targetSelector = card.dataset.previewTarget;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goToTarget(targetSelector);
    }

    if (event.key === "Escape") {
      card.classList.remove("is-preview");
    }
  });
});

/* ✅ NEW */
document.addEventListener("click", (event) => {
  const clickedPreviewCard = event.target.closest(".js-preview-card");

  if (!clickedPreviewCard) {
    clearPreviewCards();
  }
});
