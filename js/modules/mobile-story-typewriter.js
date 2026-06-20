/* =====================================================
  ✅ NEW: MODULE 17 — MOBILE STORY TYPEWRITER MODULE
  FILE: ./js/modules/mobile-story-typewriter.js

  PART OF PAGE SYSTEM:
  - HTML page: index.html
  - Visual module: MODULE 05 — HERO MODULE
  - Hero sub-module: 05-hero-story
  - Script module: MODULE 17 — MOBILE STORY TYPEWRITER MODULE
  - This file replaces the old inline script that previously lived near the end of index.html.

  MAIN PURPOSE:
  - Run a typewriter effect for the hero story paragraph on mobile screens only.
  - Keep desktop story rendering untouched.
  - Preserve the original story text from the HTML instead of hardcoding or rewriting it in JavaScript.

  TARGET HTML SELECTORS:
  - .story
  - .story p

  MOBILE-ONLY CONDITION:
  - This module only runs when the viewport matches: (max-width: 768px)
  - If the page is opened on desktop/tablet width above 768px, this module exits safely.

  STORY TEXT SOURCE:
  - The full story is read from `.story p` using textContent.trim().
  - Do not move the story text into this JS file.
  - Do not rewrite the story text in this JS file.
  - The HTML remains the source of truth for all visible copy.

  MOTION / ACCESSIBILITY BEHAVIOR:
  - If the user has `prefers-reduced-motion: reduce`, the full story is shown immediately.
  - In reduced motion mode, the module still applies the final state classes so CSS can display the completed state consistently.

  CSS CLASSES CONTROLLED BY THIS MODULE:
  - is-story-typewriter-pending
  - is-story-typewriter-active
  - is-story-typewriter-done

  CONFIG VALUES:
  - STORY_TYPEWRITER_MOBILE_QUERY = '(max-width: 768px)'
  - STORY_TYPEWRITER_DELAY = 35

  IMPORTANT SCOPE LIMITATION:
  - This module does NOT edit hero layout.
  - This module does NOT edit header layout.
  - This module does NOT edit tour popup behavior.
  - This module does NOT edit booking/calendar behavior.
  - This module does NOT edit contact/about popup behavior.
  - This module only controls mobile story text rendering inside MODULE 05.

  IMMUTABLE / SAFETY RULES:
  - Do not change `.story` or `.story p` selectors unless the matching HTML is explicitly updated.
  - Do not replace the original story text with hardcoded JS text.
  - Do not run this effect on desktop unless a separate confirmed step requests it.
  - Do not change delay/config values unless requested.
===================================================== */

(function initMobileStoryTypewriter() {
  const STORY_TYPEWRITER_MOBILE_QUERY = '(max-width: 768px)';
  const STORY_TYPEWRITER_DELAY = 35;

  const story = document.querySelector('.story');
  const storyParagraph = story ? story.querySelector('p') : null;

  if (!story || !storyParagraph) return;
  if (!window.matchMedia(STORY_TYPEWRITER_MOBILE_QUERY).matches) return;
  if (story.dataset.typewriterInitialized === 'true') return;

  story.dataset.typewriterInitialized = 'true';

  const fullStoryText = storyParagraph.textContent.trim();

  if (!fullStoryText) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    storyParagraph.textContent = fullStoryText;
    story.classList.add('is-story-typewriter-active', 'is-story-typewriter-done');
    return;
  }

  let currentIndex = 0;

  story.classList.add('is-story-typewriter-pending');
  storyParagraph.textContent = '';

  window.requestAnimationFrame(function () {
    story.classList.remove('is-story-typewriter-pending');
    story.classList.add('is-story-typewriter-active');

    const typeNextCharacter = function () {
      currentIndex += 1;
      storyParagraph.textContent = fullStoryText.slice(0, currentIndex);

      if (currentIndex < fullStoryText.length) {
        window.setTimeout(typeNextCharacter, STORY_TYPEWRITER_DELAY);
        return;
      }

      story.classList.add('is-story-typewriter-done');
    };

    window.setTimeout(typeNextCharacter, STORY_TYPEWRITER_DELAY);
  });
}());
