/* ============================================
   Scroll Reveal — IntersectionObserver
   ============================================ */
(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.rv').forEach(function (el) {
      el.classList.add('v');
    });
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.rv').forEach(function (el) {
      el.classList.add('v');
    });
    return;
  }

  var observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('v');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  var revealElements = document.querySelectorAll('.rv');
  if (revealElements.length === 0) return;

  revealElements.forEach(function (el, index) {
    var delay = Math.min(index * 60, 300);
    el.style.transitionDelay = delay + 'ms';
    observer.observe(el);
  });

  setTimeout(function () {
    document.querySelectorAll('.rv:not(.v)').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('v');
      }
    });
  }, 3000);

})();
