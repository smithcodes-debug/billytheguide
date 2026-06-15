export function initNavigation() {
  document.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-nav');
      if (url) window.location.href = url;
    });
  });
}
