/* ══════════════════════════════════════════════════════════════
   2D MARKETING — Team Section + Per-Role Animations
══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';
  
  var ROLES = [
    { id: 1, roleEn: 'Account Manager', roleAr: 'مدير حسابك',
      descAr: 'مسؤول التواصل معاك — بيتابع كل تفصيلة ويوصّل صوتك للفريق.',
      image: 'role-01-account-manager.jpg', animation: 'slide-right' },
    { id: 2, roleEn: 'Content Creator', roleAr: 'كتابة المحتوى',
      descAr: 'بيكتب الكلام اللي يعبّر عن صوت براندك — بالعامية اللي الناس تفهمها.',
      image: 'role-02-content-creator.jpg', animation: 'slide-left' },
    { id: 3, roleEn: 'Content Strategist', roleAr: 'استراتيجية المحتوى',
      descAr: 'بيخطط المحتوى الاستراتيجي — بيشوف الصورة الكبيرة قبل التنفيذ.',
      image: 'role-03-content-strategist.jpg', animation: 'slide-up' },
    { id: 4, roleEn: 'Media Buyer', roleAr: 'شراء الإعلانات',
      descAr: 'بيُدير الحملات المدفوعة على Meta وGoogle — بأعلى ROI ممكن.',
      image: 'role-04-media-buyer.jpg', animation: 'slide-right' },
    { id: 5, roleEn: 'Photographer', roleAr: 'التصوير الفوتوغرافي',
      descAr: 'بيصوّر اللحظات اللي تحكي قصة براندك — بأسلوب سينمائي.',
      image: 'role-05-photographer.jpg', animation: 'slide-left' },
    { id: 6, roleEn: 'Video Editor', roleAr: 'مونتاج الفيديو',
      descAr: 'بيحوّل الأفكار لفيديوهات تشد الانتباه — إيقاع وإبداع وتفاصيل.',
      image: 'role-06-video-editor.jpg', animation: 'slide-up' },
    { id: 7, roleEn: 'Videographer', roleAr: 'التصوير السينمائي',
      descAr: 'بيحوّل الأفكار لمشاهد بتحرك القلوب — صوت وصورة.',
      image: 'role-07-videographer.jpg', animation: 'slide-right' },
    { id: 8, roleEn: 'Graphic Designer', roleAr: 'تصميم الجرافيك',
      descAr: 'بيحوّل الأفكار لهوية بصرية متسقة — كل حاجة بتطلع بنفس الشكل.',
      image: 'role-08-graphic-designer.jpg', animation: 'slide-left' }
  ];
  
  function basePath() {
    return (window.location.pathname.indexOf('/services/') > -1 ||
            window.location.pathname.indexOf('/blog/') > -1) ? '../' : '';
  }
  
  function renderTeam() {
    var grid = document.getElementById('teamGrid');
    if (!grid) return;
    var bp = basePath();
    
    grid.innerHTML = ROLES.map(function(r) {
      return '<article class="role-card role-card-' + r.id + ' ' + r.animation + '" data-role-id="' + r.id + '">' +
             '<div class="role-image-wrap">' +
             '<div class="role-image">' +
             '<img src="' + bp + 'assets/team/' + r.image + '" alt="' + r.roleEn + '" loading="lazy" ' +
             'onerror="this.parentElement.innerHTML=\'<div class=&quot;role-placeholder&quot;>🎬</div>\';" />' +
             '<div class="role-shutter"></div>' +
             '<div class="role-glow"></div>' +
             '</div></div>' +
             '<h3 class="role-name-en">' + r.roleEn + '</h3>' +
             '<p class="role-name-ar">' + r.roleAr + '</p>' +
             '<p class="role-desc">' + r.descAr + '</p>' +
             '<div class="role-line"></div>' +
             '</article>';
    }).join('');
    
    // Fallback لو GSAP مش موجود
    if (typeof gsap === 'undefined') {
      initFallbackReveal(grid);
      setTimeout(function() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
          initGSAPTeam();
        }
      }, 1500);
    } else {
      initGSAPTeam();
    }
  }
  
  function initFallbackReveal(grid) {
    if (!('IntersectionObserver' in window)) {
      grid.querySelectorAll('.role-card').forEach(function(el) { el.classList.add('animated-in'); });
      return;
    }
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          var delay = (parseInt(e.target.getAttribute('data-role-id')) || 0) * 80;
          setTimeout(function() { e.target.classList.add('animated-in'); }, delay);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -100px 0px' });
    grid.querySelectorAll('.role-card').forEach(function(el) { obs.observe(el); });
  }
  
  function initGSAPTeam() {
    if (typeof ScrollTrigger === 'undefined') {
      initFallbackReveal(document.getElementById('teamGrid'));
      return;
    }
    
    // 1. ظهور متتالي حسب النوع
    ScrollTrigger.batch('.role-card', {
      start: 'top 88%',
      onEnter: function(batch) {
        batch.forEach(function(card, i) {
          var isRight = card.classList.contains('slide-right');
          var isLeft = card.classList.contains('slide-left');
          gsap.fromTo(card,
            { opacity: 0, x: isRight ? 60 : (isLeft ? -60 : 0), y: isRight || isLeft ? 0 : 60 },
            { opacity: 1, x: 0, y: 0, duration: 0.9, delay: i * 0.12, ease: 'power3.out' }
          );
        });
      },
      once: true
    });
    
    // 2. أنيميشن مخصص لكل دور
    ROLES.forEach(function(r) {
      var card = document.querySelector('.role-card-' + r.id);
      if (!card) return;
      var img = card.querySelector('.role-image img');
      if (!img) return;
      
      var trig = { trigger: card, start: 'top 80%', toggleActions: 'play none none reverse' };
      
      switch (r.id) {
        case 1: // Account Manager — فقاعة كلام
          gsap.fromTo(card.querySelector('.role-glow'),
            { scale: 0.5, opacity: 0 },
            { scale: 1.4, opacity: 0, duration: 2.5, repeat: -1, ease: 'power2.out', scrollTrigger: trig });
          break;
        case 2: // Content Creator — كتابة
          gsap.fromTo(img, { scale: 1 }, { scale: 1.08, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', scrollTrigger: trig });
          break;
        case 3: // Content Strategist — رسم بياني
          gsap.fromTo(card.querySelector('.role-glow'),
            { opacity: 0, scale: 0.8 },
            { opacity: 0.6, scale: 1.2, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', scrollTrigger: trig });
          break;
        case 4: // Media Buyer — أشرطة
          gsap.fromTo(img, { y: 8 }, { y: -8, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', scrollTrigger: trig });
          break;
        case 5: // Photographer — فلاش
          gsap.to(card.querySelector('.role-shutter'),
            { opacity: 1, duration: 0.08, repeat: -1, repeatDelay: 3.5, scrollTrigger: trig });
          break;
        case 6: // Video Editor — انزلاق
          gsap.fromTo(img, { x: -6 }, { x: 6, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', scrollTrigger: trig });
          break;
        case 7: // Videographer — دوران
          gsap.to(img, { rotation: 8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', scrollTrigger: trig });
          break;
        case 8: // Graphic Designer — دوران خفيف
          gsap.to(img, { rotation: -8, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut', scrollTrigger: trig });
          break;
      }
    });
    
    // 3. العنوان
    gsap.fromTo('.team-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.team-intro', start: 'top 85%', once: true } });
    
    // 4. Divider
    gsap.fromTo('.team-divider', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: '.team-intro', start: 'top 75%', once: true } });
    
    // 5. Roles heading
    gsap.fromTo('.roles-heading h3', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.roles-heading', start: 'top 85%', once: true } });
  }
  
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderTeam);
  else renderTeam();
})();
