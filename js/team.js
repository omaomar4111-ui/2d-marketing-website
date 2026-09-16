/* ══════════════════════════════════════════════════════════════
   2D MARKETING — Team Section (6 Roles · 6 Cinematic Animations)
   No personal names — Professional Role Titles & Systems Only
   ══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';
  
  var ROLES = [
    {
      id: 1,
      roleEn: 'ACCOUNT MANAGER',
      roleAr: 'إدارة الحسابات والعملاء',
      descAr: 'حلقة الوصل اللي بتضمن أهدافك تتحول لخطة عمل حقيقية وتتنفذ بأعلى دقة وسرعة استجابة.',
      image: 'role-01-account-manager.png',
      animation: 'anim-aperture',
      badge: 'Client Lead'
    },
    {
      id: 2,
      roleEn: 'CONTENT CREATOR',
      roleAr: 'صناعة المحتوى الإبداعي',
      descAr: 'بيصنع أفكار وسيناريوهات بتشد انتباه جمهورك من أول ثانية وتوصل رسالة علامتك التجارية.',
      image: 'role-02-content-creator.png',
      animation: 'anim-filmstrip',
      badge: 'Creative Hooks'
    },
    {
      id: 3,
      roleEn: 'CONTENT STRATEGIST',
      roleAr: 'استراتيجية وتخطيط المحتوى',
      descAr: 'بيبني مسار المحتوى المبني على الأرقام وتحليل السوق والمنافسين لتحقيق أعلى تفاعل ومبيعات.',
      image: 'role-03-content-strategist.png',
      animation: 'anim-aperture',
      badge: 'Growth Engine'
    },
    {
      id: 4,
      roleEn: 'MEDIA BUYER',
      roleAr: 'إدارة الحملات الإعلانية',
      descAr: 'بيستهدف العميل الصح بأقل تكلفة للـ Lead وأعلى عائد على الإنفاق الإعلاني (ROAS موثق).',
      image: 'role-04-media-buyer.png',
      animation: 'anim-filmstrip',
      badge: 'Ad Performance'
    },
    {
      id: 5,
      roleEn: 'PHOTOGRAPHER',
      roleAr: 'التصوير الفوتوغرافي',
      descAr: 'بيلقط المشهد اللي يوقف السكرول ويبرز جودة علامتك التجارية بطريقة سينمائية لا تُنسى.',
      image: 'role-05-photographer.png',
      animation: 'anim-shutter',
      badge: 'Visual Mastery'
    },
    {
      id: 6,
      roleEn: 'VIDEO EDITOR',
      roleAr: 'المونتاج وصناعة الفيديو',
      descAr: 'بيحوّل اللقطات العادية لتحفة بصرية سريعة الإيقاع وتخطف الأنظار وتخدم هدف البيع المباشر.',
      image: 'role-06-video-editor.png',
      animation: 'anim-shutter',
      badge: 'Cinema Edit'
    }
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
      return '<article class="role-card ' + r.animation + '" data-role-id="' + r.id + '">' +
             '  <div class="role-badge">' + r.badge + '</div>' +
             '  <div class="role-image-wrap">' +
             '    <div class="role-image">' +
             '      <picture>' +
             '        <source srcset="' + bp + 'assets/team/' + r.image.replace('.png', '.webp') + '" type="image/webp">' +
             '        <img src="' + bp + 'assets/team/' + r.image + '" alt="' + r.roleEn + '" loading="lazy" width="300" height="300" />' +
             '      </picture>' +
             '      <div class="role-overlay-fx"></div>' +
             '    </div>' +
             '  </div>' +
             '  <div class="role-info">' +
             '    <h3 class="role-name-en">' + r.roleEn + '</h3>' +
             '    <p class="role-name-ar">' + r.roleAr + '</p>' +
             '    <p class="role-desc">' + r.descAr + '</p>' +
             '  </div>' +
             '  <div class="role-border-glow"></div>' +
             '</article>';
    }).join('');
    
    // Shutter blink click / hover actuation
    var shutterCards = grid.querySelectorAll('.anim-shutter');
    shutterCards.forEach(function(card) {
      card.addEventListener('mouseenter', function() {
        card.classList.remove('shutter-actuated');
        void card.offsetWidth;
        card.classList.add('shutter-actuated');
      });
    });
    
    // GSAP or IntersectionObserver reveal
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.batch('.role-card', {
        start: 'top 88%',
        onEnter: function(batch) {
          gsap.fromTo(batch, 
            { opacity: 0, y: 30, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.6, ease: 'power2.out' }
          );
        }
      });
    } else if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) {
            e.target.classList.add('animated-in');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.15 });
      grid.querySelectorAll('.role-card').forEach(function(el) { obs.observe(el); });
    } else {
      grid.querySelectorAll('.role-card').forEach(function(el) { el.classList.add('animated-in'); });
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTeam);
  } else {
    renderTeam();
  }
})();
