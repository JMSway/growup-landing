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
