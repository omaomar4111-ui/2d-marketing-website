const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

console.log('--- Step 1: Replace "تسويق بيبيع" and its variations across all files ---');
const textReplacements = [
  { search: /تسويق بيبيع/g, replace: 'تسويق بيبيع' },
  { search: /التسويق اللي بيجيب نتايج/g, replace: 'التسويق اللي بيجيب نتايج' },
  { search: /تسويق بفلوس كسبانة/g, replace: 'تسويق بفلوس كسبانة' },
  { search: /تسويق بيشتغل صح/g, replace: 'تسويق بيشتغل صح' },
  { search: /استراتيجية التسويق اللي بيجيب نتايجة/g, replace: 'استراتيجية تسويق بتجيب نتايج' }
];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (f === 'node_modules' || f === '.git' || f === 'scratch') return;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkDir(full, callback);
    } else if (/\.(html|js|cjs|json)$/i.test(f)) {
      callback(full);
    }
  });
}

walkDir(root, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  for (const r of textReplacements) {
    if (r.search.test(content)) {
      content = content.replace(r.search, r.replace);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated keywords in: ${path.relative(root, filePath)}`);
  }
});

console.log('\n--- Step 2: Update Loader in js/main.js ---');
const mainJsPath = path.join(root, 'js', 'main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf8');

// Speed up loader
const loaderRegex = /function\s+initLoader\s*\(\)\s*\{[\s\S]*?setTimeout\(reveal,\s*\d+\);\s*\}/;
const newLoader = `function initLoader() {
  var l = $('#loader');
  if (!l) return;
  var reveal = function() {
    l.classList.add('hidden');
    document.body.classList.remove('loading');
  };
  setTimeout(reveal, 250);
}`;

if (loaderRegex.test(mainJs)) {
  mainJs = mainJs.replace(loaderRegex, newLoader);
} else {
  // If not found as function, check inline
  mainJs = mainJs.replace(/setTimeout\(reveal,\s*1400\)/g, 'setTimeout(reveal, 250)');
}

// Add initGSAP in js/main.js as requested
const newGsapCode = `
function initGSAP() {
  if (typeof gsap === 'undefined') {
    setTimeout(initGSAP, 300);
    return;
  }
  if (window.innerWidth < 768) {
    document.body.classList.add('no-gsap');
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);
  
  // ═══ Hero Animations ═══
  var tl = gsap.timeline({ delay: 0.3 });
  
  tl.from('.hero-title', {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  })
  .from('.hero-subtitle', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.6')
  .from('.hero-cta', {
    y: 30,
    opacity: 0,
    duration: 0.7,
    ease: 'back.out(1.4)'
  }, '-=0.5')
  .from('.hero-stats .hero-stat', {
    y: 30,
    opacity: 0,
    stagger: 0.15,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.4')
  .from('.hero-logo-3d', {
    scale: 0.7,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  }, 0);
  
  // ═══ Counters ═══
  document.querySelectorAll('.hero-stat-num[data-target]').forEach(function(el) {
    var target = parseFloat(el.dataset.target);
    var decimal = parseInt(el.dataset.decimal || '0');
    var obj = { val: 0 };
    
    gsap.to(obj, {
      val: target,
      duration: 2,
      delay: 0.8,
      ease: 'power2.out',
      onUpdate: function() {
        el.textContent = (decimal ? obj.val.toFixed(decimal) : Math.floor(obj.val)) + 
                        (el.dataset.suffix || (target >= 10 ? '+' : ''));
      }
    });
  });
  
  // ═══ General Section Reveals ═══
  gsap.utils.toArray('.section-h2').forEach(function(el) {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });
}
`;

if (mainJs.includes('function initGSAP()')) {
  mainJs = mainJs.replace(/function initGSAP\(\)[\s\S]*?\}\s*$/m, newGsapCode);
} else {
  mainJs += '\n' + newGsapCode;
}

fs.writeFileSync(mainJsPath, mainJs, 'utf8');
console.log('Updated js/main.js successfully!');

console.log('\n--- Step 3: Update CSS in css/pages.css ---');
const cssPath = path.join(root, 'css', 'pages.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Remove all old camera CSS
const cameraIdx = css.indexOf('/* ══════════════════════════════════════════════════════════════\n   HERO CAMERA');
if (cameraIdx !== -1) {
  const teamSectionIdx = css.indexOf('.section-team {', cameraIdx);
  if (teamSectionIdx !== -1) {
    css = css.substring(0, cameraIdx) + css.substring(teamSectionIdx);
    console.log('Removed old camera 3D CSS from css/pages.css');
  }
}

// Add the VR-inspired Hero, Services Strip, and Value Propositions CSS
const vrStyles = `
/* ══════════════════════════════════════════════════════════════
   HERO SECTION — Inspired by VR Agency, 2D Identity
══════════════════════════════════════════════════════════════ */
.hero-section {
  position: relative;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 140px var(--section-x) 80px;
  overflow: hidden;
  background: var(--c-black);
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: 
    radial-gradient(ellipse 60% 50% at 30% 40%, rgba(192,0,0,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 50% 60% at 70% 60%, rgba(192,0,0,0.10) 0%, transparent 60%),
    var(--c-black);
  animation: heroBgPulse 8s ease-in-out infinite alternate;
}

@keyframes heroBgPulse {
  from { opacity: 0.8; }
  to { opacity: 1; }
}

.hero-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: clamp(40px, 6vw, 100px);
  align-items: center;
}

.hero-content {
  max-width: 680px;
}

.hero-title {
  font-size: clamp(38px, 6.5vw, 76px);
  font-weight: 900;
  line-height: 1.1;
  color: #fff;
  margin-bottom: var(--sp-6);
  letter-spacing: -0.03em;
}

.hero-accent {
  color: var(--c-red-h);
  position: relative;
  display: inline-block;
}

.hero-accent::after {
  content: '';
  position: absolute;
  bottom: 4px;
  right: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--c-red), var(--c-red-h));
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: right;
  animation: accentUnderline 1s cubic-bezier(0.65, 0, 0.35, 1) 0.8s forwards;
}

@keyframes accentUnderline {
  to { transform: scaleX(1); }
}

.hero-subtitle {
  font-size: clamp(16px, 2vw, 22px);
  color: var(--c-w60);
  line-height: 1.75;
  margin-bottom: var(--sp-8);
  max-width: 540px;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 36px;
  background: linear-gradient(135deg, var(--c-red), var(--c-red-h));
  color: #fff;
  font-family: var(--font, sans-serif);
  font-size: 17px;
  font-weight: 800;
  border: none;
  border-radius: 9999px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(192, 0, 0, 0.35);
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
}

.hero-cta:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 18px 48px rgba(192, 0, 0, 0.55);
}

.hero-cta-arrow {
  width: 20px;
  height: 20px;
  transition: transform 0.3s;
}

.hero-cta:hover .hero-cta-arrow {
  transform: translateX(-4px);
}

.hero-stats {
  display: flex;
  gap: clamp(24px, 5vw, 56px);
  margin-top: var(--sp-10);
  padding-top: var(--sp-8);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
}

.hero-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-stat-num {
  font-size: clamp(26px, 3.2vw, 38px);
  font-weight: 900;
  color: #fff;
  font-family: var(--font-mono, monospace);
  line-height: 1;
}

.hero-stat-label {
  font-size: 13px;
  color: var(--c-w40);
  font-weight: 700;
  letter-spacing: 0.5px;
}

.hero-logo-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
}

.hero-logo-3d {
  position: relative;
  width: 100%;
  max-width: 480px;
  animation: logoFloat 6s ease-in-out infinite;
  filter: drop-shadow(0 20px 60px rgba(192, 0, 0, 0.45));
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0) rotateY(0deg); }
  50% { transform: translateY(-16px) rotateY(6deg); }
}

.hero-logo-img {
  width: 100%;
  height: auto;
  display: block;
}

.hero-scroll {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--c-w40);
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  z-index: 3;
}

.hero-scroll-line {
  width: 1px;
  height: 44px;
  background: linear-gradient(to bottom, var(--c-red-h), transparent);
  animation: scrollLinePulse 2s ease-in-out infinite;
}

@keyframes scrollLinePulse {
  0%, 100% { transform: scaleY(1); opacity: 0.6; }
  50% { transform: scaleY(1.3); opacity: 1; }
}

@media (max-width: 900px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-content {
    order: 2;
    max-width: 100%;
  }
  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-logo-wrap {
    order: 1;
    max-width: 260px;
    margin: 0 auto 20px;
  }
  .hero-stats {
    justify-content: center;
    gap: 24px;
  }
}

/* ══════════════════════════════════════════════════════════════
   SERVICES MARQUEE STRIP (VR Agency Style)
══════════════════════════════════════════════════════════════ */
.services-strip {
  width: 100%;
  overflow: hidden;
  background: var(--c-s1);
  border-top: 1px solid rgba(192, 0, 0, 0.12);
  border-bottom: 1px solid rgba(192, 0, 0, 0.12);
  padding: 26px 0;
  position: relative;
  direction: ltr;
}

.services-strip::before,
.services-strip::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  width: 120px;
  z-index: 2;
  pointer-events: none;
}
.services-strip::before { right: 0; background: linear-gradient(270deg, var(--c-s1), transparent); }
.services-strip::after { left: 0; background: linear-gradient(90deg, var(--c-s1), transparent); }

.services-track {
  display: flex;
  gap: clamp(24px, 4vw, 48px);
  width: max-content;
  align-items: center;
  animation: servicesScroll 30s linear infinite;
  will-change: transform;
}

.services-track:hover { animation-play-state: paused; }

@keyframes servicesScroll {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}

.service-item {
  font-size: clamp(20px, 3vw, 30px);
  font-weight: 900;
  color: #fff;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.service-dot {
  font-size: clamp(20px, 3vw, 30px);
  color: var(--c-red-h);
  font-weight: 900;
}

/* ══════════════════════════════════════════════════════════════
   ABOUT BRIEF (VR Agency Style)
══════════════════════════════════════════════════════════════ */
.section-about-brief {
  padding: clamp(60px, 8vw, 100px) var(--section-x);
  background: var(--c-black);
  text-align: center;
}
.about-brief-container {
  max-width: 860px;
  margin: 0 auto;
}
.about-brief-quote {
  font-size: clamp(24px, 3.5vw, 42px);
  font-weight: 800;
  line-height: 1.5;
  color: #ffffff;
  margin-bottom: var(--sp-6);
}
.about-brief-quote strong {
  color: var(--c-red-h);
}
.about-brief-desc {
  font-size: clamp(16px, 2vw, 20px);
  color: var(--c-w60);
  line-height: 1.8;
  max-width: 720px;
  margin: 0 auto;
}

/* ══════════════════════════════════════════════════════════════
   VALUE PROPOSITIONS (4 Cards)
══════════════════════════════════════════════════════════════ */
.section-values {
  padding: var(--section-y) var(--section-x);
  background: var(--c-black);
  position: relative;
}

.values-container {
  max-width: 1240px;
  margin: 0 auto;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--sp-6);
}

.value-card {
  padding: var(--sp-8) var(--sp-6);
  background: rgba(14, 8, 10, 0.75);
  border: 1px solid rgba(192, 0, 0, 0.15);
  border-radius: var(--r-xl);
  transition: all 0.4s var(--e-float);
  text-align: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.value-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--c-red), var(--c-red-h));
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
}

.value-card:hover {
  transform: translateY(-8px);
  border-color: rgba(192, 0, 0, 0.4);
  box-shadow: 0 20px 50px rgba(192, 0, 0, 0.22);
}

.value-card:hover::before {
  transform: scaleX(1);
}

.value-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--sp-5);
  border-radius: 50%;
  background: rgba(192, 0, 0, 0.12);
  border: 1px solid rgba(192, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: var(--c-red-h);
  transition: all 0.4s var(--e-float);
}

.value-card:hover .value-icon {
  background: rgba(192, 0, 0, 0.22);
  transform: scale(1.1);
  box-shadow: 0 0 30px rgba(192, 0, 0, 0.4);
}

.value-title {
  font-size: var(--t-md);
  font-weight: 900;
  color: #fff;
  margin-bottom: var(--sp-3);
}

.value-desc {
  font-size: var(--t-sm);
  color: var(--c-w60);
  line-height: 1.75;
}

[data-theme="light"] .section-values { background: #fafafa; }
[data-theme="light"] .value-card { background: #fff; border-color: rgba(192,0,0,0.15); }
[data-theme="light"] .value-title { color: #1a0000; }
[data-theme="light"] .value-desc { color: rgba(26, 0, 0, 0.65); }
[data-theme="light"] .services-strip { background: #ffe8e8; }
[data-theme="light"] .service-item { color: #1a0000; }
[data-theme="light"] .section-about-brief { background: #fff5f5; }
[data-theme="light"] .about-brief-quote { color: #1a0000; }
[data-theme="light"] .about-brief-desc { color: rgba(26,0,0,0.7); }
`;

// Prepend or add to css/pages.css
css = vrStyles + '\n' + css;
fs.writeFileSync(cssPath, css, 'utf8');
console.log('Updated css/pages.css with VR Agency style classes!');

console.log('\n--- Step 4: Rebuild index.html Sections ---');
const indexPath = path.join(root, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Ensure SVG symbols for user-tie, chart-line, bolt, clock
const extraIcons = `
<symbol id="fa-user-tie" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm-45.7 48C79.8 304 0 383.8 0 482.3 0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3h-91.4z"/></symbol>
<symbol id="fa-chart-line" viewBox="0 0 512 512"><path fill="currentColor" d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l31.9 31.9-86.74 86.74-57.37-57.37c-6.25-6.25-16.38-6.25-22.63 0l-112 112c-6.25 6.25-6.25 16.38 0 22.63l22.63 22.63c6.25 6.25 16.38 6.25 22.63 0L208 274.75l57.37 57.37c6.25 6.25 16.38 6.25 22.63 0l109.37-109.37 31.9 31.9c15.12 15.12 40.97 4.41 40.97-16.97V112c0-8.84-7.16-16-16-16z"/></symbol>
<symbol id="fa-bolt" viewBox="0 0 384 512"><path fill="currentColor" d="M0 256c0 13.7 8.6 26 21.7 30.7L160 339.7V480c0 14.2 9.4 26.6 23.1 30.4s28.1-2.4 35.8-14.8l160-256c7.6-12.1 7-27.6-1.5-39.1s-23-16.5-37.4-16.5H224V32c0-14.2-9.4-26.6-23.1-30.4s-28.1 2.4-35.8 14.8l-160 256C1.9 237.5 0 246.6 0 256z"/></symbol>
<symbol id="fa-clock" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-62.9c-3.1-2.3-4.9-5.9-4.9-9.7V144c0-6.6 5.4-12 12-12h24c6.6 0 12 5.4 12 12v110.8l68.7 50.9c5.3 3.9 6.5 11.4 2.6 16.7l-14.4 19.5c-3.9 5.3-11.4 6.4-16.7 2.5z"/></symbol>
`;

if (!html.includes('id="fa-user-tie"')) {
  html = html.replace('</svg>', extraIcons + '\n</svg>');
}

// Construct the new VR Agency inspired top section:
// Hero + Services Marquee + About Brief + Value Propositions
const vrAgencyTop = `
<!-- ═══════════════════════════════════════════════════════
     HERO — بنسخة VR Agency بروح 2D Marketing
═══════════════════════════════════════════════════════ -->
<section id="hero" class="hero-section">
  <div class="hero-bg" aria-hidden="true"></div>
  
  <div class="hero-container">
    <div class="hero-content">
      
      <h1 class="hero-title">
        بنعمل تسويق <span class="hero-accent">بيبيع</span>.<br/>
        مش بيحكي.
      </h1>
      
      <p class="hero-subtitle">
        نظام leads + إعلانات مدفوعة + تقارير أسبوعية.<br/>
        كل حاجة بالعامية، وكل جنيه بتشوفه بيرجع كام.
      </p>
      
      <a href="#contact" class="hero-cta" onclick="openConv()">
        احجز مكالمة مجانية
        <svg class="hero-cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
      
      <!-- Stats تحت الـ CTA -->
      <div class="hero-stats">
        <div class="hero-stat">
          <span class="hero-stat-num" data-target="50">50+</span>
          <span class="hero-stat-label">عميل نشط</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-num" data-target="3.8" data-decimal="1">3.8×</span>
          <span class="hero-stat-label">متوسط ROAS</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat-num" data-target="19">19</span>
          <span class="hero-stat-label">براند اشتغلنا معاه</span>
        </div>
      </div>
      
    </div>
    
    <!-- لوجو 2D كبير على الجنب -->
    <div class="hero-logo-wrap" aria-hidden="true">
      <div class="hero-logo-3d">
        <picture>
          <source srcset="assets/logos/2d-main.webp" type="image/webp">
          <img src="assets/logos/2d-main.png" alt="2D Marketing" class="hero-logo-img" width="500" height="500" />
        </picture>
      </div>
    </div>
  </div>
  
  <!-- Scroll indicator -->
  <div class="hero-scroll" aria-hidden="true">
    <span>اكتشف</span>
    <div class="hero-scroll-line"></div>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     SERVICES MARQUEE — شريط الخدمات (VR Agency Style)
═══════════════════════════════════════════════════════ -->
<section id="services-strip" class="services-strip" aria-label="خدماتنا">
  <div class="services-track">
    <span class="service-item">نظام Leads</span>
    <span class="service-dot" aria-hidden="true">•</span>
    <span class="service-item">الإعلانات المدفوعة</span>
    <span class="service-dot" aria-hidden="true">•</span>
    <span class="service-item">المحتوى والسوشيال ميديا</span>
    <span class="service-dot" aria-hidden="true">•</span>
    <span class="service-item">التقارير والتحليل</span>
    <span class="service-dot" aria-hidden="true">•</span>
    <span class="service-item">الاستراتيجية</span>
    <span class="service-dot" aria-hidden="true">•</span>
    <!-- تكرار للـ Infinite Scroll -->
    <span class="service-item">نظام Leads</span>
    <span class="service-dot" aria-hidden="true">•</span>
    <span class="service-item">الإعلانات المدفوعة</span>
    <span class="service-dot" aria-hidden="true">•</span>
    <span class="service-item">المحتوى والسوشيال ميديا</span>
    <span class="service-dot" aria-hidden="true">•</span>
    <span class="service-item">التقارير والتحليل</span>
    <span class="service-dot" aria-hidden="true">•</span>
    <span class="service-item">الاستراتيجية</span>
    <span class="service-dot" aria-hidden="true">•</span>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     ABOUT US BRIEF — كلمة عن الوكالة (VR Agency Style)
═══════════════════════════════════════════════════════ -->
<section id="about" class="section-about-brief">
  <div class="about-brief-container">
    <div class="section-eyebrow rv"><svg class="svgi"><use href="#fa-users"></use></svg>إحنا مين</div>
    <h2 class="about-brief-quote rv">
      مش بنبيع كلام ومحتوى ملوش لازمة...<br/>
      إحنا بنبني <strong>تسويق بيبيع</strong> ويضاعف أرقامك.
    </h2>
    <p class="about-brief-desc rv">
      2D Marketing وكالة نمو تسويقي مبنية على فكرة واحدة بسيطة: كل جنيه بتصرفه في الإعلانات لازم يرجعلك عملاء حقيقيين وأرباح واضحة على الأرض. بنتحكم في خط الإنتاج كامل من الكاميرا والاستوديو لحد الحملات والـ Leads المقفولة.
    </p>
  </div>
</section>

<!-- ═══════════════════════════════════════════════════════
     VALUE PROPOSITIONS — ليه تختارنا (VR Agency Style)
═══════════════════════════════════════════════════════ -->
<section id="values" class="section-values">
  <div class="values-container">
    <div style="text-align:center;max-width:680px;margin:0 auto var(--sp-10)">
      <div class="section-eyebrow rv">
        <svg class="svgi"><use href="#fa-check"></use></svg>
        ليه 2D Marketing؟
      </div>
      <h2 class="section-h2 rv">4 حاجات بتفرق معانا</h2>
    </div>
    
    <div class="values-grid">
      <div class="value-card rv">
        <div class="value-icon"><svg class="svgi"><use href="#fa-user-tie"></use></svg></div>
        <h3 class="value-title">مدير حساب مخصص ليك</h3>
        <p class="value-desc">حد واحد مسؤول عنك، بترد عليه على طول، وبيفهم طبيعة شغلك وسوقك.</p>
      </div>
      <div class="value-card rv">
        <div class="value-icon"><svg class="svgi"><use href="#fa-chart-line"></use></svg></div>
        <h3 class="value-title">تقارير واضحة كل أسبوع</h3>
        <p class="value-desc">أرقام حقيقية، مش كلام. تعرف كل جنيه راح فين ورجع كام lead ومبيعات.</p>
      </div>
      <div class="value-card rv">
        <div class="value-icon"><svg class="svgi"><use href="#fa-bolt"></use></svg></div>
        <h3 class="value-title">أفكار بتتنفذ فوراً</h3>
        <p class="value-desc">مش بنحكي بس. بنشتغل بسرعة، وبنظبط الحملات والمحتوى على طول.</p>
      </div>
      <div class="value-card rv">
        <div class="value-icon"><svg class="svgi"><use href="#fa-clock"></use></svg></div>
        <h3 class="value-title">تسليم في الوقت</h3>
        <p class="value-desc">كل حاجة بنوعد بيها، بنسلمها في وقتها بأعلى جودة. مفيش أعذار.</p>
      </div>
    </div>
  </div>
</section>
`;

// Replace the old hero 3D section with the new VR agency top block!
const oldHeroStart = html.indexOf('<!-- ═══════════════════════════════════════════════════════\n     HERO 3D SECTION');
const oldHeroEnd = html.indexOf('</section>', html.indexOf('id="hero-3d-section"'));

if (oldHeroStart !== -1 && oldHeroEnd !== -1) {
  const fullHeroEnd = oldHeroEnd + '</section>'.length;
  html = html.substring(0, oldHeroStart) + vrAgencyTop.trim() + '\n\n' + html.substring(fullHeroEnd);
  console.log('Replaced old Hero section with VR Agency Hero, Services Strip, About Brief, and Values!');
} else {
  console.log('Could not find old hero 3D comment, trying direct regex');
  html = html.replace(/<section id="hero-3d-section"[\s\S]*?<\/section>/, vrAgencyTop.trim());
}

// Remove any remaining hero-camera script tag
html = html.replace(/<script[^>]*hero-camera\.js[^>]*><\/script>/g, '');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Updated index.html successfully with VR Agency structure!');
