import { initRuntimeBoot } from './runtime/runtime-boot.js';
import { reportRuntimeFailure, reportRuntimeOk } from './runtime/runtime-health.js';
import { initNavigation } from './ui/navigation.js';
import { initContactPopup } from './ui/contact-popup.js';
import { initPolicyPopup } from './ui/policy-popup.js';
import { initTourCarousel } from './ui/tour-carousel.js';
import { initAvailabilityPopup } from './modules/booking.js';
import { initSearchPopup } from './ui/search-popup.js';
import { initProgressiveImageLoader } from './modules/progressive-image-loader.js';
import { initGalleryWithUs } from './modules/gallery-with-us.js';
import { initWaterForecast } from './modules/water-forecast.js';
import { initSiteFooter } from './modules/site-footer.js';
import { initDebugSiteReset } from './modules/debug-site-reset.js';

const APP_LOADING_CLASS = 'js-loading';
const APP_READY_CLASS = 'js-ready';

function initHomePopup() {
  const popup = document.getElementById('leave-no-trace-popup');
  const popupCard = popup ? popup.querySelector('.popup-card') : null;
  const closeBtn = popup ? popup.querySelector('.popup-close') : null;
  const OPEN_HOME_TOUR_POPUP_EVENT = 'billy:open-home-tour-popup';

  if (!popup || !popupCard || !closeBtn) return;

  function getTriggers() {
    return Array.prototype.slice.call(document.querySelectorAll('.cta-trigger'));
  }

  function syncTriggerState(expanded) {
    getTriggers().forEach(function (trigger) {
      trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');

      trigger.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
        input.checked = expanded;
      });
    });
  }

  function openPopup() {
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    syncTriggerState(true);
  }

  function closePopup() {
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    syncTriggerState(false);
  }

  document.addEventListener('click', function (event) {
    const trigger = event.target && event.target.closest
      ? event.target.closest('.cta-trigger')
      : null;

    if (!trigger) return;

    event.preventDefault();
    openPopup();
  });

  document.addEventListener('keydown', function (event) {
    const trigger = event.target && event.target.closest
      ? event.target.closest('.cta-trigger')
      : null;

    if (!trigger) {
      if (event.key === 'Escape' && popup.classList.contains('is-open')) {
        closePopup();
      }

      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPopup();
    }
  });

  window.addEventListener(OPEN_HOME_TOUR_POPUP_EVENT, openPopup);

  closeBtn.addEventListener('click', closePopup);

  popup.addEventListener('click', function (event) {
    if (!popupCard.contains(event.target)) {
      closePopup();
    }
  });
}

function initMobileHomeFeed() {
  const MOBILE_TABLET_MAX_WIDTH = 1024;
  const DESKTOP_MIN_WIDTH = 1025;
  const HOME_SECTION_SELECTOR = '.more-stories-section';
  const SOURCE_INNER_SELECTOR = '.more-stories-inner';
  const FEED_CLASS = 'mobile-home-feed';
  const FEED_READY_CLASS = 'is-mobile-home-feed-ready';
  const DESKTOP_NORMAL_SCROLL_CLASS = 'is-desktop-home-feed-normal-scroll';
  const SNAP_CLASS = 'mobile-home-feed-snap';
  const FEED_ENDING_CLASS = 'is-feed-ending';
  const LAST_CARD_CLASS = 'mobile-home-feed-panel-last';
  const LAST_CARD_VISIBLE_RATIO = 0.58;
  const MAX_FEED_CARDS = 10;
  const FAQ_CARD_NUMBER = '09';

  const homeSection = document.querySelector(HOME_SECTION_SELECTOR);
  const sourceInner = homeSection ? homeSection.querySelector(SOURCE_INNER_SELECTOR) : null;

  if (!homeSection || !sourceInner) return;
  if (homeSection.querySelector('.' + FEED_CLASS)) return;

  let activeCardFrame = 0;
  let isSnapActivated = false;
  let lastPanel = null;
  let lastCardNumber = '01';

  function isMobileTabletViewport() {
    return window.innerWidth <= MOBILE_TABLET_MAX_WIDTH;
  }

  function isDesktopViewport() {
    return window.innerWidth >= DESKTOP_MIN_WIDTH;
  }

  function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (typeof textContent === 'string') {
      element.textContent = textContent;
    }

    return element;
  }

  function cloneForMobileFeed(sourceNode) {
    const clone = sourceNode.cloneNode(true);

    clone.querySelectorAll('[id]').forEach(function (node) {
      node.removeAttribute('id');
    });

    if (clone.hasAttribute && clone.hasAttribute('id')) {
      clone.removeAttribute('id');
    }

    clone.querySelectorAll('details').forEach(function (details) {
      details.setAttribute('open', '');
    });

    return clone;
  }

  function createMainHeroNode() {
    const heroNode = createElement('div', 'mobile-home-feed-main-hero');
    const tagline = createElement('div', 'hero-guide-tagline mobile-home-feed-main-hero-tagline', '• professional Phu Quoc local guide team.');
    const title = createElement('h1', 'title mobile-home-feed-main-hero-title');
    const titleLineOne = createElement('span', 'title-mobile-line title-mobile-line-1', 'Khám phá');
    const titleLineTwo = createElement('span', 'title-mobile-line title-mobile-line-2', '"Phú Quốc Của Tôi"');
    const story = createElement('div', 'story mobile-home-feed-main-hero-story');
    const storyText = createElement('p');
    const ctaRow = createElement('div', 'cta-row mobile-home-feed-main-hero-cta');
    const quote = createElement('span', 'quote cta-trigger');
    const quoteStart = createElement('span', '', "let's...");
    const checkboxLabel = createElement('label', 'checkbox');
    const checkboxInput = document.createElement('input');
    const fakeBox = createElement('span', 'fake-box');
    const quoteEnd = createElement('span', '', '"Leave no trace"');
    const thanks = createElement('span', 'thanks cta-trigger', 'Cảm ơn bạn ❤️');

    storyText.textContent = 'Xin chào! I am Bill, Billy the Bill .Tôi sinh ra và lớn lên ở vùng đất Phú Quốc thân yêu này, từ bé theo cha đánh bắt trên từng ngóc ngách của rạn san hô ở Phú Quốc. Mỗi ngày khi nhìn thấy những nhà làm tour thiếu ý thức đã làm tổn hại đến vẻ đẹp tự nhiên này… tôi tin rằng chúng ta không cần thiết phải đánh đổi giữa du lịch và môi trường… Bạn có muốn cùng tôi..';

    checkboxInput.type = 'checkbox';

    quote.setAttribute('role', 'button');
    quote.setAttribute('tabindex', '0');
    quote.setAttribute('aria-controls', 'leave-no-trace-popup');
    quote.setAttribute('aria-expanded', 'false');

    thanks.setAttribute('role', 'button');
    thanks.setAttribute('tabindex', '0');
    thanks.setAttribute('aria-controls', 'leave-no-trace-popup');
    thanks.setAttribute('aria-expanded', 'false');

    title.appendChild(titleLineOne);
    title.appendChild(titleLineTwo);

    story.appendChild(storyText);

    checkboxLabel.appendChild(checkboxInput);
    checkboxLabel.appendChild(fakeBox);

    quote.appendChild(quoteStart);
    quote.appendChild(checkboxLabel);
    quote.appendChild(quoteEnd);

    ctaRow.appendChild(quote);
    ctaRow.appendChild(thanks);

    heroNode.appendChild(tagline);
    heroNode.appendChild(title);
    heroNode.appendChild(story);
    heroNode.appendChild(ctaRow);

    return heroNode;
  }

  const CARD_02_ZIPPER_STEPS = [
    {
      title: 'No crowd, just breathing space',
      copy: 'We keep the route personal, slower, and away from rushed crowded stops whenever sea conditions allow.'
    },
    {
      title: 'Underwater guide beside you',
      copy: 'A local guide stays close in the water, helping you move calmly and notice coral, fish, current, and safe entry points.'
    },
    {
      title: 'Kid + disabled friendly pace',
      copy: 'The experience can slow down for families, beginners, nervous swimmers, and guests who need extra time or support.'
    },
    {
      title: 'HD glass for clearer viewing',
      copy: 'Simple comfort matters. Good mask fit and clearer viewing help guests enjoy the reef without fighting equipment.'
    },
    {
      title: 'Current controlled planning',
      copy: 'The route should follow real water movement, wind, visibility, and safety, not a fixed tourist timetable.'
    },
    {
      title: 'Media with you',
      copy: 'When conditions are suitable, we help capture the moment so the memory stays with you after the trip.'
    },
    {
      title: 'Quiet island rhythm',
      copy: 'Some days are for snorkeling, some days are for resting, camping, or simply moving with the island weather.'
    },
    {
      title: 'Leave no trace mindset',
      copy: 'We avoid touching coral, chasing wildlife, leaving trash, or turning a natural place into a shopping route.'
    },
    {
      title: 'Private Phu Quoc feeling',
      copy: 'The goal is not to do more things faster. The goal is to discover Phu Quoc in a calmer, more human way.'
    }
  ];
  function createCard02ZipperNode() {
    const module = createElement('section', 'mobile-home-feed-card-02-zipper-module');
    const viewport = createElement('div', 'mobile-home-feed-card-02-zipper-pages');
    const control = createElement('div', 'mobile-home-feed-card-02-zipper-control');
    const label = createElement('div', 'mobile-home-feed-card-02-zipper-label', 'Pull the zipper from right to left');
    const track = createElement('div', 'mobile-home-feed-card-02-zipper-track');
    const fill = createElement('div', 'mobile-home-feed-card-02-zipper-fill');
    const teeth = createElement('div', 'mobile-home-feed-card-02-zipper-teeth');
    const handle = createElement('button', 'mobile-home-feed-card-02-zipper-handle');
    const handleIcon = createElement('span', 'mobile-home-feed-card-02-zipper-handle-icon');
    module.setAttribute('data-zipper-step', '0');
    module.style.setProperty('--zipper-progress', '0');
    viewport.setAttribute('aria-live', 'polite');
    CARD_02_ZIPPER_STEPS.forEach(function (item, index) {
      const page = createElement('article', 'mobile-home-feed-card-02-zipper-page');
      const pageNumber = createElement('span', 'mobile-home-feed-card-02-zipper-page-number', String(index + 1).padStart(2, '0'));
      const title = createElement('h3', 'mobile-home-feed-card-02-zipper-page-title', item.title);
      const copy = createElement('p', 'mobile-home-feed-card-02-zipper-page-copy', item.copy);
      page.setAttribute('data-zipper-page', String(index + 1));
      page.setAttribute('aria-hidden', 'true');
      page.appendChild(pageNumber);
      page.appendChild(title);
      page.appendChild(copy);
      viewport.appendChild(page);
    });
    control.setAttribute('role', 'slider');
    control.setAttribute('tabindex', '0');
    control.setAttribute('aria-label', 'Card 2 zipper story progress');
    control.setAttribute('aria-valuemin', '0');
    control.setAttribute('aria-valuemax', String(CARD_02_ZIPPER_STEPS.length));
    control.setAttribute('aria-valuenow', '0');
    control.setAttribute('aria-valuetext', 'Zipper closed');
    handle.type = 'button';
    handle.setAttribute('aria-label', 'Drag zipper');
    handle.setAttribute('tabindex', '-1');
    handle.appendChild(handleIcon);
    track.appendChild(fill);
    track.appendChild(teeth);
    track.appendChild(handle);
    control.appendChild(label);
    control.appendChild(track);
    module.appendChild(viewport);
    module.appendChild(control);
    return module;
  }
  function initCard02ZipperInteraction(root) {
    const module = root ? root.querySelector('.mobile-home-feed-card-02-zipper-module') : null;
    const control = module ? module.querySelector('.mobile-home-feed-card-02-zipper-control') : null;
    const track = module ? module.querySelector('.mobile-home-feed-card-02-zipper-track') : null;
    const handle = module ? module.querySelector('.mobile-home-feed-card-02-zipper-handle') : null;
    const pages = module ? Array.from(module.querySelectorAll('.mobile-home-feed-card-02-zipper-page')) : [];
    if (!module || !control || !track || !handle || !pages.length || module.getAttribute('data-zipper-ready') === 'true') return;
    module.setAttribute('data-zipper-ready', 'true');
    let currentStep = 0;
    let isDragging = false;
    let turnTimer = 0;
    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }
    function getMaxDrag() {
      const trackRect = track.getBoundingClientRect();
      const handleRect = handle.getBoundingClientRect();
      return Math.max(1, trackRect.width - handleRect.width);
    }
    function syncStep(nextStep) {
      const totalSteps = pages.length;
      const safeStep = clamp(nextStep, 0, totalSteps);
      const progress = totalSteps > 0 ? safeStep / totalSteps : 0;
      const stepChanged = safeStep !== currentStep;
      currentStep = safeStep;
      module.style.setProperty('--zipper-progress', String(progress));
      module.setAttribute('data-zipper-step', String(safeStep));
      module.classList.toggle('is-zipper-open', safeStep > 0);
      control.setAttribute('aria-valuenow', String(safeStep));
      control.setAttribute('aria-valuetext', safeStep > 0 ? 'Story page ' + safeStep + ' of ' + totalSteps : 'Zipper closed');
      pages.forEach(function (page, index) {
        const isActive = index === safeStep - 1;
        page.classList.toggle('is-active', isActive);
        page.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        if (isActive && stepChanged) {
          page.classList.remove('is-page-turning');
          page.offsetWidth;
          page.classList.add('is-page-turning');
        }
      });
      if (turnTimer) {
        window.clearTimeout(turnTimer);
      }
      turnTimer = window.setTimeout(function () {
        pages.forEach(function (page) {
          page.classList.remove('is-page-turning');
        });
      }, 520);
    }
    function stepFromClientX(clientX) {
      const trackRect = track.getBoundingClientRect();
      const handleRect = handle.getBoundingClientRect();
      const maxDrag = getMaxDrag();
      const dragDistance = clamp(trackRect.right - clientX - (handleRect.width / 2), 0, maxDrag);
      return Math.round((dragDistance / maxDrag) * pages.length);
    }
    function updateFromPointer(event) {
      syncStep(stepFromClientX(event.clientX));
    }
    control.addEventListener('pointerdown', function (event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      isDragging = true;
      control.classList.add('is-dragging');
      control.setPointerCapture(event.pointerId);
      updateFromPointer(event);
      event.preventDefault();
    });
    control.addEventListener('pointermove', function (event) {
      if (!isDragging) return;
      updateFromPointer(event);
      event.preventDefault();
    });
    function endDrag(event) {
      if (!isDragging) return;
      isDragging = false;
      control.classList.remove('is-dragging');
      if (control.hasPointerCapture && control.hasPointerCapture(event.pointerId)) {
        control.releasePointerCapture(event.pointerId);
      }
    }
    control.addEventListener('pointerup', endDrag);
    control.addEventListener('pointercancel', endDrag);
    control.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        syncStep(currentStep + 1);
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        syncStep(currentStep - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        syncStep(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        syncStep(pages.length);
      }
    });
    syncStep(0);
  }
  function createIntroNode() {
    const intro = document.createElement('div');
    const kicker = sourceInner.querySelector('.more-stories-kicker');
    const title = sourceInner.querySelector('.more-stories-title');
    const quote = sourceInner.querySelector('.more-stories-quote');
    const copy = sourceInner.querySelector('.more-stories-intro');
    const notes = sourceInner.querySelector('.more-stories-notes');

    if (kicker) intro.appendChild(cloneForMobileFeed(kicker));
    if (title) intro.appendChild(cloneForMobileFeed(title));
    if (quote) intro.appendChild(cloneForMobileFeed(quote));
    if (copy) intro.appendChild(cloneForMobileFeed(copy));

    if (notes) {
      const notesClone = cloneForMobileFeed(notes);

      notesClone.classList.add('mobile-home-feed-card-02-notes');

      notesClone.querySelectorAll('.more-stories-note').forEach(function (note) {
        note.classList.add('mobile-home-feed-card-02-note');
      });

      intro.appendChild(notesClone);
    }

    intro.appendChild(createCard02ZipperNode());

    return intro;
  }

  function createFaqFallbackNode() {
    const faq = document.createElement('div');
    const heading = createElement('h2', 'mobile-home-feed-faq-title', 'FAQ');
    const lead = createElement('p', 'mobile-home-feed-faq-lead', 'Quick answers before you choose your Phu Quoc local experience.');
    const list = createElement('div', 'mobile-home-feed-faq-list');

    const faqItems = [
      {
        question: 'Is this a shopping tour?',
        answer: 'No. The guide style is local, private, coral-friendly, and not based on shopping stops or commission stops.'
      },
      {
        question: 'Can beginners join snorkeling?',
        answer: 'Yes. The route can be adjusted for beginners, kids, families, and slower travelers.'
      },
      {
        question: 'What happens if the sea condition is not good?',
        answer: 'The plan should follow real water and weather conditions around Phu Quoc, not a fixed crowded route.'
      },
      {
        question: 'Is the trip private?',
        answer: 'The experience is designed around private guidance, flexible pacing, and cleaner travel.'
      }
    ];

    faq.className = 'mobile-home-feed-faq';

    faq.appendChild(heading);
    faq.appendChild(lead);

    faqItems.forEach(function (item) {
      const details = document.createElement('details');
      const summary = createElement('summary', '', item.question);
      const panel = createElement('p', '', item.answer);

      details.className = 'mobile-home-feed-faq-item';
      details.setAttribute('open', '');

      details.appendChild(summary);
      details.appendChild(panel);
      list.appendChild(details);
    });

    faq.appendChild(list);

    return faq;
  }

  function findFaqSourceNode(accordionNodes) {
    const faqPattern = /(faq|frequently|question|asked|hỏi|câu hỏi|thắc mắc)/i;

    return accordionNodes.find(function (node) {
      return faqPattern.test(node.textContent || '');
    }) || null;
  }

  function createFeedNodes() {
    const serviceNodes = Array.from(sourceInner.querySelectorAll('.more-service-card'));
    const accordionNodes = Array.from(sourceInner.querySelectorAll('.more-accordion-item'));
    const faqSourceNode = findFaqSourceNode(accordionNodes);
    const feedNodes = [];

    feedNodes.push(createMainHeroNode());
    feedNodes.push(createIntroNode());

    serviceNodes.slice(0, 6).forEach(function (card) {
      feedNodes.push(card);
    });

    while (feedNodes.length < 8 && accordionNodes.length) {
      const nextAccordion = accordionNodes.shift();

      if (nextAccordion !== faqSourceNode) {
        feedNodes.push(nextAccordion);
      }
    }

    if (faqSourceNode) {
      feedNodes.push(faqSourceNode);
    } else {
      feedNodes.push(createFaqFallbackNode());
    }

    accordionNodes.forEach(function (item) {
      if (feedNodes.length < MAX_FEED_CARDS && item !== faqSourceNode) {
        feedNodes.push(item);
      }
    });

    return feedNodes.slice(0, MAX_FEED_CARDS);
  }

  function createContentPanel(sourceNode, cardIndex, totalCards) {
    const panel = document.createElement('section');
    const card = document.createElement('div');
    const scroll = document.createElement('div');
    const cardNumber = String(cardIndex + 1).padStart(2, '0');
    const isLastCard = cardIndex === totalCards - 1;

    panel.className = 'mobile-home-feed-panel mobile-home-feed-panel-content mobile-home-feed-panel-' + cardNumber;
    card.className = 'mobile-home-feed-card mobile-home-feed-card-content mobile-home-feed-card-' + cardNumber;
    scroll.className = 'mobile-home-feed-card-scroll mobile-home-feed-card-scroll-' + cardNumber;

    if (cardNumber === FAQ_CARD_NUMBER) {
      panel.classList.add('mobile-home-feed-panel-faq');
      card.classList.add('mobile-home-feed-card-faq');
    }

    if (isLastCard) {
      panel.classList.add(LAST_CARD_CLASS);
      card.classList.add('mobile-home-feed-card-last');
      scroll.classList.add('mobile-home-feed-card-scroll-last');

      panel.setAttribute('data-mobile-feed-last-card', 'true');
      card.setAttribute('data-mobile-feed-last-card', 'true');
    }

    panel.setAttribute('data-mobile-feed-card', cardNumber);
    card.setAttribute('data-mobile-feed-card', cardNumber);

    scroll.appendChild(cloneForMobileFeed(sourceNode));
    if (cardNumber === '02') {
      initCard02ZipperInteraction(scroll);
    }
    card.appendChild(scroll);
    panel.appendChild(card);

    return panel;
  }

  function setMobileFeedHeaderState(cardNumber) {
    const isLastCardActive = cardNumber === lastCardNumber;
    const shouldShowHeader = cardNumber === '01' || isLastCardActive;

    document.documentElement.classList.toggle('is-mobile-feed-header-hidden', !shouldShowHeader);
    document.body.classList.toggle('is-mobile-feed-header-hidden', !shouldShowHeader);
    homeSection.classList.toggle('is-mobile-feed-header-hidden', !shouldShowHeader);
  }

  function setActiveMobileFeedCard(cardNumber) {
    const isLastCardActive = cardNumber === lastCardNumber;

    document.documentElement.setAttribute('data-mobile-feed-active-card', cardNumber);
    document.body.setAttribute('data-mobile-feed-active-card', cardNumber);
    homeSection.setAttribute('data-mobile-feed-active-card', cardNumber);

    document.documentElement.setAttribute('data-mobile-feed-last-card', lastCardNumber);
    document.body.setAttribute('data-mobile-feed-last-card', lastCardNumber);
    homeSection.setAttribute('data-mobile-feed-last-card', lastCardNumber);

    document.documentElement.classList.toggle('is-mobile-feed-last-card-active', isLastCardActive);
    document.body.classList.toggle('is-mobile-feed-last-card-active', isLastCardActive);
    homeSection.classList.toggle('is-mobile-feed-last-card-active', isLastCardActive);

    setMobileFeedHeaderState(cardNumber);
  }

  function syncActiveMobileFeedCard() {
    const panels = Array.from(feed.querySelectorAll('.mobile-home-feed-panel'));

    if (!panels.length) return;

    const viewportCenter = window.innerHeight / 2;
    let nearestPanel = panels[0];
    let nearestDistance = Number.POSITIVE_INFINITY;

    panels.forEach(function (panel) {
      const panelRect = panel.getBoundingClientRect();
      const panelCenter = panelRect.top + (panelRect.height / 2);
      const distance = Math.abs(panelCenter - viewportCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestPanel = panel;
      }
    });

    setActiveMobileFeedCard(nearestPanel.getAttribute('data-mobile-feed-card') || '01');
  }

  function scheduleActiveMobileFeedCardSync() {
    if (activeCardFrame) return;

    activeCardFrame = window.requestAnimationFrame(function () {
      activeCardFrame = 0;
      syncActiveMobileFeedCard();
    });
  }

  const feed = document.createElement('div');
  const handle = document.createElement('span');
  const feedNodes = createFeedNodes();

  lastCardNumber = String(feedNodes.length || 1).padStart(2, '0');

  feed.className = FEED_CLASS;
  feed.setAttribute('aria-label', 'Mobile home feed');

  handle.className = 'mobile-home-feed-handle';
  handle.setAttribute('aria-hidden', 'true');

  feedNodes.forEach(function (node, index) {
    const panel = createContentPanel(node, index, feedNodes.length);

    feed.appendChild(panel);

    if (index === feedNodes.length - 1) {
      lastPanel = panel;
    }
  });

  homeSection.appendChild(feed);
  homeSection.appendChild(handle);

  function setFeedEndingMode(enabled) {
    document.documentElement.classList.toggle(FEED_ENDING_CLASS, enabled);
    document.body.classList.toggle(FEED_ENDING_CLASS, enabled);
    homeSection.classList.toggle(FEED_ENDING_CLASS, enabled);
  }

  function applySnapStateIfNeeded() {
    if (isMobileTabletViewport() && isSnapActivated) {
      document.documentElement.classList.add(SNAP_CLASS);
      document.body.classList.add(SNAP_CLASS);
      return;
    }

    document.documentElement.classList.remove(SNAP_CLASS);
    document.body.classList.remove(SNAP_CLASS);
  }

  function activateSnapState() {
    if (!isMobileTabletViewport()) return;

    isSnapActivated = true;
    applySnapStateIfNeeded();
    scheduleActiveMobileFeedCardSync();
  }

  function activateSnapWhenHomeReached() {
    if (!isMobileTabletViewport() || isSnapActivated) return;

    if (homeSection.getBoundingClientRect().top <= 8) {
      activateSnapState();
    }
  }

  function openMobileHomeFeedFromFooter(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }

    const requestedCard = event && event.detail && event.detail.targetCard
      ? String(event.detail.targetCard).padStart(2, '0')
      : '02';

    const targetPanel = feed.querySelector('[data-mobile-feed-card="' + requestedCard + '"]')
      || feed.querySelector('[data-mobile-feed-card="02"]')
      || feed.querySelector('.mobile-home-feed-panel');

    homeSection.classList.add(FEED_READY_CLASS);
    activateSnapState();
    setFeedEndingMode(false);

    homeSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });

    window.setTimeout(function () {
      if (!targetPanel) return;

      feed.scrollTo({
        top: targetPanel.offsetTop,
        left: 0,
        behavior: 'smooth'
      });

      const cardNumber = targetPanel.getAttribute('data-mobile-feed-card') || requestedCard;
      setActiveMobileFeedCard(cardNumber);
      syncFeedEndingState();
    }, 260);

    window.setTimeout(function () {
      scheduleActiveMobileFeedCardSync();
    }, 560);
  }

  function getLastPanelVisibleRatio() {
    if (!lastPanel) return 0;

    const feedRect = feed.getBoundingClientRect();
    const panelRect = lastPanel.getBoundingClientRect();
    const visibleTop = Math.max(feedRect.top, panelRect.top);
    const visibleBottom = Math.min(feedRect.bottom, panelRect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    return panelRect.height > 0 ? visibleHeight / panelRect.height : 0;
  }

  function syncFeedEndingState() {
    if (!isMobileTabletViewport() || !lastPanel) {
      setFeedEndingMode(false);
      return;
    }

    setFeedEndingMode(getLastPanelVisibleRatio() >= LAST_CARD_VISIBLE_RATIO);
  }

  function initLastPanelObserver() {
    if (!lastPanel || typeof IntersectionObserver === 'undefined') return;

    const lastPanelObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!isMobileTabletViewport()) return;

        setFeedEndingMode(entry.intersectionRatio >= LAST_CARD_VISIBLE_RATIO);
      });
    }, {
      root: feed,
      threshold: [0, 0.45, LAST_CARD_VISIBLE_RATIO, 0.82]
    });

    lastPanelObserver.observe(lastPanel);
  }

  function syncMobileFeedState() {
    homeSection.classList.add(FEED_READY_CLASS);

    if (isDesktopViewport()) {
      homeSection.classList.add(DESKTOP_NORMAL_SCROLL_CLASS);
      isSnapActivated = false;
      setFeedEndingMode(false);
      applySnapStateIfNeeded();
      scheduleActiveMobileFeedCardSync();
      return;
    }

    homeSection.classList.remove(DESKTOP_NORMAL_SCROLL_CLASS);
    syncFeedEndingState();
    scheduleActiveMobileFeedCardSync();
  }

  setActiveMobileFeedCard('01');
  syncMobileFeedState();
  initLastPanelObserver();

  window.addEventListener('scroll', activateSnapWhenHomeReached, { passive: true });
  window.addEventListener('billy:open-mobile-home-feed', openMobileHomeFeedFromFooter);
  window.addEventListener('scroll', scheduleActiveMobileFeedCardSync, { passive: true });
  feed.addEventListener('scroll', syncFeedEndingState, { passive: true });
  feed.addEventListener('scroll', scheduleActiveMobileFeedCardSync, { passive: true });
  window.addEventListener('resize', syncMobileFeedState);

  window.addEventListener('orientationchange', function () {
    window.setTimeout(syncMobileFeedState, 220);
  });

  window.requestAnimationFrame(syncActiveMobileFeedCard);
}

function markAppReady() {
  document.body.classList.remove(APP_LOADING_CLASS);
  document.body.classList.add(APP_READY_CLASS);
}

function markAppReadyOnNextPaint() {
  window.requestAnimationFrame(markAppReady);
}

function safeInit(initFn, initName) {
  try {
    initFn();
    reportRuntimeOk(initName);
  } catch (error) {
    reportRuntimeFailure(initName, error);
    console.error(initName + ' failed', error);
  }
}

safeInit(initRuntimeBoot, 'initRuntimeBoot');
safeInit(initDebugSiteReset, 'initDebugSiteReset');
safeInit(initNavigation, 'initNavigation');
safeInit(initMobileHomeFeed, 'initMobileHomeFeed');
safeInit(initHomePopup, 'initHomePopup');
safeInit(initPolicyPopup, 'initPolicyPopup');
safeInit(initContactPopup, 'initContactPopup');
safeInit(initTourCarousel, 'initTourCarousel');
safeInit(initAvailabilityPopup, 'initAvailabilityPopup');
safeInit(initSearchPopup, 'initSearchPopup');
safeInit(initProgressiveImageLoader, 'initProgressiveImageLoader');
safeInit(initGalleryWithUs, 'initGalleryWithUs');
safeInit(initWaterForecast, 'initWaterForecast');
safeInit(initSiteFooter, 'initSiteFooter');

markAppReadyOnNextPaint();
