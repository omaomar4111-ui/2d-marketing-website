(function () {
  'use strict';
  
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[Hero Cinematic] GSAP not loaded');
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);
  
  const hero = document.querySelector('#hero-cinematic');
  const statue = document.querySelector('.hero-cinematic-statue');
  const textSide = document.querySelector('.hero-cinematic-text');
  const logoSide = document.querySelector('.hero-cinematic-logo-side');
  const bg = document.querySelector('.hero-cinematic-bg');
  const glow = document.querySelector('.hero-cinematic-glow');
  
  if (!hero || !statue) return;
  
  // ═══════════════════════════════════════════════════════
  // MAIN TIMELINE — Fade تدريجي للتمثال (يذوب في الألوان)
  // ═══════════════════════════════════════════════════════
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      invalidateOnRefresh: true
    }
  });
  
  // ─── STATUE Phase 1 (0-50%): Zoom In ───
  tl.to(statue, {
    scale: 1.15,
    y: -15,
    ease: 'power2.inOut',
    duration: 0.5
  }, 0);
  
  // ─── STATUE Phase 2 (50-100%): Fade + Blur + Zoom ───
  tl.to(statue, {
    scale: 1.35,
    y: -30,
    opacity: 0,
    filter: 'blur(30px)',
    ease: 'power3.in',
    duration: 0.5
  }, 0.5);
  
  // ─── GLOW: يظهر مع الـ Fade ───
  if (glow) {
    tl.to(glow, {
      opacity: 1,
      scale: 1.5,
      ease: 'power2.in',
      duration: 0.5
    }, 0.5);
    
    tl.to(glow, {
      opacity: 0,
      scale: 2,
      ease: 'power2.out',
      duration: 0.3
    }, 0.85);
  }
  
  // ─── LOGO SIDE: Move Left + Fade ───
  if (logoSide) {
    tl.to(logoSide, {
      x: -80,
      opacity: 0,
      ease: 'power2.in',
      duration: 0.7
    }, 0);
  }
  
  // ─── TEXT SIDE: Move Right + Fade ───
  if (textSide) {
    tl.to(textSide, {
      x: 80,
      opacity: 0,
      ease: 'power2.in',
      duration: 0.7
    }, 0);
  }
  
  // ─── BACKGROUND: Darken ───
  tl.to(bg, {
    opacity: 0.15,
    ease: 'none',
    duration: 1
  }, 0);
  
})();
