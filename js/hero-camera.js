/* ============================================================
   2D MARKETING — SONY FX5 CINEMA CAMERA (CSS 3D ENGINE)
   Pure CSS 3D / Zero-weight / Scroll-driven Explosion
   4 Layers: Sensor · Body · Ring · Lens
   Perspective: 1400px
   ============================================================ */

(function() {
  'use strict';

  var section = document.getElementById('hero-3d-section');
  var rig = document.getElementById('cameraRig');
  var layerSensor = document.getElementById('layerSensor');
  var layerBody = document.getElementById('layerBody');
  var layerRing = document.getElementById('layerRing');
  var layerLens = document.getElementById('layerLens');

  if (!section || !rig) return;

  var isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mouseX = 0, mouseY = 0;
  var targetMouseX = 0, targetMouseY = 0;
  var scrollProgress = 0;
  var ticking = false;

  // Track Mouse for subtle 3D interactive tilt
  function onMouseMove(e) {
    var rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    var x = (e.clientX - rect.left) / rect.width - 0.5;
    var y = (e.clientY - rect.top) / rect.height - 0.5;
    targetMouseX = x * 20; // max 20deg tilt
    targetMouseY = -y * 20;
    requestTick();
  }

  // Calculate scroll progress through sticky 300vh section
  function onScroll() {
    var rect = section.getBoundingClientRect();
    var totalScrollable = section.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) {
      scrollProgress = 0;
    } else {
      var current = -rect.top;
      scrollProgress = Math.min(Math.max(current / totalScrollable, 0), 1);
    }
    requestTick();
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScene);
      ticking = true;
    }
  }

  function updateScene() {
    ticking = false;

    // Smooth mouse lerp
    mouseX += (targetMouseX - mouseX) * 0.1;
    mouseY += (targetMouseY - mouseY) * 0.1;

    var p = scrollProgress; // 0 to 1

    if (isReduced) {
      rig.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0)';
      return;
    }

    // Explosion calculation:
    // Peak explosion happens around scroll progress 0.65
    var explodeFactor = Math.sin(p * Math.PI); // 0 at top, 1 at middle, 0 at exit

    // Stage 3D rotation based on scroll + mouse tilt
    var rotX = -12 * explodeFactor + mouseY * 0.6;
    var rotY = -28 * explodeFactor + mouseX * 0.8;
    var rotZ = 4 * explodeFactor;

    rig.style.transform = 'rotateX(' + rotX.toFixed(2) + 'deg) ' +
                          'rotateY(' + rotY.toFixed(2) + 'deg) ' +
                          'rotateZ(' + rotZ.toFixed(2) + 'deg)';

    // Layer 1: SENSOR (Flies back & left into negative Z)
    if (layerSensor) {
      var sZ = -180 * explodeFactor;
      var sX = -50 * explodeFactor;
      var sY = 25 * explodeFactor;
      layerSensor.style.transform = 'translate3d(' + sX.toFixed(1) + 'px, ' + sY.toFixed(1) + 'px, ' + sZ.toFixed(1) + 'px)';
      layerSensor.style.opacity = (0.7 + 0.3 * explodeFactor).toFixed(2);
    }

    // Layer 2: BODY (Chassis stays near central anchor)
    if (layerBody) {
      var bZ = -30 * explodeFactor;
      var bX = -10 * explodeFactor;
      layerBody.style.transform = 'translate3d(' + bX.toFixed(1) + 'px, 0px, ' + bZ.toFixed(1) + 'px)';
    }

    // Layer 3: RING (Cinema red mount floats forward)
    if (layerRing) {
      var rZ = 90 * explodeFactor;
      var rX = 25 * explodeFactor;
      var rY = -15 * explodeFactor;
      layerRing.style.transform = 'translate3d(' + rX.toFixed(1) + 'px, ' + rY.toFixed(1) + 'px, ' + rZ.toFixed(1) + 'px)';
    }

    // Layer 4: LENS (Front optics detach and project forward)
    if (layerLens) {
      var lZ = 220 * explodeFactor;
      var lX = 65 * explodeFactor;
      var lY = -35 * explodeFactor;
      var lRot = 15 * explodeFactor; // lens barrel twist
      layerLens.style.transform = 'translate3d(' + lX.toFixed(1) + 'px, ' + lY.toFixed(1) + 'px, ' + lZ.toFixed(1) + 'px) ' +
                                 'rotateZ(' + lRot.toFixed(1) + 'deg)';
    }
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial calculation
  onScroll();
  updateScene();

})();
