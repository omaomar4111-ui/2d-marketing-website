/* ============================================================
   2D MARKETING — CLIENTS LOGOS MODULE (20 CLIENTS)
   2-Track Opposing Marquee + Static Grid
   ============================================================ */
var CLIENT_LOGOS = [
  { name: 'بيلتنا', nameEn: 'BLILTNA', sector: 'زراعة وأغذية', file: 'client-01-bliltna.png' },
  { name: 'Home IX', nameEn: 'HOME IX', sector: 'عقارات', file: 'client-02-home-ix.png' },
  { name: 'Kangaroo', nameEn: 'KANGAROO', sector: 'متاجر', file: 'client-03-kangaroo.png' },
  { name: 'دار', nameEn: 'DAR', sector: 'مطاعم', file: 'client-04-dar.png' },
  { name: 'عيادات النيرة', nameEn: 'NH CLINICS', sector: 'عيادات طبية', file: 'client-05-nh-clinics.png' },
  { name: 'Unit X Real Estate', nameEn: 'UNIT X', sector: 'عقارات', file: 'client-06-unit-x.png' },
  { name: 'Mountain View', nameEn: 'MOUNTAIN VIEW', sector: 'عقارات', file: 'client-07-mountain-view.png' },
  { name: 'Merath Developments', nameEn: 'MERATH', sector: 'عقارات', file: 'client-08-merath.png' },
  { name: 'Memaar Almorshe', nameEn: 'MEMAAR', sector: 'عقارات', file: 'client-09-memaar.png' },
  { name: 'SAK Developments', nameEn: 'SAK', sector: 'عقارات', file: 'client-10-sak.png' },
  { name: 'The Address Investments', nameEn: 'THE ADDRESS', sector: 'عقارات', file: 'client-11-address.png' },
  { name: 'Evergreen', nameEn: 'EVERGREEN', sector: 'عقارات', file: 'client-12-evergreen.png' },
  { name: 'JG للاستثمار العقاري', nameEn: 'JG', sector: 'عقارات', file: 'client-13-jg.png' },
  { name: 'Island Gym', nameEn: 'ISLAND GYM', sector: 'جيمات', file: 'client-14-island-gym.png' },
  { name: 'iSkin', nameEn: 'ISKIN', sector: 'تجميل', file: 'client-15-iskin.png' },
  { name: 'Paws Stylist', nameEn: 'PAWS STYLIST', sector: 'خدمات', file: 'client-16-paws.png' },
  { name: 'XGarage', nameEn: 'XGARAGE', sector: 'خدمات السيارات', file: 'client-17-xgarage.png' },
  { name: 'OVO Beyond The Surface', nameEn: 'OVO', sector: 'خدمات', file: 'client-18-ovo.png' },
  { name: 'SWAN Medical Center', nameEn: 'SWAN MEDICAL', sector: 'عيادات طبية', file: 'client-19-swan.png' },
  { name: 'Godzilla Fitness Club', nameEn: 'GODZILLA', sector: 'جيمات ورياضة', file: 'client-20-godzilla.png' }
];

function basePath() {
  var p = window.location.pathname;
  if (p.indexOf('/services/') !== -1 || p.indexOf('/about/') !== -1 || p.indexOf('/contact/') !== -1 || p.indexOf('/case-studies/') !== -1) {
    return '../';
  }
  return './';
}

function renderClients() {
  var track1 = document.getElementById('clientsTrack1');
  var track2 = document.getElementById('clientsTrack2');
  var oldTrack = document.getElementById('clientsTrack');
  var grid = document.getElementById('clientsGrid');
  var bp = basePath();

  function createLogoEl(logo, isMarquee) {
    var item = document.createElement('div');
    item.className = isMarquee ? 'client-logo' : 'client-logo-static';
    item.title = logo.name + (logo.sector ? ' — ' + logo.sector : '');

    var img = document.createElement('img');
    img.src = bp + 'assets/logos/clients/' + logo.file;
    img.alt = logo.name;
    img.loading = isMarquee ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.onerror = function() {
      this.style.display = 'none';
      var badge = document.createElement('span');
      badge.className = 'client-fallback-badge';
      badge.textContent = logo.nameEn || logo.name;
      item.appendChild(badge);
    };

    item.appendChild(img);
    return item;
  }

  function renderRow(container, items) {
    if (!container) return;
    container.innerHTML = '';
    var frag = document.createDocumentFragment();
    for (var loop = 0; loop < 2; loop++) {
      for (var i = 0; i < items.length; i++) {
        frag.appendChild(createLogoEl(items[i], true));
      }
    }
    container.appendChild(frag);
  }

  var half = Math.ceil(CLIENT_LOGOS.length / 2);
  var row1 = CLIENT_LOGOS.slice(0, half);
  var row2 = CLIENT_LOGOS.slice(half);

  if (track1) renderRow(track1, row1);
  if (track2) renderRow(track2, row2);
  if (oldTrack) renderRow(oldTrack, CLIENT_LOGOS);

  if (grid) {
    grid.innerHTML = '';
    var gridFrag = document.createDocumentFragment();
    for (var j = 0; j < CLIENT_LOGOS.length; j++) {
      gridFrag.appendChild(createLogoEl(CLIENT_LOGOS[j], false));
    }
    grid.appendChild(gridFrag);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderClients);
} else {
  renderClients();
}
