/* Disable browser scroll restoration — always start at top on refresh */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('beforeunload', function () {
  window.scrollTo(0, 0);
});

/* Theme Toggle — always dark on load */
document.querySelector('.theme-toggle').addEventListener('click', function () {
  var t = document.documentElement;
  t.setAttribute('data-theme', t.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* Match hero title widths: top line scales to match bottom line width */
function fitHeroTitle() {
  var top = document.querySelector('.title-accent');
  var bot = document.querySelector('.title-sub');
  if (!top || !bot) return;
  // Reset top to its CSS-defined size first
  top.style.fontSize = '';
  var botW = bot.getBoundingClientRect().width;
  var topW = top.getBoundingClientRect().width;
  if (!topW || !botW) return;
  var currentSize = parseFloat(getComputedStyle(top).fontSize);
  var newSize = currentSize * (botW / topW);
  // Safety: never exceed reasonable bounds
  newSize = Math.max(20, Math.min(newSize, 80));
  top.style.fontSize = newSize + 'px';
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(fitHeroTitle);
} else {
  window.addEventListener('load', fitHeroTitle);
}
window.addEventListener('resize', fitHeroTitle);

/* Outcome headline: equalize all lines to the widest via letter-spacing */
function fitOutcomeLines() {
  var lines = document.querySelectorAll('.outcome-headline .outcome-line');
  if (!lines.length) return;
  // Reset letter-spacing
  lines.forEach(function (l) { l.style.letterSpacing = '0px'; });
  // Find the widest line
  var maxW = 0;
  lines.forEach(function (l) {
    var w = l.getBoundingClientRect().width;
    if (w > maxW) maxW = w;
  });
  if (!maxW) return;
  // Stretch shorter lines
  lines.forEach(function (l) {
    var w = l.getBoundingClientRect().width;
    if (w >= maxW - 0.5) return;
    var text = l.textContent.replace(/\s/g, '');
    var charCount = text.length;
    if (charCount <= 1) return;
    var extra = (maxW - w) / (charCount - 1);
    if (extra > 10) extra = 10;
    l.style.letterSpacing = extra.toFixed(2) + 'px';
  });
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(fitOutcomeLines);
} else {
  window.addEventListener('load', fitOutcomeLines);
}
window.addEventListener('resize', fitOutcomeLines);

/* Outcome headline: uniform size, no auto-fit (disabled — using CSS clamp instead) */
function fitOutcomeHeadline() { return; /* disabled */
  var wrap = document.querySelector('.outcome-headline-wrap');
  var lines = document.querySelectorAll('.outcome-headline .outcome-line');
  if (!wrap || !lines.length) return;
  var wrapW = wrap.getBoundingClientRect().width;
  if (!wrapW) return;
  // Целевая ширина — почти вся обёртка (1% страховки от subpixel-переноса)
  var targetW = wrapW * 0.99;
  lines.forEach(function (line) {
    line.style.fontSize = '';
    var w = line.getBoundingClientRect().width;
    if (!w) return;
    var current = parseFloat(getComputedStyle(line).fontSize);
    var newSize = current * (targetW / w);
    // Безопасные границы — потолок выше, чтобы короткие строки могли разрастись
    newSize = Math.max(14, Math.min(newSize, 56));
    line.style.fontSize = newSize + 'px';
  });
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(fitOutcomeHeadline);
} else {
  window.addEventListener('load', fitOutcomeHeadline);
}
window.addEventListener('resize', fitOutcomeHeadline);

/* Problem cards: slide in from left, re-trigger on re-entry */
var problemCards = document.querySelectorAll('.problem-card');
if (problemCards.length) {
  var problemIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
      } else {
        e.target.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.3 });
  problemCards.forEach(function (el) { problemIO.observe(el); });
}

/* Fade-in on scroll */
var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(function (el) { io.observe(el); });

/* Step 3 result curve: charge line on enter, re-trigger on re-entry */
var resultCurves = document.querySelectorAll('.step-result--3');
if (resultCurves.length) {
  var curveIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.remove('is-charged');
        void e.target.offsetWidth;
        e.target.classList.add('is-charged');
      } else {
        e.target.classList.remove('is-charged');
      }
    });
  }, { threshold: 0.4 });
  resultCurves.forEach(function (el) { curveIO.observe(el); });
}

/* Step underline: draw wavy line under accent phrases, re-trigger on re-entry */
var underlineTargets = document.querySelectorAll('.step-underline-target');
if (underlineTargets.length) {
  var underlineIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.remove('is-drawn');
        void e.target.offsetWidth;
        e.target.classList.add('is-drawn');
      } else {
        e.target.classList.remove('is-drawn');
      }
    });
  }, { threshold: 0.6 });
  underlineTargets.forEach(function (el) { underlineIO.observe(el); });
}

/* Example accordion: toggle + auto-collapse when scrolled away */
var exAccordion = document.getElementById('example-accordion');
var exToggle = document.getElementById('example-toggle');
var exBody = document.getElementById('example-body');
if (exAccordion && exToggle && exBody) {
  var exToggleText = exToggle.querySelector('.example-toggle-text');
  var exInner = exBody.querySelector('.example-body-inner');

  function openExample() {
    var h = exInner.scrollHeight;
    exBody.style.maxHeight = h + 'px';
    exAccordion.classList.add('is-open');
    exToggleText.textContent = 'Свернуть пример';
  }

  function closeExample() {
    exBody.style.maxHeight = '0';
    exAccordion.classList.remove('is-open');
    exToggleText.textContent = 'Показать пример';
  }

  exToggle.addEventListener('click', function () {
    if (exAccordion.classList.contains('is-open')) {
      closeExample();
    } else {
      openExample();
    }
  });

  var exIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting && exAccordion.classList.contains('is-open')) {
        closeExample();
      }
    });
  }, { threshold: 0 });
  exIO.observe(exAccordion);

  /* Periodic nudge for "Показать пример" button every 4s */
  setInterval(function () {
    if (exAccordion.classList.contains('is-open')) return;
    exToggle.classList.add('btn-nudge');
    setTimeout(function () { exToggle.classList.remove('btn-nudge'); }, 600);
  }, 4000);
}

/* Outcome icons: roll-in wheel animation, re-trigger on re-entry */
var outcomeIcons = document.querySelector('.outcome-icons');
if (outcomeIcons) {
  var rollIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        outcomeIcons.classList.remove('is-rolled');
        void outcomeIcons.offsetWidth;
        outcomeIcons.classList.add('is-rolled');
      } else {
        outcomeIcons.classList.remove('is-rolled');
      }
    });
  }, { threshold: 0.3 });
  rollIO.observe(outcomeIcons);
}

/* Bridge: light up words on scroll, fade back, re-trigger on re-entry */
var bridge = document.querySelector('.bridge');
if (bridge) {
  var bridgeFadeTimer = null;
  var bridgeIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        // Reset state, then trigger
        bridge.classList.remove('is-lit');
        // Force reflow so animation restarts cleanly
        void bridge.offsetWidth;
        bridge.classList.add('is-lit');
        clearTimeout(bridgeFadeTimer);
        // Words: last word lit at 1.2s + 0.6s transition = 1.8s
        // Dots: 2 cycles × 1.5s starting at 1.6s = ends ~5.6s
        // Fade back at 6.2s
        bridgeFadeTimer = setTimeout(function () {
          bridge.classList.remove('is-lit');
        }, 6200);
      } else {
        clearTimeout(bridgeFadeTimer);
        bridge.classList.remove('is-lit');
      }
    });
  }, { threshold: 0.5 });
  bridgeIO.observe(bridge);
}

/* Bonuses: animated strikethrough on enter, re-trigger on re-entry */
var bonusesCards = document.getElementById('bonuses-cards');
if (bonusesCards) {
  var bonusIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        bonusesCards.classList.add('is-struck');
      } else {
        bonusesCards.classList.remove('is-struck');
      }
    });
  }, { threshold: 0.3 });
  bonusIO.observe(bonusesCards);
}
var bonusesSection = document.getElementById('bonuses');
if (bonusesSection) {
  var bonusSectionIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        bonusesSection.classList.add('is-struck');
      } else {
        bonusesSection.classList.remove('is-struck');
      }
    });
  }, { threshold: 0.2 });
  bonusSectionIO.observe(bonusesSection);
}

/* Price card: animated strikethrough on enter, re-trigger on re-entry */
var priceCard = document.getElementById('price-card');
if (priceCard) {
  var strikeIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        priceCard.classList.add('is-struck');
      } else {
        priceCard.classList.remove('is-struck');
      }
    });
  }, { threshold: 0.4 });
  strikeIO.observe(priceCard);
}

/* Periodic nudge for CTA buttons every 4s */
var priceCta = document.querySelector('.price-cta:not(.guarantee-cta)');
var guaranteeCta = document.getElementById('guarantee-cta');
function nudgeBtn(btn) {
  if (!btn) return;
  btn.classList.add('btn-nudge');
  setTimeout(function () { btn.classList.remove('btn-nudge'); }, 600);
}
if (priceCta) {
  setInterval(function () { nudgeBtn(priceCta); }, 4000);
}
if (guaranteeCta) {
  setInterval(function () { nudgeBtn(guaranteeCta); }, 4000);
}

/* Floating WA icon swap: Gift when in BonusesSection, Shield when in GuaranteeSection */
var floatingWaEl = document.getElementById('floating-wa');
var bonusesSec = document.querySelector('[data-section="bonuses"]');
var guaranteeSec = document.querySelector('[data-section="guarantee"]');
if (floatingWaEl && bonusesSec) {
  var bonusIconIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        floatingWaEl.classList.add('in-bonuses');
      } else {
        floatingWaEl.classList.remove('in-bonuses');
      }
    });
  }, { threshold: 0.3 });
  bonusIconIO.observe(bonusesSec);
}
if (floatingWaEl && guaranteeSec) {
  var guaranteeIconIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        floatingWaEl.classList.add('in-guarantee');
      } else {
        floatingWaEl.classList.remove('in-guarantee');
      }
    });
  }, { threshold: 0.3 });
  guaranteeIconIO.observe(guaranteeSec);
}
var faqSec = document.querySelector('[data-section="faq"]');
if (floatingWaEl && faqSec) {
  var faqIconIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        floatingWaEl.classList.add('in-faq');
      } else {
        floatingWaEl.classList.remove('in-faq');
      }
    });
  }, { threshold: 0.3 });
  faqIconIO.observe(faqSec);
}

/* FAQ accordion — one open at a time */
var faqItems = document.querySelectorAll('.faq-item');
if (faqItems.length) {
  var faqHasInteracted = false;

  /* Attention pulse on triggers before first interaction */
  var faqAttentionTimer = setInterval(function () {
    if (faqHasInteracted) { clearInterval(faqAttentionTimer); return; }
    faqItems.forEach(function (item, idx) {
      if (item.classList.contains('is-open')) return;
      setTimeout(function () {
        var t = item.querySelector('.faq-trigger');
        t.classList.add('btn-nudge');
        setTimeout(function () { t.classList.remove('btn-nudge'); }, 600);
      }, idx * 400);
    });
  }, 4000);

  faqItems.forEach(function (item) {
    var trigger = item.querySelector('.faq-trigger');
    var answer = item.querySelector('.faq-answer');
    var inner = item.querySelector('.faq-answer-inner');
    trigger.addEventListener('click', function () {
      faqHasInteracted = true;
      var wasOpen = item.classList.contains('is-open');
      // Close all
      faqItems.forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        other.querySelector('.faq-answer').style.maxHeight = '0';
      });
      // Open this one if it was closed
      if (!wasOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = inner.scrollHeight + 'px';
        // Scroll to trigger after animation starts
        setTimeout(function () {
          trigger.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });
  });
}

/* Floating WhatsApp CTA: hidden → bar → circle */
var floatingWa = document.getElementById('floating-wa');
var priceSection = document.getElementById('price-section');
var themeToggle = document.querySelector('.theme-toggle');
if (floatingWa && priceSection) {
  var hasSeen = false;
  var currentState = 'hidden';
  var rafId = null;
  var nudgeTimer = null;

  var priceIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) hasSeen = true;
    });
  }, { threshold: 0.15 });
  priceIO.observe(priceSection);

  function setFloatingState(newState) {
    if (newState === currentState) return;
    currentState = newState;

    floatingWa.classList.remove('is-bar', 'is-bar-exit', 'is-circle', 'is-circle-idle');
    if (themeToggle) themeToggle.classList.remove('wa-bar-active', 'wa-circle-active');

    if (newState === 'bar') {
      floatingWa.classList.add('is-bar');
      floatingWa.classList.remove('entrance-done');
      if (themeToggle) themeToggle.classList.add('wa-bar-active');
      // After entrance animation (0.9s), lock position and start nudge
      setTimeout(function () {
        if (currentState !== 'bar') return;
        floatingWa.classList.add('entrance-done');
      }, 1000);
      clearInterval(nudgeTimer);
      nudgeTimer = setInterval(function () {
        if (currentState !== 'bar') return;
        floatingWa.classList.add('wa-nudge');
        setTimeout(function () { floatingWa.classList.remove('wa-nudge'); }, 600);
      }, 5000);
    } else if (newState === 'circle') {
      clearInterval(nudgeTimer);
      floatingWa.classList.add('is-circle');
      if (themeToggle) themeToggle.classList.add('wa-circle-active');
      // Add pulse after entrance animation finishes
      setTimeout(function () {
        if (currentState === 'circle') floatingWa.classList.add('is-circle-idle');
      }, 500);
    }
  }

  function updateFloatingState() {
    if (!hasSeen) return;
    var rect = priceSection.getBoundingClientRect();
    var aboveSection = rect.top > window.innerHeight;
    setFloatingState(aboveSection ? 'circle' : 'bar');
  }

  window.addEventListener('scroll', function () {
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      updateFloatingState();
      rafId = null;
    });
  }, { passive: true });
}
