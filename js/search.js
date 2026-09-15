/* ══════════════════════════════════════════════════════════════
   2D MARKETING — Search
══════════════════════════════════════════════════════════════ */
(function(){
'use strict';

var basePath = (window.location.pathname.indexOf('/services/')>-1 ||
                window.location.pathname.indexOf('/blog/')>-1)
               ? '../' : '';

var PAGES = [
  {url:basePath+'index.html',title:'الرئيسية',desc:'نظام نمو يبيع — Leads حقيقية وROI موثق'},
  {url:basePath+'services/index.html',title:'الخدمات',desc:'أنظمة نمو لكل قطاع — عيادات، جيمات، عقارات، متاجر'},
  {url:basePath+'services/clinics.html',title:'تسويق العيادات',desc:'نظام حجوزات طبي — Google + YouTube + Meta'},
  {url:basePath+'services/gyms.html',title:'تسويق الجيمات',desc:'نظام اشتراكات — حملات موسمية + Free Trials'},
  {url:basePath+'services/real-estate.html',title:'تسويق العقارات',desc:'Lead Scoring + Video Tours + Full-Funnel'},
  {url:basePath+'services/ecommerce.html',title:'تسويق المتاجر',desc:'Catalog Ads + CAPI + AOV Optimization'},
  {url:basePath+'about.html',title:'إحنا مين',desc:'بنبني أنظمة نمو — لا نبيع محتوى'},
  {url:basePath+'contact.html',title:'تواصل معانا',desc:'مكالمة تشخيص مجانية 20 دقيقة'},
  {url:basePath+'blog/index.html',title:'المدونة',desc:'مقالات عن التسويق والنظام والنتائج'},
  {url:basePath+'services/index.html',title:'الباقات',desc:'Growth, Scale, Authority — 12K to 30K EGP'}
];

function openSearch(){
  var o=document.getElementById('search-overlay');if(!o)return;
  o.classList.add('open');
  var i=document.getElementById('search-input');
  if(i){i.value='';i.focus();}
  renderResults('');
}

function closeSearch(){
  var o=document.getElementById('search-overlay');
  if(o)o.classList.remove('open');
}

function renderResults(q){
  var r=document.getElementById('search-results');if(!r)return;
  var query=q.trim().toLowerCase();
  if(!query){
    r.innerHTML='<div class="search-empty">اكتب عشان تبحث في الموقع</div>';
    return;
  }
  var matches=PAGES.filter(function(p){
    return p.title.toLowerCase().indexOf(query)>-1 ||
           p.desc.toLowerCase().indexOf(query)>-1;
  });
  if(!matches.length){
    r.innerHTML='<div class="search-empty">مفيش نتايج لـ "'+q+'"</div>';
    return;
  }
  var html='';
  matches.forEach(function(m){
    html+='<a href="'+m.url+'" class="search-result">';
    html+='<div class="search-result-title">'+m.title+'</div>';
    html+='<div class="search-result-desc">'+m.desc+'</div>';
    html+='</a>';
  });
  r.innerHTML=html;
}

function init(){
  document.addEventListener('keydown',function(e){
    if((e.ctrlKey||e.metaKey)&&e.key==='k'){
      e.preventDefault();openSearch();
    }
    if(e.key==='Escape')closeSearch();
  });
  var b=document.getElementById('search-btn');
  if(b)b.addEventListener('click',openSearch);
  var i=document.getElementById('search-input');
  if(i)i.addEventListener('input',function(){renderResults(this.value);});
  var o=document.getElementById('search-overlay');
  if(o)o.addEventListener('click',function(e){
    if(e.target===o)closeSearch();
  });
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
else init();
})();