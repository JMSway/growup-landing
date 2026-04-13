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
