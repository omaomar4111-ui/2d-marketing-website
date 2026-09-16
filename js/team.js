/* ══════════════════════════════════════════════════════════════
   2D MARKETING — Team Section (10 Roles · Interactive Animations)
   No personal names — Professional Role Titles & Systems Only
   ══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';
  
  var ROLES = [
  {
    "id": 1,
    "roleEn": "ACCOUNT MANAGER",
    "roleAr": "إدارة الحسابات والعملاء",
    "descAr": "حلقة الوصل اللي بتضمن أهدافك تتحول لخطة عمل حقيقية وتتنفذ بأعلى دقة وسرعة استجابة.",
    "image": "role-01-account-manager",
    "animation": "anim-aperture",
    "badge": "Client Lead"
  },
  {
    "id": 2,
    "roleEn": "CONTENT CREATOR",
    "roleAr": "صناعة المحتوى الإبداعي",
    "descAr": "بيصنع أفكار وسيناريوهات بتشد انتباه جمهورك من أول ثانية وتوصل رسالة علامتك التجارية.",
    "image": "role-02-content-creator",
    "animation": "anim-filmstrip",
    "badge": "Creative Hooks"
  },
  {
    "id": 3,
    "roleEn": "CONTENT STRATEGIST",
    "roleAr": "استراتيجية وتخطيط المحتوى",
    "descAr": "بيبني مسار المحتوى المبني على الأرقام وتحليل السوق والمنافسين لتحقيق أعلى تفاعل ومبيعات.",
    "image": "role-03-content-strategist",
    "animation": "anim-tilt3d",
    "badge": "Growth Engine"
  },
  {
    "id": 4,
    "roleEn": "MEDIA BUYER",
    "roleAr": "إدارة الحملات الإعلانية",
    "descAr": "بيستهدف العميل الصح بأقل تكلفة للـ Lead وأعلى عائد على الإنفاق الإعلاني (ROAS موثق).",
    "image": "role-04-media-buyer",
    "animation": "anim-focuspull",
    "badge": "Ad Performance"
  },
  {
    "id": 5,
    "roleEn": "PHOTOGRAPHER",
    "roleAr": "التصوير الفوتوغرافي",
    "descAr": "بيلقط المشهد اللي يوقف السكرول ويبرز جودة علامتك التجارية بطريقة سينمائية لا تُنسى.",
    "image": "role-05-photographer",
    "animation": "anim-shutter",
    "badge": "Visual Mastery"
  },
  {
    "id": 6,
    "roleEn": "VIDEO EDITOR",
    "roleAr": "المونتاج وصناعة الفيديو",
    "descAr": "بيحوّل اللقطات العادية لتحفة بصرية سريعة الإيقاع وتخطف الأنظار وتخدم هدف البيع المباشر.",
    "image": "role-06-video-editor",
    "animation": "anim-liftglow",
    "badge": "Cinema Edit"
  },
  {
    "id": 7,
    "roleEn": "MARKETING MANAGER",
    "roleAr": "إدارة وتوجيه التسويق",
    "descAr": "بيقود الاستراتيجية التسويقية الشاملة ويضمن تناغم كل عناصر الحملة لتحقيق أهداف البيع والنمو.",
    "image": "role-07-marketing-manager",
    "animation": "anim-aperture",
    "badge": "Strategy Lead"
  },
  {
    "id": 8,
    "roleEn": "WEB DEVELOPER",
    "roleAr": "تطوير وبرمجة المواقع",
    "descAr": "بيبني صفحات هبوط وتجارب ويب سريعة، متجاوبة ومصممة خصيصاً لتحويل الزوار إلى عملاء فعليين.",
    "image": "role-08-web-developer",
    "animation": "anim-filmstrip",
    "badge": "Tech & CRO"
  },
  {
    "id": 9,
    "roleEn": "SALES SPECIALIST",
    "roleAr": "المبيعات وتطوير الأعمال",
    "descAr": "بيحوّل العملاء المحتملين إلى صفقات رابحة ويبني علاقات طويلة الأمد تعظّم قيمة العميل.",
    "image": "role-09-sales",
    "animation": "anim-tilt3d",
    "badge": "Deal Closer"
  },
  {
    "id": 10,
    "roleEn": "GRAPHIC DESIGNER",
    "roleAr": "التصميم الجرافيكي والهوية البصرية",
    "descAr": "بيبتكر تصاميم وهوية بصرية مميزة تعبر عن علامتك التجارية وتثبت في ذهن العميل وتبيع.",
    "image": "role-10-graphic-designer",
    "animation": "anim-shutter",
    "badge": "Visual Identity"
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
    
    // If cards not already rendered statically in HTML, populate them
    if (grid.children.length === 0) {
      grid.innerHTML = ROLES.map(function(r) {
        return '<article class="role-card ' + r.animation + '" data-role-id="' + r.id + '">' +
               '  <div class="role-badge">' + r.badge + '</div>' +
               '  <div class="role-image-wrap">' +
               '    <div class="role-image">' +
               '      <picture>' +
               '        <source srcset="' + bp + 'assets/team/' + r.image + '.webp" type="image/webp">' +
               '        <img src="' + bp + 'assets/team/' + r.image + '.png" alt="' + r.roleEn + '" loading="lazy" width="300" height="300" />' +
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
    }
    
    // Shutter blink click / hover actuation
    var shutterCards = grid.querySelectorAll('.anim-shutter');
    shutterCards.forEach(function(card) {
      card.addEventListener('mouseenter', function() {
        card.classList.remove('shutter-actuated');
        void card.offsetWidth;
        card.classList.add('shutter-actuated');
      });
    });

    // Hash navigation handler for smooth scrolling to #team
    function checkHashScroll() {
      if (window.location.hash === '#team') {
        var tSec = document.getElementById('team');
        if (tSec) {
          setTimeout(function() {
            tSec.scrollIntoView({ behavior: 'smooth' });
          }, 120);
        }
      }
    }
    checkHashScroll();
    window.addEventListener('hashchange', checkHashScroll);
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTeam);
  } else {
    renderTeam();
  }
})();
