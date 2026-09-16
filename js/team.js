/* ============================================================
   2D MARKETING — TEAM MODULE
   ============================================================ */
(function() {
  'use strict';
  var TEAM = [];
  
  function renderTeam() {
    var grid = document.getElementById('teamGrid');
    if (!grid) return;
    if (!TEAM.length) {
      grid.innerHTML = '<p style="text-align:center;color:var(--c-w40);grid-column:1/-1;padding:var(--sp-8) 0;font-size:var(--t-base);">الفريق هيظهر هنا قريباً — جاري تجهيز الصور والبيانات</p>';
      return;
    }
    grid.innerHTML = TEAM.map(function(m) {
      var photo = m.photo ? '<img src="' + m.photo + '" alt="' + m.name + '" />' : '<span style="font-size:40px;">👤</span>';
      return '<div class="team-member"><div class="team-photo">' + photo + '</div><div class="team-name">' + m.name + '</div><div class="team-role">' + m.role + '</div></div>';
    }).join('');
  }
  
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderTeam);
  else renderTeam();
})();
