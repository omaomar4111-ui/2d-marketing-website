/* ============================================================
   2D MARKETING — CLIENTS LOGOS MODULE (19-20 UNIQUE CLIENTS)
   Two Marquee Rows (Opposite Directions) — NO GRID
   ============================================================ */
var CLIENT_LOGOS = [
  { name: 'BLILTNA', nameEn: 'BLILTNA', sector: 'زراعة', file: 'client-01-bliltna.png' },
  { name: 'Home IX', nameEn: 'HOME IX', sector: 'عقارات', file: 'client-02-home-ix.png' },
  { name: 'Kangaroo', nameEn: 'KANGAROO', sector: 'متاجر', file: 'client-03-kangaroo.png' },
  { name: 'دار', nameEn: 'DAR', sector: 'مطاعم', file: 'client-04-dar.png' },
  { name: 'NH Clinics', nameEn: 'NH CLINICS', sector: 'عيادات', file: 'client-05-nh-clinics.png' },
  { name: 'Unit X', nameEn: 'UNIT X', sector: 'عقارات', file: 'client-06-unit-x.png' },
  { name: 'Mountain View', nameEn: 'MOUNTAIN VIEW', sector: 'عقارات', file: 'client-07-mountain-view.png' },
  { name: 'Merath', nameEn: 'MERATH', sector: 'عقارات', file: 'client-08-merath.png' },
  { name: 'Memaar', nameEn: 'MEMAAR', sector: 'عقارات', file: 'client-09-memaar.png' },
  { name: 'SAK', nameEn: 'SAK', sector: 'عقارات', file: 'client-10-sak.png' },
  { name: 'The Address', nameEn: 'THE ADDRESS', sector: 'عقارات', file: 'client-11-address.png' },
  { name: 'Evergreen', nameEn: 'EVERGREEN', sector: 'عقارات', file: 'client-12-evergreen.png' },
  { name: 'JG', nameEn: 'JG', sector: 'عقارات', file: 'client-13-jg.png' },
  { name: 'Island Gym', nameEn: 'ISLAND GYM', sector: 'جيمات', file: 'client-14-island-gym.png' },
  { name: 'iSkin', nameEn: 'ISKIN', sector: 'تجميل', file: 'client-15-iskin.png' },
  { name: 'Paws Stylist', nameEn: 'PAWS STYLIST', sector: 'خدمات', file: 'client-16-paws.png' },
  { name: 'XGarage', nameEn: 'XGARAGE', sector: 'سيارات', file: 'client-17-xgarage.png' },
  { name: 'OVO', nameEn: 'OVO', sector: 'خدمات', file: 'client-18-ovo.png' },
  { name: 'SWAN', nameEn: 'SWAN', sector: 'طبي', file: 'client-19-swan.png' },
  { name: 'Godzilla Fitness', nameEn: 'GODZILLA', sector: 'جيمات', file: 'client-20-godzilla.png' }
];

function basePath() {
  return (window.location.pathname.indexOf('/services/') > -1 ||
          window.location.pathname.indexOf('/blog/') > -1) ? '../' : '';
}

function renderClients() {
  var trackTop = document.getElementById('clientsTrackTop');
  var trackBottom = document.getElementById('clientsTrackBottom');
  if (!trackTop || !trackBottom) return;
  
  var bp = basePath();
  var half = Math.ceil(CLIENT_LOGOS.length / 2);
  var rowTop = CLIENT_LOGOS.slice(0, half);
  var rowBottom = CLIENT_LOGOS.slice(half);
  
  function renderRow(items) {
    var doubled = items.concat(items);
    return doubled.map(function(logo) {
      var webp = logo.file.replace(/\.(png|jpg)$/i, '.webp');
      return '<div class="client-logo" title="' + logo.name + '">' +
             '  <picture>' +
             '    <source srcset="' + bp + 'assets/logos/clients/' + webp + '" type="image/webp">' +
             '    <img src="' + bp + 'assets/logos/clients/' + logo.file + '" alt="' + logo.name + '" loading="lazy" width="160" height="70" />' +
             '  </picture>' +
             '</div>';
    }).join('');
  }
  
  trackTop.innerHTML = renderRow(rowTop);
  trackBottom.innerHTML = renderRow(rowBottom);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderClients);
} else {
  renderClients();
}
