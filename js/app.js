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
